import mongoose from "mongoose";

const kycSchema = new mongoose.Schema({
  email: {
    type: String,
    // required: true,
  },
  name: {
    type: String,
    required: true,
  },
  guardian: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female",],
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
  adharno: {
    type: String,
    required: true,
  },
  adharproof: {
    type: String,
  },
  photo: {
    type: String,
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
    type: String,
  },
  referralId: {
    type: String,
  },
  amount: {
    type: Number,
  },
  paymentScreenshot: {
    type: String,
  }
});

const Kyc = mongoose.model("Kyc", kycSchema);

export { Kyc };
