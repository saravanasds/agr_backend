import express from "express";
import { authRouter } from "./auth.js";
import { adminRouter } from "./admin.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);


export const indexRoutes = router;