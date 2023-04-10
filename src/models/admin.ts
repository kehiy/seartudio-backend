import { Sequelize, DataTypes, Model } from 'sequelize';

export class Admin extends Model {
    id: string;
    role: string;
    email: string;
    passWord: string;
    createdAt: Date;
    updatedAt: Date;
}

export default function (sequelize: Sequelize): typeof Admin {
    Admin.init(
        {
            role: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "admin",
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            passWord: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        { sequelize }
    );

    return Admin;
}
