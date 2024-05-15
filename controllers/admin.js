import {
  getUserByEmail,
} from "../utils/user.js";

import { User } from "../models/user.js";

const activateUser = async (req, res) => {
  try {
    const user = await getUserByEmail(req);

    if (!user) {
      return res.status(400).json({ error: "user not found..." });
    }

    user.isActivate = req.body.reqMessage;
    await user.save();

    return res.status(200).json({
      message: `${
        user.isActivate
          ? "Account activated successfully"
          : "Account deactivated successfully"
      }`,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server" });
  }
};

const allUsers = async (req, res)=>{
  try {
      const allUser = await User.find({});
      if (!allUser) {
        return res.status(401).json({ message: "Users not available..." });
      }

      return res.status(200).json({ data: allUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error...", error });    
  }
}

const activatedUser = async (req, res) => {
  try{
    const activeUsers = await User.find({ isActivate: true });
    if(!activeUsers){return res.status(400).json({message: "activated user not available..."})}

    return res.status(200).json({activatedUsers : activeUsers})
  }catch(error){
    res.status(500).json({message: "Internal server error...", error})
  }
}

const deactivatedUser = async (req, res) => {
  try {
    const activeUsers = await User.find({ isActivate: false });
    if (!activeUsers) {
      return res
        .status(400)
        .json({ message: "activated user not available..." });
    }

    return res.status(200).json({ activatedUsers: activeUsers });
  } catch (error) {
    res.status(500).json({ message: "Internal server error...", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const response = await User.deleteOne({
      email: req.body.email,
    });
    if (response?.deletedCount === 0) {
      return res.status(401).send({message : "User not found please check email..."});
    }
    return res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export { activateUser, deleteUser, activatedUser, deactivatedUser, allUsers };