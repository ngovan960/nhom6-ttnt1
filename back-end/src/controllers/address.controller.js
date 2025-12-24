import Address from "../model/Address.js";

// helper validate bắt buộc khi create
const validateCreatePayload = (body) => {
  const required = [
    "full_name",
    "phone",
    "address_detail",
    "city",
    "district",
    "ward",
  ];

  for (const key of required) {
    if (!body[key] || String(body[key]).trim() === "") return key;
  }
  return null;
};

// [POST] /api/address
export const createAddress = async (req, res) => {
  try {
    const userId = req.user?.id; // auth middleware phải set req.user
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const missing = validateCreatePayload(req.body);
    if (missing) {
      return res.status(400).json({
        message: `Thiếu trường bắt buộc: ${missing}`,
      });
    }

    const {
      full_name,
      phone,
      address_detail,
      city,
      district,
      ward,
      is_default = false,
    } = req.body;

    // nếu set default -> bỏ default các địa chỉ khác của user
    if (is_default) {
      await Address.update(
        { is_default: false },
        { where: { user_id: userId } }
      );
    }

    const address = await Address.create({
      full_name: String(full_name).trim(),
      phone: String(phone).trim(),
      address_detail: String(address_detail).trim(),
      city: String(city).trim(),
      district: String(district).trim(),
      ward: String(ward).trim(),
      is_default: Boolean(is_default),
      user_id: userId,
    });

    return res.status(201).json(address);
  } catch (error) {
    return res.status(500).json({
      message: "Create address failed",
      error: error.message,
    });
  }
};

// [GET] /api/address
export const getAddress = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const list = await Address.findAll({
      where: { user_id: userId },
      order: [["is_default", "DESC"], ["createdAt", "DESC"]],
    });

    return res.json(list);
  } catch (error) {
    return res.status(500).json({
      message: "Get addresses failed",
      error: error.message,
    });
  }
};

// [GET] /api/address/:id
export const getAddressById = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;

    const address = await Address.findOne({
      where: { id, user_id: userId },
    });

    if (!address) return res.status(404).json({ message: "Address not found" });

    return res.json(address);
  } catch (error) {
    return res.status(500).json({
      message: "Get address failed",
      error: error.message,
    });
  }
};

// [PUT] /api/address/:id
export const updateAddress = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;

    const address = await Address.findOne({
      where: { id, user_id: userId },
    });

    if (!address) return res.status(404).json({ message: "Address not found" });

    // nếu update set default -> bỏ default các địa chỉ khác
    if (req.body?.is_default === true) {
      await Address.update(
        { is_default: false },
        { where: { user_id: userId } }
      );
    }

    // chỉ update các field cho phép
    const allowedFields = [
      "full_name",
      "phone",
      "address_detail",
      "city",
      "district",
      "ward",
      "is_default",
    ];

    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // trim string fields
    ["full_name", "phone", "address_detail", "city", "district", "ward"].forEach(
      (k) => {
        if (updates[k] !== undefined) updates[k] = String(updates[k]).trim();
      }
    );

    // normalize boolean
    if (updates.is_default !== undefined) {
      updates.is_default = Boolean(updates.is_default);
    }

    await address.update(updates);

    return res.json(address);
  } catch (error) {
    return res.status(500).json({
      message: "Update address failed",
      error: error.message,
    });
  }
};

// [DELETE] /api/address/:id
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;

    const deleted = await Address.destroy({
      where: { id, user_id: userId },
    });

    if (!deleted) return res.status(404).json({ message: "Address not found" });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      message: "Delete address failed",
      error: error.message,
    });
  }
};

// [PUT] /api/address/:id/default
export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;

    const address = await Address.findOne({
      where: { id, user_id: userId },
    });

    if (!address) return res.status(404).json({ message: "Address not found" });

    await Address.update(
      { is_default: false },
      { where: { user_id: userId } }
    );

    await address.update({ is_default: true });

    return res.json(address);
  } catch (error) {
    return res.status(500).json({
      message: "Set default address failed",
      error: error.message,
    });
  }
};
