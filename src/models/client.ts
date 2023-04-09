import { Sequelize, DataTypes, Model } from 'sequelize';

export class Client extends Model {
  id: string;
  name: string;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function (sequelize: Sequelize): typeof Client {
  Client.init(
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
      },
      apiKey: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    { sequelize }
  );

  return Client;
}
