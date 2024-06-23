import mongoose from "mongoose";
// import { Counter } from "./counter.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    guardian: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    alternateMobileNumber: {
      type: String,
    },
    aadharNo: {
      type: String,
      required: true,
    },
    adharProof: {
      type: String,
      required: true,
      // data: Buffer, // Changed to Buffer data type
      // contentType: String, // Added contentType to store MIME type
    },
    photo: {
      type: String,
      required: true,
      // data: Buffer, // Changed to Buffer data type
      // contentType: String, // Added contentType to store MIME type
    },
    nomineeName: {
      type: String,
      required: true,
    },
    nomineeRelationship: {
      type: String,
      required: true,
    },
    bankAcno: {
      type: String,
      required: true,
    },
    bankName: {
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
    gpayNumber: {
      type: String,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    paymentScreenshot: {
      type: String,
      required: true,
      // data: Buffer, // Changed to Buffer data type
      // contentType: String, // Added contentType to store MIME type
    },
    referralId: {
      type: String,
      required: true,
    },
    referredPeoples: { type: Array },
    referredBy: {
      type: String,
    },
    amount: {
      type: Number,
      default: 0,
    },
    levelAmount: {
      type: Number,
      default: 0,
    },
    referralAmount: {
      type: Number,
      default: 0,
    },
    bonusAmount: {
      type: Number,
      default: 0,
    },
    totalBonusAmount: {
      type: Number,
      default: 0,
    },
    availableLevelIncome: {
      type: Number,
      default: 0,
    },
    availableReferralIncome: {
      type: Number,
      default: 0,
    },
    totalWithdrawAmount: {
      type: Number,
      default: 0,
    },
    totalLevelWithdrawAmount: {
      type: Number,
      default: 0,
    },
    totalReferralWithdrawAmount: {
      type: Number,
      default: 0,
    },
    referralWithdrawableAmount: {
      type: Number,
      default: 0,
    },
    levelWithdrawableAmount: {
      type: Number,
      default: 0,
    },
    levelWithdrawRequestAmount: {
      type: Number,
      default: 0,
    },
    levelValue: {
      type: Number,
      default: 0,
    },
    activationToken: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActivate: {
      type: Boolean,
      default: false,
    },
    randomString: String,
    randomStringExpires: Date,
    role: {
      type: String,
      default: "user",
    },
    level: {
      type: Number,
    },
    allParent: {
      type: Array,
    },
    nestedParent: {
      type: String,
    },
    child: {
      type: Array,
    },
    allChild: {
      type: Array,
    },
    withdrawHistory: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

// userSchema.pre("save", async function (next) {
//   let doc = this;
//   if (doc.isNew) {
//     try {
//       const counter = await Counter.findByIdAndUpdate(
//         { _id: "id" },
//         { $inc: { seq: 1 } },
//         { new: true, upsert: true }
//       ); 
//       doc.id = counter.seq;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   } else {
//     next();
//   }
// });

const User = mongoose.model("user", userSchema);

export { User };


// {
//       date: {
//         type: Date,
//       },
//       withdrawAmount: {
//         type: Number,
//       },
//       transactionNo: {
//         type: String,
//       },
//       status: {
//         type: String,
//       },
//       withdrawBankAccountNo: {
//         type: String,
//       },
//       withdrawBankAccountName: {
//         type: String,
//       },
//       withdrawIfsc: {
//         type: String,
//       },
//     },