/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { BookingWithRoomDetails, TBookingData } from './booking.interface';
// import BookingModel from './booking.model';
import AppError from '../../Error/errors/AppError';
import httpStatus from 'http-status';
// import { RoomModel } from '../room/room.model';
// import { sendEmail } from '../../utils/sendEmail';
// import { LanguageKey } from '../room/room.interface';
import { BookingModel } from './booking.model';
import { sendEmail } from '../../utils/sendEmail';
import { LanguageKey, TRoom } from '../room/room.interface';
// import { RoomModel } from '../room/room.model';


const generateRandomBookingNumber = () => {
  // Generates a random number between 100000000 and 999999999
  return Math.floor(100000000 + Math.random() * 900000000).toString();
};


const createBooking = async (bookingData: TBookingData) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Generate a unique, random booking number
    let unique = false;
    let bookingNumber;
    while (!unique) {
      bookingNumber = generateRandomBookingNumber();
      const existingBooking = await BookingModel.findOne({ bookingNumber }).session(session);
      if (!existingBooking) {
        unique = true;
      }
    }

    // Add the unique booking number to the booking data
    const finalBookingData = { ...bookingData, bookingNumber };
    const booking = new BookingModel(finalBookingData);
    const savedBooking = await booking.save({ session });
    
    if (!savedBooking) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Booking creation failed.');
    }
    const bookingResponse = savedBooking.toObject();
    
    const populatedBooking = (await savedBooking.populate('roomId')) as TBookingData  & { roomId: TRoom };
    
    if (populatedBooking.roomId) { // Check if roomId is populated
      const roomTitle = populatedBooking.roomId.title.en;
      // Email content
      const bookingConfirmationHtml = `
        <h1>Your Booking Confirmation</h1>
        <p>Dear ${populatedBooking.guestData.firstName},</p>
        <p>Thank you for your booking. Below are your booking details:</p>
        <ul>
          <li><strong>Booking Number:</strong> ${populatedBooking.bookingNumber}</li>
          <li><strong>Room Title:</strong> ${roomTitle}</li>
          <li><strong>Check-In Date:</strong> ${populatedBooking.checkIn}</li>
          <li><strong>Check-Out Date:</strong> ${populatedBooking.checkOut}</li>
          <li><strong>Number of Guests:</strong> ${populatedBooking.numberOfGuests}</li>
          </ul>
          <p>We look forward to hosting you soon!</p>
          `;
          
          // Send the confirmation email
          await sendEmail(populatedBooking.guestData.email, 'Your Booking Confirmation', bookingConfirmationHtml);
        }
        await session.commitTransaction();
       

    
    // Return the non-populated booking data
    return bookingResponse;
  } catch (error: any) {
    
    await session.abortTransaction();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Booking creation failed: ${error.message}`);
  } finally {
    session.endSession();
  }
};

// const createBookingInDb = async (bookingData: Partial<TBooking>) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Retrieve the room information from the database
//     const room = await RoomModel.findById(bookingData.roomId).session(session);
//     if (!room) {
//       throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
//     }
//     if (
//       typeof bookingData.checkIn !== 'string' ||
//       typeof bookingData.checkOut !== 'string'
//     ) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         'Invalid check-in or check-out date',
//       );
//     }
//     // Calculate the number of nights
//     const checkInDate = new Date(bookingData.checkIn);
//     const checkOutDate = new Date(bookingData.checkOut);
//     const night =
//       (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24);

//     // Calculate the total price and tax
//     const roomPrice = room.priceOptions[0].price; // Assuming using the first price option
//     const totalPrice = roomPrice * night;
//     const taxRate = 0.15; // 15%
//     const tax = totalPrice * taxRate;
//     const totalWithTax = totalPrice + tax;

//     // const formattedTotalPrice = totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//     // const formattedTax = tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//     // const formattedTotalWithTax = totalWithTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

//     // Format the prices to have 2 decimal places
//     const formattedTotalPrice = parseFloat(totalPrice.toFixed(2));
//     const formattedTax = parseFloat(tax.toFixed(2));
//     const formattedTotalWithTax = parseFloat(totalWithTax.toFixed(2));

//     // Set calculated values in booking data
//     bookingData.night = night;
//     bookingData.numberOfGuests = room.maxGuests;
//     bookingData.tax = formattedTax;
//     bookingData.totalPrice = formattedTotalPrice;
//     bookingData.totalWithTax = formattedTotalWithTax;

//     // Create the booking
//     const result = await BookingModel.create([bookingData], { session });
//     if (!result) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Booking creation failed');
//     }

//     // If booking creation is successful, send an email
//     const bookingConfirmationHtml = `<p>Your booking for ${room.title} is pending.</p><p>Total Price: ${totalWithTax}</p>`;
//     await sendEmail(bookingData.userEmail as string, 'You have booked', bookingConfirmationHtml);

//     await session.commitTransaction();
//     session.endSession();

//     return result;
//   } catch (error) {
//     console.error('Error in createBookingInDb:', error);
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };

const getBookingById = async (id: string) => {
  try {
      const booking = await BookingModel.findById(id)
          .populate('roomId') // Assumption: 'roomId' is the field in the Booking schema referencing the Room model.
          .exec(); // Executes the query

      if (!booking) {
          throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
      }

      return booking; // Return the found booking with populated room details
  } catch (error:any) {
      // console.error('Error in getBookingById:', error);
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Error fetching booking: ${error.message}`);
  }
};


const getAllBookings = async () => {
  try {
    const bookings = await BookingModel.find();
    return bookings;
  } catch (error:any) {
    // console.error('Error in getAllBookings:', error);
    throw new AppError( httpStatus.INTERNAL_SERVER_ERROR,`Error retrieving bookings. ${error.message}` ,
    );
  }
};

// const getBookingsByEmail = async (email: string, language: string)=>{
//   try {
//     const bookedRoom = await BookingModel.find({ userId: email });
    
//     if (!bookedRoom) {
//       throw new AppError( httpStatus.INTERNAL_SERVER_ERROR,`No Booking Found.`)
//     }
//     const populateRoomDetails = await RoomModel.findById(bookedRoom.).lean()
//   } catch (error) {
    
//   }
// }
const getBookingsByEmail = async (email: string, language: LanguageKey ) => {
  const session = await mongoose.startSession(); // Start a session for transaction
  session.startTransaction(); // Start the transaction


  try {
    const bookedRooms = await BookingModel.find({ userId: email })
      .populate('roomId', 'title description images priceOptions')
      .sort({ createdAt: -1 })
      .lean() as BookingWithRoomDetails[];

    if (bookedRooms.length === 0) {
      throw new AppError(httpStatus.NOT_FOUND, `No Booking Found for ${email}`);
    }

    const updates: any[] = []; // Array to hold update promises

    bookedRooms.forEach(booking => {
      // Check if booking status should be updated to 'completed'
      if (new Date(booking.checkOut).getTime() < Date.now() && booking.bookingStatus !== 'completed') {
        // Push the update promise into the updates array
        updates.push(
          BookingModel.updateOne(
            { _id: booking._id },
            { $set: { bookingStatus: 'completed' } },
            { session } // Use session for transaction
          )
        );
      }
    });

    // Wait for all updates to complete
    await Promise.all(updates);

    // If all updates succeed, commit the transaction
    await session.commitTransaction();

    const localizedBookedRooms = bookedRooms.map(booking => {
      return {
        ...booking,
        roomId: {
          ...booking.roomId,
          title: booking.roomId.title[language] || booking.roomId.title.en,
          description: booking.roomId.description[language] || booking.roomId.description.en,
          // Handle other fields similarly
        },
      };
    });

    return localizedBookedRooms;
  } catch (error:any) {
    // If an error occurs, abort the transaction
    await session.abortTransaction();
    throw new AppError(httpStatus.NOT_FOUND, `Error updating bookings: ${error.message}`);
  } finally {
    session.endSession();
  }
};



// const getBookingByEmail = async (email: string, language: LanguageKey) => {
//   try {
//     // Cast the result of populate to TBookingsRoom
//     const bookings = await BookingModel.find({ userEmail: email })
//       .populate<{ roomId: TPopulatedRoom}>('roomId')
//       .sort({ createdAt: -1 })
//       .lean();

//     if (!bookings || bookings.length === 0) {
//       throw new AppError(
//         httpStatus.NOT_FOUND,
//         'No bookings found for this email',
//       );
//     }
//     for (const booking of bookings) {
//       if (
//         new Date(booking.checkOut).getTime() < Date.now() &&
//         booking.bookingStatus !== 'completed'
//       ) {
//         booking.bookingStatus = 'completed';
//         // Update the booking in the database
//         await BookingModel.updateOne(
//           { _id: booking._id },
//           { $set: { bookingStatus: 'completed' } },
//         );
//         // Note: If working within a session or transaction, make sure to pass those as options to the updateOne call
//       }
//     }

//     const localizedBookings = bookings.map((booking) => {
//       const localizedRoom = booking.roomId
//         ? {
//             id: booking.roomId._id,
//             title: booking.roomId.title[language],
//             size: booking.roomId.size[language],
//             images: booking.roomId.images,
//             subTitle: booking.roomId.subTitle
//               ? {
//                   roomOne: booking.roomId.subTitle.roomOne[language],
//                   roomTwo:
//                     booking.roomId.subTitle.roomTwo &&
//                     booking.roomId.subTitle.roomTwo[language],
//                 }
//               : undefined,

//             // ... localize other fields as needed
//           }
//         : null;

//       return {
//         ...booking,
//         roomId: localizedRoom,
//       };
//     });

//     return localizedBookings;
//   } catch (error) {
//     if (error instanceof AppError) {
//       // Rethrow the error if it's an AppError
//       throw error;
//     }

//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       'Unexpected error in getBookingByEmail',
//     );
//   }
// };

// const getBookingByEmail = async (email: string, language: string) => {
//   const titleField = 'title[language]';
//   const descriptionField = `description.${language}`;
//   const sizeField = `size.${language}`;
//   try {
//     // const bookings = await BookingModel.find({ userEmail: email });
//     const bookings = await BookingModel.find({ userEmail: email }).populate({
//       path: 'roomId',
//       select: `${titleField} ${descriptionField} ${sizeField} maxGuests  images priceOptions isActive type`,
//     }); // Add the fields of the Room model you want to include

//     if (!bookings || bookings.length === 0) {
//       throw new AppError(httpStatus.NOT_FOUND, 'No bookings found for this email');
//     }
//     return bookings;
//   } catch (error: any) {
//     console.error('Error in getBookingByEmail:', error);
//     // throw error; // Re-throw the error to handle it in the calling function
//     throw new AppError(httpStatus.NOT_FOUND, `Error in getBookingByEmail: ${error.message}`)
//   }
// };

export const bookingService = {
  createBooking,
  getBookingById,
  getAllBookings,
  getBookingsByEmail,
};
