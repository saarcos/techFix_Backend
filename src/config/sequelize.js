import 'dotenv/config';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  dialectOptions: {
    timezone: 'Etc/UTC', // Mantén la base de datos trabajando en UTC
  },
  timezone: '-05:00', // Ajusta las fechas al huso horario de Ecuador (GMT-5)
});

export default sequelize;
