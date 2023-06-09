import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).send(user);
  } catch (error) {
    return res.status(400).send("User not found");
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    return res.status(400).send("Users not found");
  }
};

// export const addUser = async (req, res, next) => {
//   try {
//     const newUser = new User(req.body);
//     await newUser.save();
//     res.status(200).send(newUser);
//   } catch (error) {
//     next(error);
//   }
// }

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (req.userId !== user._id.toString()) {
      return next(createError(403, "You can update only your account!"));
    }
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).send("Successfully updated!");
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (req.userId !== user._id.toString()) {
      return next(createError(403, "You can delete only your account!"));
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("Successfully deleted!");
  } catch (error) {
    next(error);
  }
};
