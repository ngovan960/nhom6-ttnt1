import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Không có token" });
  }
  try {
    const decoded = jwt.verify(token, "key_secret_jwt");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Bạn không có quyền truy cập!" });
  }
};
