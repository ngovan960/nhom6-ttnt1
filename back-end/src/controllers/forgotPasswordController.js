import crypto from "crypto";
import nodemailer from "nodemailer";

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
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // gui mail
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "nhobkg@gmail.com",
        pass: "Nhobkg123@",
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
