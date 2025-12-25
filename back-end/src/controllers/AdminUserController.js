import db from "../model/index.js";
import { Op } from "sequelize";

const { User } = db;

/**
 * Lấy danh sách tất cả người dùng có phân trang, tìm kiếm và lọc theo vai trò.
 * @param {Object} req - Đối tượng request, chứa query params: page, limit, search, role.
 * @param {Object} res - Đối tượng response.
 */
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { fullname: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }

    if (role) {
      whereClause.role = role;
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: { exclude: ["password_hash"] },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      totalUsers: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      users,
    });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách người dùng" });
  }
};

/**
 * Lấy thông tin chi tiết của một người dùng dựa trên ID, bao gồm địa chỉ và các đơn hàng gần đây.
 * @param {Object} req - Đối tượng request, chứa params id.
 * @param {Object} res - Đối tượng response.
 */
export const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password_hash"] },
      include: [
        { model: db.Address },
        { model: db.Order, limit: 5, order: [["createdAt", "DESC"]] },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy chi tiết người dùng" });
  }
};

/**
 * Cập nhật thông tin người dùng (vai trò, họ tên, số điện thoại) bởi Admin.
 * @param {Object} req - Đối tượng request, chứa params id và body gồm role, fullname, phone.
 * @param {Object} res - Đối tượng response.
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, fullname, phone } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Only allow specific updates from admin panel user list usually
    if (role) user.role = role;
    if (fullname) user.fullname = fullname;
    if (phone) user.phone = phone;

    await user.save();

    res.json({ message: "Cập nhật người dùng thành công", user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi cập nhật người dùng" });
  }
};

/**
 * Xóa người dùng khỏi hệ thống dựa trên ID.
 * @param {Object} req - Đối tượng request, chứa params id.
 * @param {Object} res - Đối tượng response.
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    await user.destroy();
    res.json({ message: "Đã xóa người dùng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi xóa người dùng" });
  }
};
