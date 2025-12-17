import sequelize from "../config/db.js";

// ===== IMPORT MODELS =====
import User from "./User.js";
import Address from "./Address.js";
import AdminLog from "./AdminLog.js";

import Product from "./Product.js";
import ProductImage from "./ProductImage.js";
import Category from "./Category.js";
import Review from "./Review.js";

import Cart from "./Cart.js";
import CartItem from "./CartItem.js";
import Wishlist from "./Wishlist.js";

import Order from "./Order.js";
import OrderItem from "./OrderItem.js";
import OrderStatusHistory from "./OrderStatusHistory.js";
import Payment from "./Payment.js";
import Coupon from "./Coupon.js";

import ProductCompare from "./ProductCompare.js";
import ProductCompareItem from "./ProductCompareItem.js";

import SearchLog from "./SearchLog.js";
import SalesReportCache from "./SalesReportCache.js";

import AIRequest from "./AIRequest.js";
import AIRecommendation from "./AIRecommendation.js";

// ===== GOM MODELS =====
const db = {
  sequelize,

  User,
  Address,
  AdminLog,

  Product,
  ProductImage,
  Category,
  Review,

  Cart,
  CartItem,
  Wishlist,

  Order,
  OrderItem,
  OrderStatusHistory,
  Payment,
  Coupon,

  ProductCompare,
  ProductCompareItem,

  SearchLog,
  SalesReportCache,

  AIRequest,
  AIRecommendation,
};

// ===== ASSOCIATIONS =====
Object.values(db).forEach((model) => {
  if (model?.associate) {
    model.associate(db);
  }
});

export default db;
