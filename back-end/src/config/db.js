import { Sequelize } from "sequelize";

const sequelize = new Sequelize("thuyloidoan", "root", "123456", {
  host: "127.0.0.1",
  port: 3307,
  dialect: "mysql",
  logging: false,
});

export default sequelize;
