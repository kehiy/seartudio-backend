import Sequelize from 'sequelize';
import { NODE_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } from '../config';
import Admin from '../models/admin';
import Studio from '../models/studio';

const sequelize = new Sequelize.Sequelize(DB_NAME, DB_USER, DB_PASS, {
  dialect: 'postgres',
  host: DB_HOST,
  port: 33570,
  pool: {
    min: 0,
    max: 5,
  },
});

sequelize.authenticate();

const DB = {
  Admin: Admin(sequelize),
  Studio: Studio(sequelize),
  sequelize,
};

export default DB;
