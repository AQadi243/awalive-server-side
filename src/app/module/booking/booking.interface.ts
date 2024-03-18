// import mongoose from 'mongoose';



export interface GuestData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string; // Add more properties as needed
  city?: string; // Add more properties as needed
  arrivalTime?: string; // Add more properties as needed
  message?: string; // Add more properties as needed
  // Other fields that might be part of guest data...
}

export interface TBookingData {
  checkIn: string;
  checkOut: string;
  guestData: GuestData;
  numberOfGuests: number;
  paymentType: string;
  roomId: string;
  userId: string; // Assuming the userId could be a string like an email
}



// export type TPopulatedRoom = {
//   _id: mongoose.Types.ObjectId;
//   title: { en: string; ar: string };
//   description: { en: string; ar: string };
//   size: { en: string; ar: string };
//   images: [];
//   subTitle:{
//     roomOne:{en: string; ar: string };
//     roomTwo?:{en: string; ar: string };

//   }

//   // Add other fields as necessary
// }

// type formData = {
//   address?: string;
//   arrivalTime?: string;
//   city?: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   message?: string;
//   phone: string;
// };

// export type TBooking = {
//   userEmail: string; // Foreign key referencing the user
//   roomId: mongoose.Schema.Types.ObjectId;

//   formData: formData;
//   checkIn: string;
//   checkOut: string;
//   night: number;
//   numberOfGuests: number;
//   tax: number;
//   totalPrice: number;
//   totalWithTax: number;
//   bookingStatus:  'Booked' | 'cancelled' | 'completed';
//   paymentStatus: 'pending' | 'paid';
// };

// export type TBooking = {
//     userID: mongoose.Schema.Types.ObjectId; // Foreign key referencing the user
//     roomId: mongoose.Schema.Types.ObjectId; // Foreign key referencing the room
//     checkInDate: string;
//     checkOutDate: string;
//     numberOfNights: number;
//     totalCost: number;
//     bookingStatus: 'pending' | 'Booked' | 'cancelled';
//     paymentStatus: 'pending' | 'paid';
//     bookRoomQTY: number;
//     isCancelled: boolean
//   };
