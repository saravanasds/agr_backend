import express from "express";
import {
  register,
  login,
  activateUser,
  deleteUser,
  activatedUser,
  deactivatedUser,
  allUsers,
  withdrawRequestUsers,
  approveWithdrawRequest,
  notification,
  rejectWithdrawRequest,
  assignBonus,
  bonusHistory,
  referralHistory,
  // levelIncomeHistory
} from "../controllers/admin.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/activateUser", protectRoute, activateUser);
router.post("/deleteUser",protectRoute, deleteUser);
router.post("/activatedUser",protectRoute, activatedUser);
router.post("/deactivatedUser",protectRoute, deactivatedUser);
router.get("/allUsers",protectRoute, allUsers);
router.get("/withdrawRequestUser", protectRoute, withdrawRequestUsers);
router.post("/approveWithdrawRequest", protectRoute, approveWithdrawRequest);
router.post("/rejectWithdrawRequest", protectRoute, rejectWithdrawRequest);
router.post("/notification", protectRoute, notification);
router.post("/assignBonus", protectRoute, assignBonus);
router.get("/bonusHistory", protectRoute, bonusHistory);
router.get("/referralHistory", protectRoute, referralHistory);
// router.get("/levelIncomeHistory", protectRoute, levelIncomeHistory);

export const adminRouter = router;