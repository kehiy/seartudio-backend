import { Sequelize, DataTypes, Model } from 'sequelize';

export class Newsletter extends Model {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export default function (sequelize: Sequelize): typeof Newsletter {
    Newsletter.init(
        {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique:true,
            },
        },
        { sequelize }
    );

    return Newsletter;
}
