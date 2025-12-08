import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

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
