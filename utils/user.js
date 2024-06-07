import { User } from "../models/user.js";

export function getUserByEmail(request) {
  return User.findOne({
    email: request.body.email,
  });
}

export function getUserByActivationToken(request) {
  return User.findOne({
    activationToken: request.body.activationToken,
  });
}

export function getUserByRandomString(request) {
  return User.findOne({
    randomString: request.params.randomString,
  });
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
  return User.find({ level: 1});
}
