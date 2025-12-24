import { Op } from "sequelize";
import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Thiếu email hoặc password" });
    }

    // kiem tra du lieu
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      console.log("Ko co tk");
      return res.status(400).json({ message: "Sai tai khoan hoac mat khau" });
    }
    // kiem tra mat khau
    const isPassValid = await bcrypt.compare(password, user.password_hash);
    if (!isPassValid) {
      console.log("sai mk");
      return res.status(400).json({ message: "Sai tai khoan hoac mat khau" });
    }
    // tao token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
      },
      "key_secret_jwt",
      { expiresIn: "1d" }
    );

    // tra ve ket qua

    res.status(200).json({
      message: "Dang nhap thanh cong",
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
    console.log("dang nhap thanh cong");
  } catch (error) {
    console.error("Error in user login:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const userRegister = async (req, res) => {
  try {
    const { email, fullname, password, phone } = req.body;
    // kiem tra du lieu
    if (!email || !password || !phone || !fullname) {
      return res.status(400).json({ message: "Thieu du lieu" });
    }
    // kiem tra user ton tai
    const userExits = await User.findOne({
      where: { email: email },
    });
    if (userExits) {
      return res.status(400).json({ message: "User da ton tai" });
    }
    // ma hoa password
    const passwordHash = await bcrypt.hash(password, 10);

    // tao user moi
    const newUser = await User.create({
      email,
      fullname,
      password_hash: passwordHash,
      phone,
      role: "customer",
    });
    // tra ve ket qua
    res
      .status(201)
      .json({ message: "User registered successfully", data: newUser });
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({ message: "Server error registering user" });
  }
};

// send email reset password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // kiem tra du lieu
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "User khong ton tai" });
    }
    // tao token reset password
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15p
    // update user voi token
    await user.update({
      reset_token: resetToken,
      reset_token_expire: resetTokenExpiry,
    });
    // tao link reset password
    const resetLink = `http://172.24.80.1:3000/reset-password/${resetToken}`;

    // gui mail
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "nhobkg@gmail.com",
        pass: "mbns todg ctbh kejr",
      },
    });
    await transporter.sendMail({
      from: "nhobkg@gmail.com",
      to: email,
      subject: "Đặt lại mật khẩu",
      text: `Nhấn vào link này để đặt lại mật khẩu: ${resetLink}`,
    });
    res.json({ message: "Đã gửi email đặt lại mật khẩu" });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Server error during forgot password" });
  }
};

// verrify reset token
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      where: {
        reset_token: token,
        reset_token_expire: { [Op.gt]: Date.now() },
      },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
    res.json({ message: "Token hop le" });
  } catch (error) {
    console.error("Error in verify reset token:", error);
    res.status(500).json({ message: "Server error during verify reset token" });
  }
};

// reset password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      where: {
        reset_token: token,
        reset_token_expire: { [Op.gt]: Date.now() },
      },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
    // ma hoa mat khau moi
    const password_hash = await bcrypt.hash(newPassword, 10);
    // cap nhat mat khau moi
    await user.update({
      password_hash,
      reset_token: null,
      reset_token_expire: null,
    });
    res.json({ message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    console.error("Error in reset password:", error);
    res.status(500).json({ message: "Server error during reset password" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullname, phone } = req.body;
    if (!fullname && !phone) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    if (fullname) user.fullname = fullname;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      message: "Cập nhật hồ sơ thành công",
      data: user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật hồ sơ" });
  }
};
