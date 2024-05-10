import express from "express";
import {
  activateUser,
  forgotPassword,
  login,
  register,
  resetpassword,
  verifyRandomString,
  getPrivateData,
} from "../controllers/auth.js";
import { protectRoute } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();

// Multer configuration for file upload
const upload = multer({ dest: "uploads/" }); // Adjust destination directory as needed

router.post("/register", register, upload.fields([
  { name: "adharProof", maxCount: 1 },
  { name: "paymentScreenshot", maxCount: 1 },
  { name: "photo", maxCount: 1 }
]), async (req, res) => {
  try {
    // Assuming 'user' is the Mongoose model instance created in the register controller
    const adharProofData = req.files['adharProof'][0].buffer; // Accessing adharProof file data
    const adharProofContentType = req.files['adharProof'][0].mimetype; // Accessing adharProof content type

    const paymentScreenshotData = req.files['paymentScreenshot'][0].buffer; // Accessing paymentScreenshot file data
    const paymentScreenshotContentType = req.files['paymentScreenshot'][0].mimetype; // Accessing paymentScreenshot content type

    const photoData = req.files['photo'][0].buffer; // Accessing photo file data
    const photoContentType = req.files['photo'][0].mimetype; // Accessing photo content type

    // Assigning image data to the Mongoose model instance
    user.adharProof.data = adharProofData;
    user.adharProof.contentType = adharProofContentType;

    user.paymentScreenshot.data = paymentScreenshotData;
    user.paymentScreenshot.contentType = paymentScreenshotContentType;

    user.photo.data = photoData;
    user.photo.contentType = photoContentType;

    // Save the Mongoose model instance to the database
    await user.save();

    res.status(200).send("Files uploaded successfully");
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).send("Error uploading files");
  }
});

router.get("/activate/:activationToken", activateUser);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.get("/verifyRandomString/:randomString", verifyRandomString);
router.put("/resetpassword/:randomString", resetpassword);
router.get("/private", protectRoute, getPrivateData);

export const authRouter = router;
