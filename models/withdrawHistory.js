import mongoose from "mongoose";

const getCurrentLocalTime = () => {
  const now = new Date();
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localTime;
};

const withdrawHistorySchema = new mongoose.Schema(
{
    withdrawHistory : {
        type : Array,
    },
    Date : {
        type : Date,
        default : getCurrentLocalTime
    }
},
  {
    timestamps: true,
  }
);

const WithdrawHistory = mongoose.model(
  "WithdrawHistory",
  withdrawHistorySchema
);

export { WithdrawHistory };
