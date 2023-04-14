import DB from "../databases";
import jwt from "jsonwebtoken";
import messageEnum from "../enums/messageEnum";
import { apiResponse } from "utils/apiRespones";
import sharp from "sharp";
import fs from "fs";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { v4 } from "uuid";
import Dto from "../dto/studioDto";

const Studio = DB.Studio;
const Admin = DB.Admin;

export const addStudio = async (req, res) => {
    const { studioId, name, phoneNumber,
        address, province, type, license,
        pricePerHour, email, telegramId,
        description, passWord } = req.body;

    let logoFileName;
    let imageFileName;
    const isExist = await Studio.findOne({
        where: {
            [Op.or]: [
                { email },
                { telegramId },
                { studioId },
            ]
        }
    });

    if (isExist) {
        return apiResponse(res, 409, messageEnum.studio_exist, {
            "msg": "studio already exist in DB."
        });
    }
    if (!req.files || Object.keys(req.files).length === 0) {
        return apiResponse(res, 400, messageEnum.bad_request, "");
    }

    if (req.files.image.mimetype === "image/jpeg" || req.files.image.mimetype === "image/png" || req.files.image.mimetype === "image/jpg") {
        //! upload image
        let file = req.files.image;
        const Uid = v4()
        imageFileName = `${process.env.SERVER}/uploads/${Uid}-${file.name}`
        const fileNameUpload = `${Uid}-${file.name}`
        let uploadPath = `src/uploads/${fileNameUpload}`;

        const image = await sharp(file.data)
            .jpeg({ mozjpeg: true })
            .toBuffer();
        fs.writeFileSync(uploadPath, image);
    } else {
        return apiResponse(res, 415, messageEnum.err_Unsupported_Media_Type, "");
    }

    if (req.files.logo) {
        if (req.files.logo.mimetype === "image/jpeg" || req.files.logo.mimetype === "image/png" || req.files.logo.mimetype === "image/jpg") {
            //! upload logo
            let logoFile = req.files.logo;
            const logoUid = v4()
            logoFileName = `${process.env.SERVER}/uploads/${logoUid}-${logoFile.name}`
            const logoNameUpload = `${logoUid}-${logoFile.name}`
            let logoUploadPath = `src/uploads/${logoNameUpload}`;

            const logo = await sharp(logoFile.data)
                .jpeg({ mozjpeg: true })
                .toBuffer();
            fs.writeFileSync(logoUploadPath, logo);
        } else {
            return apiResponse(res, 415, messageEnum.err_Unsupported_Media_Type, "");
        }
    } else {
        logoFileName = `${process.env.SERVER}/uploads/def-logo.png`;
    }

    const SALT = await bcrypt.genSalt(10);
    const hashPassWord = await bcrypt.hash(passWord, SALT);

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
        passWord: hashPassWord,
        logo: logoFileName,
        image: imageFileName
    });

    return apiResponse(res, 201, messageEnum.created_201, new Dto(newStudio));
}


export const studioLogin = async (req, res) => {
    const { email, passWord } = req.body;

    const studio = await Studio.findOne({
        where: {
            email
        }
    })

    if (studio) {
        const passwordMatch = await bcrypt.compare(passWord, studio.passWord);
        if (passwordMatch) {
            let studioData = new Dto(studio);
            const token = jwt.sign(studioData, process.env.JWT_SECRET, { expiresIn: '24h' });
            return apiResponse(res, 200, messageEnum.login_success, { "jwt": token, "studio": studioData });
        } else {
            return apiResponse(res, 401, messageEnum.login_faild, {});
        }
    } else {
        const admin = await Admin.findOne({
            where: {
                email
            }
        });

        if (admin) {
            const passwordMatch = await bcrypt.compare(passWord, admin.passWord);
            if (passwordMatch) {
                const token = jwt.sign(admin, process.env.JWT_SECRET, { expiresIn: '24h' });
                return apiResponse(res, 200, messageEnum.login_success, { "jwt": token, "admin": admin });
            } else {
                return apiResponse(res, 401, messageEnum.login_faild, {});
            }
        } else {
            return apiResponse(res, 401, messageEnum.login_faild, {});
        }
    }
}