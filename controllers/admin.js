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

export { activateUser, deleteUser };
