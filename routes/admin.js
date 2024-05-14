import express from "express";
import { activateUser,
  deleteUser, } from "../controllers/admin.js";

const router = express.Router();

router.post("/activateUser", activateUser);
router.post("/deleteUser", deleteUser);

export const adminRouter = router;

