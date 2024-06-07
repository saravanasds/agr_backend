import { User } from "../models/user.js";
import { WithdrawRequest } from "../models/withdraw.js";

const withdrawRequest = async (req, res) => {
  const { email, withdrawRequestAmount } = req.body;

  if (!email || !withdrawRequestAmount) {
    return res.status(400).send({ error: "Email and amount are required" });
  }

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let withdrawRequestId = "";
  for (let i = 0; i < 10; i++) {
    withdrawRequestId += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }

  const newAmount = user.amount - withdrawRequestAmount;

  await new WithdrawRequest({
    ...req.body,
    withdrawRequestId,
  }).save();

  user.amount = newAmount;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Request submitted successfully...",
  });
};

export { withdrawRequest };
