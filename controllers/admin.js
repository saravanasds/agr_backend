import { getUserByEmail } from "../utils/user.js";

import { User } from "../models/user.js";
import { Admin } from "../models/admin.js";
import { comparePassword, hashPassword } from "../utils/password.js";
// import jwt from "jsonwebtoken";
import { WithdrawRequest } from "../models/withdraw.js";
import { Notification } from "../models/notification.js";
import { sendToken } from "../utils/jwt.js";
import { WithdrawHistory } from "../models/withdrawHistory.js";
import { Bonus } from "../models/bonus.js";

const register = async (req, res) => {
  try {
    let admin = await Admin.findOne({
      email: req.body.email,
    });
    // console.log(admin);

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
    // console.log(admin);

    if (!admin) {
      return res
        .status(400)
        .json({ message: "Admin not found, please check email..." });
    }

    const isPasswordValid = await comparePassword(
      req.body.password,
      admin.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password..." });
    }

    // const token = generateToken(admin);
    // const token = jwt.sign(
    //   { _id: admin._id, email: admin.email },
    //   process.env.JWT_SECRET_KEY,
    //   // { expiresIn: JWT_EXPIRE }
    // );

    const token = sendToken(admin);

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
    if (!allUser) {
      return res.status(404).json({ message: "Users not available..." });
    }

    return res.status(200).json({ result: allUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error...", error });
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
    return res.status(500).json({ message: "Internal server error...", error });
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
  try {
    const {
      email,
      withdrawRequestId,
      date,
      withdrawLevelIncome,
      withdrawRefferalIncome,
      transactionNo,
      paymentStatus,
      bankName,
      bankAcno,
      ifsc,
    } = req.body;

    const withHistory = new WithdrawHistory({
      ...req.body,
    });

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found ..." });
    }

    const withdrawRequest = await WithdrawRequest.findOne({
      withdrawRequestId: withdrawRequestId,
    });

    if (!withdrawRequest) {
      return res
        .status(400)
        .json({ message: "Withdraw request ID not found..." });
    }

    if (
      !date ||
      !transactionNo ||
      !paymentStatus ||
      !bankAcno ||
      !bankName ||
      !ifsc
    ) {
      return res.status(400).json({
        message:
          "date, withdrawLevelIncome, transactionNo, paymentStatus, bankAcno, bankName, ifsc are all mandatory",
      });
    }
    const presLevelIncome = user.levelAmount - user.totalLevelWithdrawAmount;
    const presrefIncome =
      user.referralAmount - user.totalReferralWithdrawAmount;

    if (presLevelIncome < withdrawLevelIncome) {
      return res.status(400).json({ message: "Insufficient level amount..." });
    }

    if (presrefIncome < withdrawRefferalIncome) {
      return res
        .status(400)
        .json({ message: "Insufficient referral amount..." });
    }

    user.withdrawHistory.push(req.body);

    // admin.withdrawHistory.push(req.body);
    // console.log(withHistory);
    withHistory.withdrawHistory.push(req.body);

    if (withdrawLevelIncome) {
      user.totalLevelWithdrawAmount += withdrawLevelIncome;
    }

    if (withdrawRefferalIncome) {
      user.totalReferralWithdrawAmount += withdrawRefferalIncome;
    }
    user.availableLevelIncome =
      user.levelAmount - user.totalLevelWithdrawAmount;
    user.availableReferralIncome =
      user.referralAmount - user.totalReferralWithdrawAmount;

      
    user.levelWithdrawRequestAmount -= req.body.withdrawLevelIncome;
    user.levelWithdrawableAmount -= req.body.withdrawLevelIncome;

    await user.save();
    // await admin.save();
    await withHistory.save();

    await WithdrawRequest.deleteOne({ withdrawRequestId });

    return res
      .status(200)
      .json({ message: "Transaction details saved successfully..." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const rejectWithdrawRequest = async (req, res) => {
  try {
    const { email, withdrawRequestId } = req.body;
    console.log("cont/admin reject 249 : ", req.body);
    // const admin = await Admin.findOne({ email: adminEmail });

    // if (!admin) {
    //   return res.status(400).json({ message: "Admin not found ..." });
    // }

    const user = await User.findOne({ email });
    if (!user) {
      console.log(user);

      return res.status(400).json({ message: "User not found ..." });
    }
    const withHistory = new WithdrawHistory({
      ...req.body,
    });

    const withdrawRequest = await WithdrawRequest.findOne({
      withdrawRequestId: withdrawRequestId,
    });

    if (!withdrawRequest) {
      return res
        .status(400)
        .json({ message: "Withdraw request ID not found..." });
    }
    // ---------------------------------------------
    // update present available amount
    user.availableLevelIncome =
      user.levelAmount - user.totalLevelWithdrawAmount;

    user.availableReferralIncome =
      user.referralAmount - user.totalReferralWithdrawAmount;
    // ---------------------------------------------

    user.withdrawHistory.push(req.body);
    user.levelWithdrawableAmount += req.body.levelIncome;
    user.levelWithdrawRequestAmount -= req.body.levelIncome;

    user.referralWithdrawableAmount += req.body.referralIncome;

    withHistory.withdrawHistory.push(req.body);

    await user.save();
    await withHistory.save();
    await WithdrawRequest.deleteOne({ withdrawRequestId });

    return res.status(200).json({ message: "Rejected successfully..." });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error..." });
  }
};

const notification = async (req, res) => {
  try {
    await new Notification({
      ...req.body,
    }).save();

    return res
      .status(200)
      .json({ message: "Notification updated successfully..." });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const assignBonus = async (req, res) => {
  try {
    const {referralId, bonusValue, subject, date} = req.body;
    
    const user = await User.findOne({referralId});

    if(!user){
      return res.status(400).json({message : "user not found"})
    }
    if(!referralId || !bonusValue || !subject || !date){
      return res.status(400).json({message : "All fields are required"});
    }
    const withHistory = new WithdrawHistory({});

    user.bonusAmount = bonusValue;
    user.totalBonusAmount += bonusValue;
    user.amount += bonusValue; 
    user.withdrawHistory.push({email : user.email, referralId, bonusValue, subject, date});
    withHistory.withdrawHistory.push({
      email : user.email, referralId, bonusValue, subject, date
    })
    await withHistory.save();
    await user.save();
    
    return res.status(200).json({message : "Bonus sent successfully"})
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const bonusHistory = async (req, res) => {
  try {
    const users = await User.find({}, "withdrawHistory");
    const bonusHistory = users.flatMap((user) => user.withdrawHistory);

    return res.status(200).json(bonusHistory);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const referralHistory = async (req, res) => {
  try {
    const users = await User.find({}, "withdrawHistory");
    const referralHistory = users.flatMap((user) => user.withdrawHistory);

    return res.status(200).json(referralHistory);
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
    //     .status(400)
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
  rejectWithdrawRequest,
  assignBonus,
  bonusHistory,
  referralHistory,
};
