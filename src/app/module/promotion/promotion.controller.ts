import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { PromotionRoomService } from './promotion.service';

const createPromotionRoom = catchAsync(async (req: Request, res: Response) => {
  //saving to db
  const result = await PromotionRoomService.createPromotion(req.body);

  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'room not created',
      data: res,
    });
  } else {
    res.status(200).json({
      success: true,
      message: 'room is created successfully',
      data: result,
    });
  }
});


const findAllPromotionRooms = catchAsync(async (req: Request, res: Response) => {
    const language = req.query.lang as string || 'en';

  const result = await PromotionRoomService.getAllPromotionRooms(language);

  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'rooms not found',
      data: res,
    });
  } else {
    res.status(200).json({
      success: true,
      message: 'room is retrieved successfully',
      data: result,
    });
  }
});

export const PromotionRoomController = {
  createPromotionRoom,
  findAllPromotionRooms
};
