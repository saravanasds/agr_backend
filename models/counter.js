import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true, default : "id" },
  seq: { type: Number, default: 0 },
  lastReset: {type : Date, default: new Date()},
});

const Counter = mongoose.model("Counter", counterSchema);
export { Counter };
