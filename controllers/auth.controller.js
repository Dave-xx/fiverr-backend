import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import createError from "./../utils/createError.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    // Hash the password
    const hash = bcrypt.hashSync(req.body.password, 10);

    // Create a new user object with the hashed password
    const newUser = new User({
      ...req.body,
      password: hash,
    });
    // Save the new user to the database
    await newUser.save();
    // Send a success response
    res.status(201).send("user has been created!");
  } catch (err) {
    // Pass the error to the error handling middleware
    next(err);
  }
};

export const login = async function (req, res, next) {
  try {
    // Find the user with the specified username
    const user = await User.findOne({ username: req.body.username });

    // If no user is found, create a 400 error and pass it to the next middleware function
    if (!user) {
      const error = createError(401, "User not registered!");
      return next(error);
    }

    // Check if the password provided matches the hashed password stored in the database
    const isCorrectPassword = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    // If the password is incorrect, create a 400 error and pass it to the next middleware function
    if (!isCorrectPassword) {
      const error = createError(401, "Wrong password or username");
      return next(error);
    }

    // If the password is correct, sign a JSON Web Token (JWT) containing the user ID and isSeller flag
    const token = jwt.sign(
      { id: user._id, isSeller: user.isSeller },
      process.env.JWT_key
    );

    // Remove the password field from the user object before sending it in the response
    // Set a cookie containing the JWT and send the user object as the response body
    const { password, ...info } = user._doc;
    res.cookie("accessToken", token, { httpOnly: true }).status(200).send(info);
  } catch (err) {
    // If an error occurs during the execution of the function, pass it to the next middleware function
    next(err);
  }
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", { samesite: "none", secure: true })
    .status(200)
    .send("User has been logged out.");
};
