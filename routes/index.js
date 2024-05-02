import express from "express";
import { authRouter } from "./auth.js";
import { kycRouter } from "./kyc.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/kyc", kycRouter);

export const indexRoutes = router;
