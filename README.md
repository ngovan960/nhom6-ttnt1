# E-Commerce Backend API

API backend cho hệ thống bán hàng trực tuyến.

---

## Base URL

```
http://localhost:3001/api
```

---

## 1. Authentication (Đăng nhập / Đăng ký)

### 1.1. Register (Đăng ký)

* **URL:** `/auth/register`
* **Method:** `POST`
* **Body:**

```json
{
  "fullname": "Nguyen Van A",
  "email": "user@example.com",
  "password": "123456"
}
```

* **Response:**

```json
{
  "user": {
    "id": 1,
    "fullname": "Nguyen Van A",
    "email": "user@example.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

### 1.2. Login (Đăng nhập)

* **URL:** `/auth/login`
* **Method:** `POST`
* **Body:**

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

* **Response:**

```json
{
  "user": { "id": 1, "fullname": "Nguyen Van A", "email": "user@example.com", "role": "user" },
  "token": "jwt_token_here"
}
```

---

## 2. Products (Sản phẩm)

### 2.1. Get all products

* **URL:** `/products`
* **Method:** `GET`
* **Response:**

```json
[
  {
    "id": 1,
    "name": "Laptop ABC",
    "price": 1500,
    "description": "Laptop hiệu ABC",
    "images": [{"id":1,"image_url":"url_here"}]
  }
]
```

### 2.2. Get product by ID

* **URL:** `/products/:id`
* **Method:** `GET`
* **Response:**

```json
{
  "id": 1,
  "name": "Laptop ABC",
  "price": 1500,
  "description": "Laptop hiệu ABC",
  "images": [{"id":1,"image_url":"url_here"}]
}
```

### 2.3. Get products by category

* **URL:** `/products/category/:categoryId`
* **Method:** `GET`
* **Response:** Danh sách sản phẩm trong category

---

## 3. Orders (Đơn hàng)

### 3.1. Create order

* **URL:** `/orders`
* **Method:** `POST`
* **Body:**

```json
{
  "user_id": 1,
  "address_id": 2,
  "order_items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 3, "quantity": 1 }
  ]
}
```

* **Response:**

```json
{
  "id": 10,
  "user_id": 1,
  "status": "pending",
  "total": 3200
}
```

### 3.2. Get user orders

* **URL:** `/orders/my`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <token>`
* **Response:**

```json
[
  {
    "id": 10,
    "status": "pending",
    "total": 3200,
    "order_items": [
      { "product_id": 1, "quantity": 2 },
      { "product_id": 3, "quantity": 1 }
    ]
  }
]
```

---

## 4. Cart (Giỏ hàng)

### 4.1. Get cart

* **URL:** `/cart`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <token>`
* **Response:**

```json
{
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 3, "quantity": 1 }
  ]
}
```

### 4.2. Add item to cart

* **URL:** `/cart`
* **Method:** `POST`
* **Headers:** `Authorization: Bearer <token>`
* **Body:**

```json
{
  "product_id": 1,
  "quantity": 2
}
```

* **Response:**

```json
{
  "message": "Item added to cart"
}
```

---

## 5. Coupons (Mã giảm giá)

### 5.1. Create coupon

* **URL:** `/coupon`
* **Method:** `POST`
* **Body:**

```json
{
  "code": "DISCOUNT10",
  "discount": 10
}
```

* **Response:**

```json
{
  "id": 1,
  "code": "DISCOUNT10",
  "discount": 10
}
```

### 5.2. Validate coupon

* **URL:** `/coupon/validate`
* **Method:** `POST`
* **Body:**

```json
{
  "code": "DISCOUNT10"
}
```

* **Response:**

```json
{
  "valid": true,
  "discount": 10
}
```

---

## 6. Checkout (Thanh toán)

### 6.1. Checkout order

* **URL:** `/checkout`
* **Method:** `POST`
* **Headers:** `Authorization: Bearer <token>`
* **Body:**

```json
{
  "user_id": 1,
  "cart_items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 3, "quantity": 1 }
  ],
  "address_id": 2
}
```

* **Response:**

```json
{
  "order_id": 10,
  "status": "pending",
  "total": 3200
}
```

---


