import mongoose from "mongoose";

const userRegisterSchema = new mongoose.Schema(
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
    paymentScreenshot: {
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
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    referredBy: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    level : {
        type : Number,
    }
  },
  {
    timestamps: true,
  }
);

const UserRegister = mongoose.model("userRegister", userRegisterSchema);

export { UserRegister };
