import { Sequelize } from 'sequelize';
import pg from 'pg';

export default new Sequelize(
  // process.env.DB_NAME,
  // process.env.DB_USER,
  // process.env.DB_PASSWORD,
  "yummy_qfbg",
  "yummy_qfbg_user",
  "myW6oZiKuEBV4wKkVQTxwrYy1vJiqh70",
  {
    dialect: 'postgres',
    dialectModule: pg,
    // host: process.env.DB_HOST,
    // port: process.env.DB_PORT,
    host: 'dpg-clatfdu16hkc7380ppm0-a',
    port: 5432,
  }
);
