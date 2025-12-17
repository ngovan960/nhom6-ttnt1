import db from "../model/index.js";
const { Address } = db;

export const getAddress = async (req, res) => {
  try {
    const addresses = await Address.findAll({
      where: { user_id: req.user.id },
      order: [["is_default", "DESC"]],
    });

    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createAddress = async (req, res) => {
  try {
    const {
      full_name,
      phone,
      address_detail,
      city,
      district,
      ward,
      is_default,
    } = req.body;

    if (!full_name || !phone || !address_detail) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    if (is_default) {
      await Address.update(
        { is_default: false },
        { where: { user_id: req.user.id } }
      );
    }

    const address = await Address.create({
      full_name,
      phone,
      address_detail,
      city,
      district,
      ward,
      is_default: is_default || false,
      user_id: req.user.id,
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({
      where: { id, user_id: req.user.id },
    });

    if (!address) {
      return res.status(404).json({ message: "Không tìm thấy địa chỉ" });
    }

    if (req.body.is_default) {
      await Address.update(
        { is_default: false },
        { where: { user_id: req.user.id } }
      );
    }

    await address.update(req.body);

    res.json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({
      where: { id, user_id: req.user.id },
    });

    if (!address) {
      return res.status(404).json({ message: "Không tìm thấy địa chỉ" });
    }

    await address.destroy();
    res.json({ message: "Xóa địa chỉ thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
