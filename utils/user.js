import { User } from "../models/user.js";

export function getUserByEmail(request) {
  const email = request.body.email;
  if (email) {
    return User.findOne({
      email,
    });
  }
  return null;
}

export function getUserByActivationToken(request) {
  const activationToken = request.body.activationToken;
  if (activationToken) {
    return User.findOne({
      activationToken,
    });
  }
  return null;
}

export function getUserByRandomString(request) {
  const randomString = request.params.randomString;
  if (randomString) {
    return User.findOne({
      randomString,
    });
  }
  return null;
}

export function generateReferralId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let activationToken = "";
  for (let i = 0; i < 10; i++) {
    activationToken += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return activationToken;
}

export function getUsersOrderedByLevel() {
  // return User.find({ level: 1 }).sort({ level: 1 }); // 1 for ascending order
  return User.find({ level: 1 });
}
