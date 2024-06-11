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

    if (user.levelAmount === 0) {
      return res.status(401).json({ message: "Insufficient Amount ..." });
    }

    if (user.levelAmount < levelIncome) {
      return res.status(401).json({ message: "Invalid level Amount" });
    }
    if (levelIncome <= 0) {
      return res.status(401).json({ message: "Please provide valid Amount" });
    }

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let withdrawRequestId = "";
    for (let i = 0; i < 10; i++) {
      withdrawRequestId += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    await new WithdrawRequest({
      ...req.body,
      withdrawRequestId,
    }).save();

    return res.status(200).json({
      success: true,
      message: "Request submitted successfully...",
    });
} catch (error) {
  return res.status(500).json({message : "Internal server error", error})
}
};

const referralIncomeWithdrawRequest = async (req, res) => {
  try {
    const { email, referralIncome } = req.body;

    if (!email) {
      return res.status(400).send({ error: "Please provide email ..." });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send({ error: "User not found ..." });
    }

    if (user.referralAmount === 0) {
      return res.status(401).json({ message: "Insufficient Amount ..." });
    }

    if (user.referralAmount < levelIncome) {
      return res.status(401).json({ message: "Invalid level Amount" });
    }
    if (referralIncome <= 0) {
      return res.status(401).json({ message: "Please provide valid Amount" });
    }

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let withdrawRequestId = "";
    for (let i = 0; i < 10; i++) {
      withdrawRequestId += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    await new WithdrawRequest({
      ...req.body,
      withdrawRequestId,
    }).save();

    return res.status(200).json({
      success: true,
      message: "Request submitted successfully...",
    });
  } catch (error) {
    res.status(500).json({message : "Internal server error", error})
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

export {
  levelIncomeWithdrawRequest,
  referralIncomeWithdrawRequest,
  notification,
};
