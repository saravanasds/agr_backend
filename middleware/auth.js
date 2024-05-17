import jwt from "jsonwebtoken";
import CustomError from "../utils/error.js";
import multer from "multer";

// Error handling middleware for Multer
const upload = multer();
upload.any(); // This will catch Multer errors

export const protectRoute = (req, res, next) => {
  const token = req.header("Authorization");

  console.log(token)
  if (!token || !token.startsWith("Bearer ")) {
    throw new CustomError("Access denied. Invalid token.", 401);
  }

  const authToken = token.slice(7); // Remove 'Bearer ' prefix

  console.log("auth token :", authToken)
  console.log("process.env.JWT_SECRET_KEY :", process.env.JWT_SECRET_KEY);
  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
    console.log("decoded : " , decoded)
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return next(new CustomError("Access denied. Invalid token.", 401));
  }
};

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer error occurred
    console.error("Multer error:", err);
    res.status(400).send("Multer error: " + err.message);
  } else {
    // Other errors
    console.error("Error:", err);
    res.status(500).send("Internal server error");
  }
};
