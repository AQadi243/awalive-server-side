"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionRoomController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const promotion_service_1 = require("./promotion.service");
const createPromotionRoom = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //saving to db
    const result = yield promotion_service_1.PromotionRoomService.createPromotion(req.body);
    if (!result) {
        return res.status(404).json({
            success: false,
            message: 'room not created',
            data: res,
        });
    }
    else {
        res.status(200).json({
            success: true,
            message: 'room is created successfully',
            data: result,
        });
    }
}));
const findAllPromotionRooms = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const language = req.query.lang || 'en';
    const result = yield promotion_service_1.PromotionRoomService.getAllPromotionRooms(language);
    if (!result) {
        return res.status(404).json({
            success: false,
            message: 'rooms not found',
            data: res,
        });
    }
    else {
        res.status(200).json({
            success: true,
            message: 'room is retrieved successfully',
            data: result,
        });
    }
}));
exports.PromotionRoomController = {
    createPromotionRoom,
    findAllPromotionRooms
};
