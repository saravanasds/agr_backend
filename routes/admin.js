import express from "express";
import {
  register,
  login,
  activateUser,
  deleteUser,
  activatedUser,
  deactivatedUser,
  allUsers,
} from "../controllers/admin.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/activateUser", protectRoute, activateUser);
router.post("/deleteUser",protectRoute, deleteUser);
router.post("/activatedUser",protectRoute, activatedUser);
router.post("/deactivatedUser",protectRoute, deactivatedUser);
router.post("/allUsers",protectRoute, allUsers);

export const adminRouter = router;