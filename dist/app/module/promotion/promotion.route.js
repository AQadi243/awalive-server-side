"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promotionRoomRoute = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../midleware/validateRequest");
// import isAdmin from "../../midleware/isAdmin";
// import { USER_ROLE } from "../../conestants/user.contents";
const promotion_validation_1 = __importDefault(require("./promotion.validation"));
const promotion_controller_1 = require("./promotion.controller");
const router = express_1.default.Router();
// router.post('/create', isAdmin(USER_ROLE.admin), validateRequest(RoomValidationSchema), createRoomController.createRoom )
router.post('/create', (0, validateRequest_1.validateRequest)(promotion_validation_1.default), promotion_controller_1.PromotionRoomController.createPromotionRoom);
router.get('/', promotion_controller_1.PromotionRoomController.findAllPromotionRooms);
exports.promotionRoomRoute = router;
