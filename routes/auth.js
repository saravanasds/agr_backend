import express from "express";
import {
  activateUser,
  forgotPassword,
  login,
  userExist,
  register,
  resetpassword,
  verifyRandomString,
  getPrivateData,
} from "../controllers/auth.js";
import { protectRoute } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save files to the 'uploads/' directory
  },
  filename: function (req, file, cb) {
    // cb(null, file.originalname); // Keep original filename
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
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
  register,
);

router.get("/activate/:activationToken", activateUser);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.get("/verifyRandomString/:randomString", verifyRandomString);
router.put("/resetpassword/:randomString", resetpassword);
router.get("/private", protectRoute, getPrivateData);

export const authRouter = router;
