import express from "express";
import {
  activateUser,
  deleteUser,
  activatedUser,
  deactivatedUser,
  allUsers,
} from "../controllers/admin.js";

const router = express.Router();

router.post("/activateUser", activateUser);
router.post("/deleteUser", deleteUser);
router.post("/activatedUser", activatedUser);
router.post("/deactivatedUser", deactivatedUser);
router.post("/allUsers", allUsers);

export const adminRouter = router;

