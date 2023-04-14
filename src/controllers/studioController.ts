import DB from "../databases";
import jwt from "jsonwebtoken";
import messageEnum from "../enums/messageEnum";
import { apiResponse } from "utils/apiRespones";
import sharp from "sharp";
import fs from "fs";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { v4 } from "uuid";

const Studio = DB.Studio;


export const addStudio = async (req, res) => {
    const { studioId, name, phoneNumber,
        address, province, type, license,
        pricePerHour, email, telegramId,
        description, passWord } = req.body;

    const isExist = await Studio.findOne({
        where: {
            [Op.or]: [
                { email },
                { telegramId },
                { studioId },
            ]
        }
    });

    if(isExist){
        return apiResponse(res,409,messageEnum.studio_exist,{
            "msg":"studio already exist in DB."
        });
    }
    if (!req.files || Object.keys(req.files).length === 0) {
        return apiResponse(res, 400, messageEnum.bad_request, "");
    }

    if (req.files.image.mimetype === "image/jpeg" || req.files.image.mimetype === "image/png" || req.files.image.mimetype === "image/jpg") {
        let file = req.files.image;
        const Uid = v4()
        const imageFileName = `${process.env.SERVER}/uploads/${Uid}-${file.name}`
        const fileNameUpload = `${Uid}-${file.name}`
        let uploadPath = `src/uploads/${fileNameUpload}`;

        const image = await sharp(file.data)
            .jpeg({ mozjpeg: true })
            .toBuffer();
        fs.writeFileSync(uploadPath, image);
    }else {
        return apiResponse(res, 415, messageEnum.err_Unsupported_Media_Type, "");
    }

    if(req.files.logo){
        if (req.files.logo.mimetype === "image/jpeg" || req.files.logo.mimetype === "image/png" || req.files.logo.mimetype === "image/jpg") {
            let file = req.files.logo;
            const Uid = v4()
            const logoFileName = `${process.env.SERVER}/uploads/${Uid}-${file.name}`
            const fileNameUpload = `${Uid}-${file.name}`
            let uploadPath = `src/uploads/${fileNameUpload}`;
    
            const image = await sharp(file.data)
                .jpeg({ mozjpeg: true })
                .toBuffer();
            fs.writeFileSync(uploadPath, image);
    }else {
        return apiResponse(res, 415, messageEnum.err_Unsupported_Media_Type, "");
    }

    }else{
        const logoFileName = `${process.env.SERVER}/uploads/def-logo.png`;
    }

    const hashPassWord = await bcrypt.hash(passWord, process.env.SALT);

    const newStudio = await Studio.create({
        studioId,
        name,
        phoneNumber,
        address,
        province,
        type,
        license,
        pricePerHour,
        email,
        telegramId,
        description,
        hashPassWord
    });

    return apiResponse(res,201,messageEnum.created_201,{newStudio});
}
