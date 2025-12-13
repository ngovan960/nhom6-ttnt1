import sequelize from "../config/db.js";
import Product from "./Product.js";
import Review from "./Review.js";
import Wishlist from "./Wishlist.js";

import Cart from "./Cart.js";
import CartItem from "./CartItem.js";
import Coupon from "./Coupon.js";
import Order from "./Order.js";
import OrderItem from "./OrderItem.js";


const db = {
  sequelize,
  Product,
  Review,
  Wishlist,
  Cart,
  CartItem,
  Coupon,
  Order,
  OrderItem,
};



Object.keys(db).forEach((k) => {
  if (db[k] && typeof db[k].associate === "function") db[k].associate(db);
});

export default db;
