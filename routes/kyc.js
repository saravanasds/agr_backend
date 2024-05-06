import express from "express";
import { kycUpdate } from "../controllers/kyc.js"

const router = express.Router();

router.post("/kycUpdate", kycUpdate);

export const kycRouter = router;

