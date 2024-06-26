import { Notification } from "../models/notification.js";
import { User } from "../models/user.js";
import { WithdrawRequest } from "../models/withdraw.js";

const levelIncomeWithdrawRequest = async (req, res) => {
  try {
    const { email, levelIncome } = req.body;

    if (!email) {
      return res.status(400).send({ error: "Please provide email ..." });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send({ error: "User not found ..." });
    }
    const preLevIncome = user.levelAmount - user.totalLevelWithdrawAmount;

    if (preLevIncome === 0) {
      return res.status(400).json({ message: "Insufficient Amount ..." });
    }

    if (preLevIncome < levelIncome) {
      return res.status(400).json({ message: "Invalid level Amount" });
    }
    if (levelIncome <= 0) {
      return res.status(400).json({ message: "Please provide valid Amount" });
    }

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let withdrawRequestId = "";
    for (let i = 0; i < 10; i++) {
      withdrawRequestId += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    if (user.levelValue <= 0) {
      return res.status(400).json({ message: "Amount not available" });
    }

    user.levelWithdrawRequestAmount += levelIncome; //levelWithdrawRequestAmount
    user.levelWithdrawableAmount -= levelIncome;
    // user.levelWithdrawableAmount = user.levelValue -  user.totalLevelWithdrawAmount + user.levelWithdrawRequestAmount;

    await new WithdrawRequest({
      ...req.body,
      withdrawRequestId,
    }).save();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Request submitted successfully...",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const referralIncomeWithdrawRequest = async (req, res) => {
  try {
    const { email, referralIncome } = req.body;
    console.log(email, referralIncome);

    if (!email) {
      return res.status(400).send({ error: "Please provide email ..." });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send({ error: "User not found ..." });
    }

    const presRefIncome =
      user.referralAmount - user.totalReferralWithdrawAmount;

    if (presRefIncome === 0) {
      return res.status(400).json({ message: "Insufficient Amount ..." });
    }

    if (presRefIncome < referralIncome) {
      return res.status(400).json({ message: "Invalid level Amount" });
    }
    if (referralIncome <= 0) {
      return res.status(400).json({ message: "Please provide valid Amount" });
    }

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let withdrawRequestId = "";
    for (let i = 0; i < 10; i++) {
      withdrawRequestId += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    user.availableLevelIncome =
      user.levelAmount - user.totalLevelWithdrawAmount;
    user.availableReferralIncome =
      user.referralAmount - user.totalReferralWithdrawAmount;

    user.referralWithdrawableAmount -= referralIncome;

    await user.save();

    await new WithdrawRequest({
      ...req.body,
      withdrawRequestId,
    }).save();

    return res.status(200).json({
      success: true,
      message: "Request submitted successfully...",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const notification = async (req, res) => {
  try {
    const notification = await Notification.find({});

    return res.status(200).json({ data: notification });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error...", error });
  }
};

const userData = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    user.levelWithdrawableAmount = user.levelValue - user.totalLevelWithdrawAmount - user.levelWithdrawRequestAmount;

    return res.status(200).json({ data: user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error...", error });
  }
};

export {
  levelIncomeWithdrawRequest,
  referralIncomeWithdrawRequest,
  notification,
  userData,
};
