import Sequelize from 'sequelize';
import { NODE_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } from '../config';
import Admin from '../models/admin';
import Studio from '../models/studio';
import Newsletter from '../models/newsLetter';

const sequelize = new Sequelize.Sequelize(DB_NAME, DB_USER, DB_PASS, {
  dialect: 'postgres',
  host: DB_HOST,
  port: 5432,
  pool: {
    min: 0,
    max: 5,
  },
});

sequelize.authenticate();

const DB = {
  Admin: Admin(sequelize),
  Studio: Studio(sequelize),
  Newsletter: Newsletter(sequelize),
  sequelize,
};

export default DB;
