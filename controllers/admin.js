import { generateReferralId, getUserByEmail } from "../utils/user.js";

import { User } from "../models/user.js";
import { Admin } from "../models/admin.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import jwt from "jsonwebtoken";
import { WithdrawRequest } from "../models/withdraw.js";
import { Notification } from "../models/notification.js";

const register = async (req, res) => {
  try {
    let admin = await Admin.findOne({
      email: req.body.email,
    });
    console.log(admin);

    if (admin) {
      return res.status(400).json({ message: "This admin aldready exist..." });
    }

    const hashedPassword = await hashPassword(req.body.password);
    // console.log(hashedPassword);
    admin = await new Admin({
      ...req.body,
      password: hashedPassword,
    }).save();

    return res
      .status(200)
      .json({ message: "Admin registered successfully", admin });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const login = async (req, res) => {
  try {
    // console.log(req.body.email);
    let admin = await Admin.findOne({
      email: req.body.email,
    });
    console.log(admin);

    if (!admin) {
      return res
        .status(401)
        .json({ message: "Admin not found, please check email..." });
    }

    const isPasswordValid = await comparePassword(
      req.body.password,
      admin.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password..." });
    }

    // const token = generateToken(admin);
    const token = jwt.sign(
      { _id: admin._id, email: admin.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    return res
      .status(200)
      .json({ message: "Admin loggedin successfully...", data: admin, token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const activateUser = async (req, res) => {
  try {
    const user = await getUserByEmail(req);

    if (!user) {
      return res.status(400).json({ error: "user not found..." });
    }

    user.isActivate = req.body.reqMessage;
    await user.save();

    return res.status(200).json({
      message: `${
        user.isActivate
          ? "Account activated successfully"
          : "Account deactivated successfully"
      }`,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server" });
  }
};

const allUsers = async (req, res) => {
  try {
    const allUser = await User.find({});
    if (!allUser.length) {
      return res.status(401).json({ message: "Users not available..." });
    }

    return res.status(200).json({ result: allUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error...", error });
  }
};

const activatedUser = async (req, res) => {
  try {
    const activeUsers = await User.find({ isActivate: true });
    if (!activeUsers) {
      return res
        .status(400)
        .json({ message: "activated user not available..." });
    }

    return res.status(200).json({ activatedUsers: activeUsers });
  } catch (error) {
    res.status(500).json({ message: "Internal server error...", error });
  }
};

const deactivatedUser = async (req, res) => {
  try {
    const activeUsers = await User.find({ isActivate: false });
    if (!activeUsers) {
      return res
        .status(400)
        .json({ message: "activated user not available..." });
    }

    return res.status(200).json({ activatedUsers: activeUsers });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error...", error });
  }
};

const withdrawRequestUsers = async (req, res) => {
  try {
    const withdrawUsers = await WithdrawRequest.find({});

    return res.status(200).json({ result: withdrawUsers });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const approveWithdrawRequest = async (req, res) => {
  console.log("hi");
  try {
    const {
      email,
      withdrawRequestId,
      date,
      withdrawLevelIncome,
      withdrawRefferalIncome,
      transactionNo,
      paymentStatus,
      withdrawBankAccountName,
      withdrawBankAccountNo,
      withdrawIfsc,
    } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "user not found ..." });
    }
    const withdrawRequest = await WithdrawRequest.findOne({
      withdrawRequestId: withdrawRequestId,
    });

    if (!withdrawRequest) {
      return res
        .status(401)
        .json({ message: "withdrawRequest id not found..." });
    }

    if (
      !date ||
      !transactionNo ||
      !paymentStatus ||
      !withdrawBankAccountNo ||
      !withdrawBankAccountName ||
      !withdrawIfsc
    ) {
      return res
        .status(401)
        .json({
          message:
            "date, withdrawLevelIncome, transactionNo,  paymentStatus, withdrawBankAccountNo, withdrawBankAccountName, withdrawIfsc all datas are mandatory",
        });
    }

    const newData = [...user.withdrawHistory, req.body];
    if (user.levelAmount < withdrawLevelIncome) {
      return res.status(401).json({ message: "Insufficient level amount..." });
    }
    if (user.referralAmount < withdrawRefferalIncome) {
      return res
        .status(401)
        .json({ message: "Insufficient referral amount..." });
    }
    // console.log(newData);
    if (withdrawLevelIncome) {
      user.totalLevelWithdrawAmount += withdrawLevelIncome;
    }
    if (withdrawRefferalIncome) {
      user.totalReferralWithdrawAmount += withdrawRefferalIncome;
    }
    user.withdrawHistory = newData;
    await user.save();
    await withdrawRequest.deleteOne({ withdrawRequestId });

    return res
      .status(200)
      .json({ message: "Transaction details saved successfully..." });
  } catch (error) {
    // console.log(error)
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const notification = async (req, res) => {
  try {
    await new Notification({
      ...req.body,
    }).save();

    return res.status(200).json({message : "Notification updated successfully..."})
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    // const response = await User.deleteOne({
    //   email: req.body.email,
    // });
    // if (response?.deletedCount === 0) {
    //   return res
    //     .status(401)
    //     .send({ message: "User not found please check email..." });
    // }
    // return res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export {
  register,
  login,
  activateUser,
  deleteUser,
  activatedUser,
  deactivatedUser,
  allUsers,
  withdrawRequestUsers,
  approveWithdrawRequest,
  notification,
};
