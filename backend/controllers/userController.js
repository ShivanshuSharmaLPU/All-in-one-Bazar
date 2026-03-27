import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Session from "../models/sessionModel.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword, isVerified: true });
    return res.status(201).json({ success: true, message: "User registered successfully. You can now login.", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verify = async (req, res) => {
  res.status(200).json({ success: true, message: "Verification not required" });
};

export const reVerify = async (req, res) => {
  res.status(200).json({ success: true, message: "Verification not required" });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }
    const accesstoken = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: "10d" });
    const refreshtoken = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: "30d" });
    existingUser.isLoggedIn = true;
    await existingUser.save();
    const existingSession = await Session.findOne({ userId: existingUser._id });
    if (existingSession) await Session.findByIdAndDelete(existingSession._id);
    await Session.create({
      userId: existingUser._id,
      token: refreshtoken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    res.status(200).json({
      success: true,
      message: `Login successful ${existingUser.firstName}`,
      userId: existingUser._id,
      accesstoken,
      refreshtoken,
      user: existingUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user._id;
    await Session.deleteMany({ userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  res.status(500).json({ success: false, message: "Email service not configured" });
};

export const verifyOTP = async (req, res) => {
  res.status(500).json({ success: false, message: "OTP service not configured" });
};

export const changePassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const allUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password -otp -otpExpiry -token");
    if (!user) return res.status(404).json({ success: false, message: "User Not Found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id;
    const loggedInUser = req.user;
    const { firstName, lastName, address, city, zipCode, phoneNo, role } = req.body;
    if (loggedInUser._id.toString() !== userIdToUpdate && loggedInUser.role !== "admin") {
      return res.status(403).json({ success: false, message: "You are not allowed to update this profile" });
    }
    let user = await User.findById(userIdToUpdate);
    if (!user) return res.status(404).json({ success: false, message: "User Not Found" });
    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;
    if (req.file) {
      if (profilePicPublicId) await cloudinary.uploader.destroy(profilePicPublicId);
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "profiles" }, (error, result) => {
          if (error) reject(error); else resolve(result);
        });
        stream.end(req.file.buffer);
      });
      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
    }
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.address = address || user.address;
    user.city = city || user.city;
    user.zipCode = zipCode || user.zipCode;
    user.phoneNo = phoneNo || user.phoneNo;
    if (role) user.role = role;
    user.profilePic = profilePicUrl;
    user.profilePicPublicId = profilePicPublicId;
    const updatedUser = await user.save();
    return res.status(200).json({ success: true, message: "Profile Updated Successfully", user: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    await User.findByIdAndDelete(userId);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const googleCallback = async (req, res) => {
  try {
    const user = req.user;
    const accesstoken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "10d" });
    const refreshtoken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "30d" });
    user.isLoggedIn = true;
    await user.save();
    const existingSession = await Session.findOne({ userId: user._id });
    if (existingSession) await Session.findByIdAndDelete(existingSession._id);
    await Session.create({
      userId: user._id,
      token: refreshtoken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/auth/google/success?accesstoken=${accesstoken}&refreshtoken=${refreshtoken}&userId=${user._id}`);
  } catch (error) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/login?error=google_failed`);
  }
};