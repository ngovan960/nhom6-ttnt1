import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "thuyloidoan",   // đúng tên database
  "root",          // user
  "123456",        // password
  {
    host: "127.0.0.1",
    port: 3307,    // port Docker
    dialect: "mysql",
    logging: false,
  }
);

export default sequelize;
