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
import { sendMessage, sendMessageNormal } from "telegramBot/bot";

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
    }).catch(err => {
        throw err;
    });

    return apiResponse(res, 201, messageEnum.created_201, new Dto(newStudio));
}

export const studioSignup = async (req, res) => {
    const { email, passWord } = req.body;

    const studio = await Studio.findOne({
        where: {
            email
        }
    });
    console.log(studio);

    if (studio) {
        const passwordMatch = await bcrypt.compare(passWord, studio.passWord);
        if (passwordMatch) {
            let studioData = new Dto(studio);
            const token = jwt.sign({ studioData }, process.env.JWT_SECRET, { expiresIn: '24h' });
            try {
                await sendMessageNormal(studio.telegramId, "یک ورود به حساب کاربری شما صورت گرفت").catch(err => {
                    throw err;
                });
            } catch (error) {
                throw error;
            }
            return apiResponse(res, 200, messageEnum.login_success, { "jwt": token, studioData });
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
                const token = jwt.sign({ admin }, process.env.JWT_SECRET, { expiresIn: '24h' });
                return apiResponse(res, 200, messageEnum.login_success, { "jwt": token, "admin": admin });
            } else {
                return apiResponse(res, 401, messageEnum.login_faild, {});
            }
        } else {
            return apiResponse(res, 401, messageEnum.login_faild, {});
        }
    }
}

export const updateStudio = async (req, res) => {
    const { name, phoneNumber,
        address, province, type, license,
        pricePerHour, email, telegramId,
        description } = req.body;

    const studioId = req.studio.studioId;
    await Studio.update(
        {
            name,
            phoneNumber,
            address,
            province,
            type,
            license,
            pricePerHour,
            email,
            telegramId,
            description
        },
        {
            where: {
                studioId
            }
        }
    ).catch(err => {
        throw err;
    });

    const updatedStudio = await Studio.findOne({
        where: {
            studioId
        }
    });

    return apiResponse(res, 201, messageEnum.created_201, new Dto(updatedStudio));
}

export const updateImage = async (req, res) => {
    const studioId = req.studio.studioId;
    let imageFileName;
    if (!req.files || Object.keys(req.files).length === 0) {
        return apiResponse(res, 400, messageEnum.bad_request, "");
    }

    const current = await Studio.findOne({
        where: {
            studioId
        }
    });

    const currentImageUrl = current.image;
    const filename = currentImageUrl.split('/').pop();
    let str = __dirname;
    let arr = str.split("\\");
    arr[arr.length - 1] = "uploads\\";
    let newStr = arr.join("\\");
    console.log(newStr);
    console.log(str);
    const path = `${newStr}${filename}`;
    await fs.unlinkSync(path);

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

    await Studio.update({
        image: imageFileName
    },
        {
            where: {
                studioId
            }
        }).catch(err => {
            throw err;
        });

    const updatedStudio = await Studio.findOne(
        {
            where: {
                studioId
            }
        }
    )
    return apiResponse(res, 201, messageEnum.created_201, new Dto(updatedStudio));
}

export const updateLogo = async (req, res) => {
    const studioId = req.studio.studioId;
    let logoFileName;
    if (!req.files || Object.keys(req.files).length === 0) {
        return apiResponse(res, 400, messageEnum.bad_request, "");
    }

    const current = await Studio.findOne({
        where: {
            studioId
        }
    });

    const currentImageUrl = current.logo;
    const filename = currentImageUrl.split('/').pop();
    let str = __dirname;
    let arr = str.split("\\");
    arr[arr.length - 1] = "uploads\\";
    let newStr = arr.join("\\");
    console.log(newStr);
    console.log(str);
    const path = `${newStr}${filename}`;
    if (filename !== "def-logo.png") {
        await fs.unlinkSync(path);
    };

    if (req.files.logo.mimetype === "image/jpeg" || req.files.logo.mimetype === "image/png" || req.files.logo.mimetype === "image/jpg") {
        //! upload image
        let file = req.files.logo;
        const Uid = v4()
        logoFileName = `${process.env.SERVER}/uploads/${Uid}-${file.name}`
        const fileNameUpload = `${Uid}-${file.name}`
        let uploadPath = `src/uploads/${fileNameUpload}`;

        const image = await sharp(file.data)
            .jpeg({ mozjpeg: true })
            .toBuffer();
        fs.writeFileSync(uploadPath, image);
    } else {
        return apiResponse(res, 415, messageEnum.err_Unsupported_Media_Type, "");
    }

    await Studio.update({
        logo: logoFileName
    },
        {
            where: {
                studioId
            }
        }).catch(err => {
            throw err;
        });

    const updatedStudio = await Studio.findOne(
        {
            where: {
                studioId
            }
        }
    )
    return apiResponse(res, 201, messageEnum.created_201, new Dto(updatedStudio));
}

export const getStudioDetail = async (req, res) => {
    const studioId = req.params.studioId;

    const result = await Studio.findOne({
        where: {
            studioId,
            isActive: true
        }
    });
    if (!result) {
        return apiResponse(res, 404, messageEnum.notFound, {});
    }
    return apiResponse(res, 200, messageEnum.get_success, new Dto(result));
}

export const getAllStudios = async (req, res) => {
    const { type, license, province } = req.query;

    let where: any = {};
    if (type) {
        where.type = type;
    }
    if (license) {
        where.license = license;
    }
    if (province) {
        where.province = province;
    }
    where.isActive = true;

    let items;
    if (Object.keys(where).length > 0) {
        items = await Studio.findAll({
            where
        });
    } else {
        items = await Studio.findAll({
            where: {
                isActive: true
            }
        });
    }

    if (items.length <= 0) {
        return apiResponse(res, 404, messageEnum.notFound, {});
    }

    let result = [];
    items.forEach(studio => {
        const studioForResult = new Dto(studio);
        result.push(studioForResult);
    });

    return apiResponse(res, 200, messageEnum.get_success, result);
}