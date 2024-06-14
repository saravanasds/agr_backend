import { User } from "../models/user.js";
import sendEmail from "../utils/email.js";
import { generateActivationToken, sendToken } from "../utils/jwt.js";
import {
  comparePassword,
  hashPassword,
  hashSyncPassword,
} from "../utils/password.js";
import randomstring from "randomstring";
import {
  getUserByActivationToken,
  getUserByEmail,
  getUserByRandomString,
  generateReferralId,
  getUsersOrderedByLevel,
} from "../utils/user.js";
// import { request } from "express";

const getPrivateData = (req, res) => {
  // console.log(req.user);
  return res.status(200).json({
    success: true,
    message: "You got access to the private data in this route",
    user: req.user,
  });
};

const userExist = async (req, res) => {
  try {
    let user = await getUserByEmail(req);
    if (user) {
      return res.status(400).json({ error: "User Already Exist!" });
    } else {
      return res.status(200).json({ message: "This is new user" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server" });
  }
};

const register = async (req, res) => {
  try {
    // console.log(req.files)

    let user = await getUserByEmail(req);
    if (user) {
      return res.status(400).json({ error: "User Already Exist!" });
    }

    const allUsers = await User.find({});

    let hashedPassword = await hashPassword(req.body.password);

    const activationToken = generateActivationToken();

    const referralId = generateReferralId();
    let allParent = [];

    if (
      !req.files ||
      !req.files.adharProof ||
      !req.files.photo ||
      !req.files.paymentScreenshot
    ) {
      return res
        .status(400)
        .json({ error: "All required files must be uploaded" });
    }

    if (
      req.files.adharProof.length === 0 ||
      req.files.photo.length === 0 ||
      req.files.paymentScreenshot.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "All required files must be uploaded" });
    }
    let referredBy = req.body.referredBy;
    const referralUser = await User.findOne({
      referralId: req.body.referredBy,
    });

    if (!referralUser) {
      referredBy = "";
    }

    user = await new User({
      ...req.body,
      level: 1,
      password: hashedPassword,
      activationToken,
      adharProof: req.files.adharProof[0].path,
      photo: req.files.photo[0].path,
      paymentScreenshot: req.files.paymentScreenshot[0].path,
      referralId,
      referredBy,
    });

    // **************************************************

    let currentParentReferralId = "";
    let allParents = [];
    let currentParentAllChild = [];

    for (const userData of allUsers) {
      if (userData.level === 1 && userData.child.length < 3) {
        userData.child.push(referralId);

        // 1 level referral income
        userData.amount += 500;
        userData.levelAmount += 500;

        currentParentReferralId = userData.referralId;
        allParent = [...userData.allParent, userData.referralId];
        user.nestedParent = userData.referralId;
        allParents = userData.allParent;
        await user.save();

        userData.allChild.push(user.referralId);
        currentParentAllChild.push(userData.allChild);

        if (userData.child.length === 3) {
          userData.level = 2;
        }

        userData.availableLevelIncome =
          userData.levelAmount - userData.totalLevelWithdrawAmount;
        userData.availableReferralIncome =
          userData.referralAmount - userData.totalReferralWithdrawAmount;

        await userData.save();
        break;
      }
    }

    user.allParent = allParent;
    await user.save();

    for (const userData of allUsers) {
      // console.log("127 :", userData.referralId, referredBy, userData.referralId === referredBy);
      if (userData.referralId === referredBy) {
        userData.referredPeoples.push(user.referralId);
        userData.amount += 500;
        userData.referralAmount += 500;
      }

      if (allParent.includes(userData.referralId)) {
        if (
          userData.referralId != currentParentReferralId &&
          currentParentAllChild != 3
        ) {
          userData.amount += 100;
          userData.levelAmount += 100;
        }
      }

      if (allParents.includes(userData.referralId)) {
        userData.allChild.push(user.referralId);
      }

      if (
        userData.level === 2 &&
        userData.allChild.length >= 12 &&
        userData.allChild.length < 39
      ) {
        userData.level = 3;
      }

      if (
        userData.level === 3 &&
        userData.allChild.length >= 39 &&
        userData.allChild.length < 120
      ) {
        userData.level = 4;
      }
      if (
        userData.level === 4 &&
        userData.allChild.length >= 120 &&
        userData.allChild.length < 363
      ) {
        userData.level = 5;
      }
      if (
        userData.level === 5 &&
        userData.allChild.length >= 363 &&
        userData.allChild.length < 1092
      ) {
        userData.level = 6;
      }
      if (
        userData.level === 6 &&
        userData.allChild.length >= 1092 &&
        userData.allChild.length < 3279
      ) {
        userData.level = 7;
      }
      if (
        userData.level === 7 &&
        userData.allChild.length >= 3279 &&
        userData.allChild.length < 9840
      ) {
        userData.level = 8;
      }
      if (
        userData.level === 8 &&
        userData.allChild.length >= 9840 &&
        userData.allChild.length < 29523
      ) {
        userData.level = 9;
      }
      if (
        userData.level === 9 &&
        userData.allChild.length >= 29523 &&
        userData.allChild.length < 88572
      ) {
        userData.level = 10;
      }
      userData.availableLevelIncome =
        userData.levelAmount - userData.totalLevelWithdrawAmount;
      userData.availableReferralIncome =
        userData.referralAmount - userData.totalReferralWithdrawAmount;

      await userData.save();
    }

    // **************************************************

    const activationLink = `${process.env.BASE_URL}/activate/${activationToken}`;
    const htmlContent = `
        <p>Hello ${user.firstName},</p>
        <p>Thank you for registering with AGR Group of Company. To activate your account, click the button below:</p>
        <a href="${activationLink}">
        <button style="padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Activate Your Account
        </button>
        </a>
        `;

    await sendEmail(user.email, "Account Activation", htmlContent);

    return res.status(200).json({
      message: "Activation link sent to your email",
      // activationToken: activationToken,
    });
  } catch (error) {
    console.log("Error : ", error);
    return res.status(500).json({ message: "Internal Server error...", error });
  }
};

const activateUserEmail = async (req, res) => {
  try {
    const user = await getUserByActivationToken(req);
    // console.log("controllers/auth.js 116 :", user);
    if (!user) {
      return res.status(400).json({ error: "Invalid activation token!" });
    }

    user.isEmailVerified = true;
    user.activationToken = undefined;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server", error });
  }
};

const login = async (req, res) => {
  try {
    let user = await getUserByEmail(req);

    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found. Please register!" });
    }

    if (user.isActivate === false) {
      return res.status(400).json({ error: "Your account not activated..." });
    }

    // Verify the user's password
    const isPasswordValid = await comparePassword(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password!" });
    }

    // Generate and send an authentication token
    const token = sendToken(user);
    const userName = user.firstName;
    // Respond with a success message and the token
    res.status(200).json({ message: "Login successful", token, data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server" });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    // Check if the user exists based on their email
    const user = await getUserByEmail(req);

    if (!user) {
      res.status(404).json({ error: "User not found. Please register." });
    }

    // Generate a random reset token
    const resetToken = randomstring.generate(10); // Generate a 10-character random string
    const resetTokenExpires = Date.now() + 3600000; // Expires in 1 hour

    // Update the user with the reset token and its expiration time
    user.randomString = resetToken;
    user.randomStringExpires = resetTokenExpires;
    await user.save();

    const resetLink = `${process.env.BASE_URL}/verifyRandomString/${resetToken}`;

    // HTML content for the email
    const htmlContent = `
        <p>Hello ${user.firstName},</p>
        <p>You have requested to reset your password. Click the button below to reset it:</p>
        <a href="${resetLink}">
          <button style="padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Reset Your Password
          </button>
        </a>
      `;

    // Send the email with the password reset link
    await sendEmail(user.email, "Password Reset", htmlContent);

    return res.status(200).json({
      message: "Password reset link sent to your email",
      resetToken: resetToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyRandomString = async (req, res, next) => {
  try {
    // Find the user with the provided random string
    const user = await getUserByRandomString(req);

    if (!user) {
      res.status(400).json({ error: "Invalid Link" });
    }

    // Check if the reset token has expired (assuming the token expires after 1 hour)
    if (user.randomStringExpires < Date.now()) {
      res.status(400).json({ error: "Password reset link has expired" });
    }

    return res.status(200).json({ message: "Random String Verified" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const resetpassword = async (req, res, next) => {
  try {
    const user = await getUserByRandomString(req);

    if (!user) {
      res.status(400).json({ error: "Invalid Link" });
    }

    // Check if the reset token has expired (assuming the token expires after 1 hour)
    if (user.randomStringExpires < Date.now()) {
      res.status(400).json({ error: "Password reset link has expired" });
    }
    // Generate a new hashed password using the newPassword
    const hashedPassword = hashSyncPassword(req.body.password);

    // Update the user's password
    user.password = hashedPassword;

    // Clear the random string and its expiration
    user.randomString = undefined;
    user.randomStringExpires = undefined;

    // Save the user with the updated password
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  getPrivateData,
  userExist,
  register,
  login,
  forgotPassword,
  verifyRandomString,
  resetpassword,
  activateUserEmail,
};
