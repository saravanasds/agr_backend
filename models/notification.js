import mongoose from "mongoose";

const getCurrentLocalTime = () => {
  const now = new Date();
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localTime;
};

const NotificationSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: getCurrentLocalTime,
    },
    content : {
        type : String,
        required : true
    }
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", NotificationSchema);

export { Notification };
