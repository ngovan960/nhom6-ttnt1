# TechZone - Hệ Thống Thương Mại Điện Tử Thiết Bị Công Nghệ

Chào mừng bạn đến với **TechZone**, một hệ thống thương mại điện tử hiện đại chuyên cung cấp các thiết bị công nghệ. Dự án được xây dựng với kiến trúc mạnh mẽ, tích hợp trí tuệ nhân tạo (AI) để tối ưu hóa trải nghiệm người dùng.

## 🚀 Tính Năng Chính

### 🛒 Thương Mại Điện Tử (E-commerce)
- **Quản lý sản phẩm:** Xem chi tiết, danh mục, lọc và tìm kiếm sản phẩm.
- **Giỏ hàng & Thanh toán:** Quy trình đặt hàng mượt mà, hỗ trợ mã giảm giá (Coupon).
- **Yêu thích (Wishlist):** Lưu lại các sản phẩm yêu thích.
- **Tài khoản người dùng:** Đăng ký, đăng nhập, quản lý địa chỉ và lịch sử đơn hàng.

### 🤖 Tích Hợp AI
- **Tìm kiếm AI:** Tìm kiếm sản phẩm thông minh bằng ngôn ngữ tự nhiên.
- **So sánh AI:** So sánh chi tiết thông số kỹ thuật giữa các sản phẩm.
- **Gợi ý AI:** Đưa ra các gợi ý sản phẩm phù hợp dựa trên nhu cầu người dùng.

### 🛠️ Quản Trị (Admin Panel)
- **Dashboard:** Thống kê doanh thu, đơn hàng và sản phẩm bán chạy.
- **Quản lý thực thể:** Điều hành người dùng, sản phẩm, đơn hàng và các chiến dịch khuyến mãi.

---

## 💻 Công Nghệ Sử Dụng

### Back-end
- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Sequelize (MySQL)
- **Caching:** Redis
- **AI Integration:** Google Generative AI (Gemini)
- **Khác:** JWT (Authentication), Nodemailer (Email), Bcrypt (Security).

### Front-end
- **Framework:** React + Vite
- **Language:** TypeScript
- **State Management:** Zustand
- **Styling:** CSS & TailwindCSS (tùy biến)
- **API Client:** Axios

---

## 🛠️ Hướng Dẫn Cài Đặt

### Tiền đề
- Node.js (v18+)
- MySQL
- Redis

### Bước 1: Cấu hình Back-end
1. Di chuyển vào thư mục `back-end`:
   ```bash
   cd back-end
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Tạo file `.env` dựa trên cấu trúc sau:
   ```env
   PORT=5000
   DB_NAME=techzone
   DB_USER=your_user
   DB_PASS=your_password
   DB_HOST=127.0.0.1
   JWT_SECRET=your_secret
   GEMINI_API_KEY=your_gemini_key
   REDIS_URL=redis://localhost:6379
   ```
4. Chạy dự án:
   ```bash
   npm start
   ```

### Bước 2: Cấu hình Front-end
1. Di chuyển vào thư mục `fe`:
   ```bash
   cd fe
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Chạy dự án:
   ```bash
   npm run dev
   ```

---

## 📂 Cơ Cấu Thư Mục

```text
├── back-end/
│   ├── src/
│   │   ├── controllers/    # Xử lý logic nghiệp vụ
│   │   ├── models/         # Định nghĩa cấu trúc database (Sequelize)
│   │   ├── routes/         # Định nghĩa các API endpoints
│   │   └── middlewares/    # Xác thực và phân quyền
│   └── migrations/         # Quản lý phiên bản database
├── fe/
│   ├── src/
│   ├── components/        # Các thành phần giao diện React
│   ├── services/          # Gọi API đến back-end
│   └── store/             # Quản lý trạng thái toàn cục (Zustand)
└── README.md
```

---

## 🤝 Đóng Góp
Nếu bạn có bất kỳ đóng góp nào cho dự án, vui lòng tạo **Pull Request** hoặc mở một **Issue**.

---
*Dự án được phát triển bởi Nhóm 6*
