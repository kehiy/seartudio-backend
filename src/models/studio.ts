import { Sequelize, DataTypes, Model } from 'sequelize';

export class Studio extends Model {
    id: string;
    studioId: number;
    name: string;
    phoneNumber: number;
    address: string;
    province: string;
    type: string;
    pricePerHour: number;
    openingHours: string;
    logo: string;
    image: string;
    email: string;
    telegramId: string;
    isActive: boolean;
    isPromoted: boolean;
    isVeryfied: boolean;
    expireDate: Date;
    description: string;
    passWord: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

export default function (sequelize: Sequelize): typeof Studio {
    Studio.init(
        {
            studioId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phoneNumber: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false
            },
            province: {
                type: DataTypes.STRING,
                allowNull: false,
                values: [
                    "آذربایجان شرقی",
                    "آذربایجان غربی",
                    "اردبیل",
                    "اصفهان",
                    "البرز",
                    "ایلام",
                    "بوشهر",
                    "تهران",
                    "چهارمحال و بختیاری",
                    "خراسان جنوبی",
                    "خراسان رضوی",
                    "خراسان شمالی",
                    "خوزستان",
                    "زنجان",
                    "سمنان",
                    "سیستان و بلوچستان",
                    "فارس",
                    "قزوین",
                    "قم",
                    "کردستان",
                    "کرمان",
                    "کرمانشاه",
                    "کهگیلویه و بویراحمد",
                    "گلستان",
                    "گیلان",
                    "لرستان",
                    "مازندران",
                    "مرکزی",
                    "هرمزگان",
                    "همدان",
                    "یزد"
                ],
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                values: ["خانگی", "حرفه ای"],
            },
            pricePerHour: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            openingHours: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            logo: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            image: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            telegramId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            isPromoted: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            isVeryfied: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            expireDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "studio",
            },
            passWord: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        { sequelize }
    );

    return Studio;
}
