import mongoose from "mongoose";

const getCurrentLocalTime = () => {
  const now = new Date();
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localTime;
};

const bonusSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required : true,
    },
    referalId : {
        type : String,
        required : true,
    },
    bonusValue : {
        type : Number,
        required : true,
    },
    subject : {
        type : String,
    },
    Date: {
      type: Date,
      default: getCurrentLocalTime,
    },
  },
  {
    timestamps: true,
  }
);

const Bonus = mongoose.model("Bonus", bonusSchema);

export { Bonus };
