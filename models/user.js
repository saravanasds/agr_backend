import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
    data: Buffer, // Changed to Buffer data type
    contentType: String, // Added contentType to store MIME type
  },
  photo: {
    data: Buffer, // Changed to Buffer data type
    contentType: String, // Added contentType to store MIME type
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
  upiId: {
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
  paymentScreenshot: {
    data: Buffer, // Changed to Buffer data type
    contentType: String, // Added contentType to store MIME type
  },
  referralId: {
    type: String,
  },
  amount: {
    type: Number,
  },
  activationToken: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  randomString: String,
  randomStringExpires: Date,
});

const User = mongoose.model("user", userSchema);

export { User };
