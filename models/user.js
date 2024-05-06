import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
