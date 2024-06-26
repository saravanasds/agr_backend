import express from "express";
import {
  activateUserEmail,
  forgotPassword,
  login,
  userExist,
  register,
  resetpassword,
  verifyRandomString,
  getPrivateData,
} from "../controllers/auth.js";
import {
  notification,
  levelIncomeWithdrawRequest,
  referralIncomeWithdrawRequest,
  userData,
} from "../controllers/user.js";
import { protectRoute } from "../middleware/auth.js";
// import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
// import { sendOtp, verifyOtp } from "../controllers/otpcontrol.js";

import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
// import dns from "dns";

const router = express.Router();

// Perform DNS lookup
// dns.lookup(
//   "agr-kyc-images.s3.ap-south-1.amazonaws.com",
//   (err, address, family) => {
//     if (err) {
//       console.error("DNS lookup failed:", err);
//     } else {
//       console.log("Address:", address);
//       console.log("Family:", family);
//     }
//   }
// );

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  },
  endpoint: "https://s3.ap-south-1.amazonaws.com", // Ensures usage of the IPv4 endpoint
  forcePathStyle: true, // Optional: Helps with path-style access
});

// -----------------------------------

const run = async () => {
  try {
    const data = await s3.send(new ListBucketsCommand({}));
    console.log("Success", data.Buckets);
  } catch (err) {
    console.error("Error", err);
  }
};

run();
// -----------------------------------

// Multer setup
const storage = multerS3({
  s3,
  bucket: process.env.AWS_BUCKETNAME,
  metadata: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, {
      fieldname: file.fieldname + "-" + uniqueSuffix + "_" + file.originalname,
    });
  },
  key: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/userExist", userExist);
router.post(
  "/register",
  upload.fields([
    { name: "adharProof", maxCount: 1 },
    { name: "paymentScreenshot", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  register
);

// router.get("/activate/:activationToken", activateUserEmail);
router.post("/activate", activateUserEmail);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.get("/verifyRandomString/:randomString", verifyRandomString);
router.put("/resetpassword/:randomString", resetpassword);
router.get("/private", protectRoute, getPrivateData);
router.post(
  "/levelIncomeWithdrawRequest",
  protectRoute,
  levelIncomeWithdrawRequest
);
router.post(
  "/referralIncomeWithdrawRequest",
  protectRoute,
  referralIncomeWithdrawRequest
);
router.post("/notification", notification);
router.post("/userData", protectRoute, userData);
// router.post("/sendOtp", sendOtp);
// router.post("/verifyOTP", verifyOtp);

export const authRouter = router;
