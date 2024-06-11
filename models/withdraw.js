import mongoose from "mongoose";

const getCurrentLocalTime = () => {
  const now = new Date();
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localTime;
};

const withdrawRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      //   unique: true,
      trim: true,
    },
    withdrawRequestId: {
      type: String,
      required: true,
    },
    referralId: {
      type: String,
      required: true,
    },
    // withdrawRequestAmount: {
    //   type: Number,
    //   required: true,
    // },
    levelIncome: {
      type : Number,
      default : 0,
    },
    referralIncome: {
      type : Number,
      default : 0,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    bankAcno: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    ifsc: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: getCurrentLocalTime,
    },
  },
  {
    timestamps: true,
  }
);

const WithdrawRequest = mongoose.model(
  "WithdrawRequest",
  withdrawRequestSchema
);

export { WithdrawRequest };
