import { Sequelize } from "sequelize";

const sequelize = new Sequelize("backend", "root", "password_123", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
});

export default sequelize;