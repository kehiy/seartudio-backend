import DB from "../databases";
import jwt from "jsonwebtoken";
import messageEnum from "../enums/messageEnum";
import { apiResponse } from "utils/apiRespones";
import sharp from "sharp";
import fs from "fs";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

const Studio = DB.Studio;


export const addStudio = async (req, res) => {
    const { studioId, name, phoneNumber,
        address, province, type, license,
        pricePerHour, openingHours, email, stId,
        description, passWord } = req.body;

    const { logo, image } = req.file;

    const isExist = await Studio.findOne({
        where: {
            [Op.or]: [
                { email },
                { stId },
                { studioId },
            ]
        }
    });

    if(isExist){
        return apiResponse(res,409,messageEnum.user_exist,{
            "msg":"studio already exist in DB."
        });
    }


}