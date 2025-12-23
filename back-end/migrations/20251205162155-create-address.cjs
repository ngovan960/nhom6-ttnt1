export const createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      full_name,
      phone,
      address_detail,``
      city,
      district,
      ward,
      is_default = false,
    } = req.body;

    // ✅ Validate trước khi vào DB
    if (!full_name || !phone || !address_detail || !city || !district || !ward) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin địa chỉ",
      });
    }

    // ✅ Nếu set default → bỏ default cũ
    if (is_default) {
      await Address.update(
        { is_default: false },
        { where: { user_id: userId } }
      );
    }

    const address = await Address.create({
      full_name,
      phone,
      address_detail,
      city,
      district,
      ward,
      is_default,
      user_id: userId,
    });

    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
