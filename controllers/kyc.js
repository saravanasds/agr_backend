import { User } from "../models/user.js";
import { Kyc } from "../models/kyc.js";

const kycUpdate = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log("email : ", email);

    // Query the database for the user with the specified email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found, email id not valid",
      });
    }

    // Find the KYC document for the user
    let kyc = await Kyc.findOne({ email });

    // If the KYC document doesn't exist, create a new one
    if (!kyc) {
      kyc = new Kyc({ email });
    }

    // Update the KYC document
    kyc.set(req.body);
    const updatedKyc = await kyc.save();

    return res.status(200).json({
      success: true,
      message: "KYC data updated successfully",
      // user: user,
      updatedKyc: updatedKyc,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { kycUpdate };
