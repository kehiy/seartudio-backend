import DB from "../databases";
import jwt from "jsonwebtoken";
import messageEnum from "../enums/messageEnum";
import { apiResponse } from "utils/apiRespones";
import sharp from "sharp";
import fs from "fs";
import bcrypt from "bcrypt";
import { Op, Sequelize } from "sequelize";
import { v4 } from "uuid";
import Dto from "../dto/studioDto";
import nodemailer from "nodemailer";
import { sendMessage, sendMessageNormal } from "telegramBot/bot";

const Studio = DB.Studio;
const Admin = DB.Admin;

function generatePassword(length) {
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#";
    var password = "";
    for (var i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}


const transporter = nodemailer.createTransport({
    host: "smtp.liara.ir",
    port: 587,
    tls: true,
    auth: {
        user: "serene_galileo_27t5c0",
        pass: "c51dd4b0-e968-4b3c-afb3-f2a2adbeaeda",
    }
});


export const addStudio = async (req, res) => {
    let { studioId, name, phoneNumber,
        address, province, type, license,
        pricePerHour, telegramId,
        description, passWord } = req.body;
    let email: string = req.body.email;

    let logoFileName;
    let imageFileName;

    email = email.toLowerCase();

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
    const { passWord } = req.body;
    let email: string = req.body.email;
    email = email.toLowerCase();

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
        pricePerHour, telegramId,
        description, passWord } = req.body;
    let email: string = req.body.email;
    email = email.toLowerCase();

    const SALT = await bcrypt.genSalt(10);
    const hashPassWord = await bcrypt.hash(passWord, SALT);

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
            description,
            passWord: hashPassWord
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

    // const current = await Studio.findOne({
    //     where: {
    //         studioId
    //     }
    // });

    // const currentImageUrl = current.image;
    // const filename = currentImageUrl.split('/').pop();
    // let str = __dirname;
    // let arr = str.split("\\");
    // arr[arr.length - 1] = "uploads\\";
    // let newStr = arr.join("\\");
    // console.log(newStr);
    // console.log(str);
    // const path = `${newStr}${filename}`;
    // await fs.unlinkSync(path);

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

    // const current = await Studio.findOne({
    //     where: {
    //         studioId
    //     }
    // });

    // const currentImageUrl = current.logo;
    // const filename = currentImageUrl.split('/').pop();
    // let str = __dirname;
    // let arr = str.split("\\");
    // arr[arr.length - 1] = "uploads\\";
    // let newStr = arr.join("\\");
    // console.log(newStr);
    // console.log(str);
    // const path = `${newStr}${filename}`;
    // if (filename !== "def-logo.png") {
    //     await fs.unlinkSync(path);
    // };

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
        return apiResponse(res, 404, messageEnum.notFound, { "from detail": "!ok" });
    }
    return apiResponse(res, 200, messageEnum.get_success, new Dto(result));
}

export const getAllStudios = async (req, res) => {
    const { type, license, province } = req.query;

    let skip = req.query.skip ? Number(req.query.skip) : 0;
    let defaultLimit = 10;



    const all = "همه";

    let where: any = {};

    if (type !== all && type) {
        where.type = type;
    }
    if (license !== all && license) {
        where.license = license;
    }
    if (province !== all && province) {
        where.province = province;
    }
    where.isActive = true;

    let items;
    if (Object.keys(where).length > 0) {
        items = await Studio.findAll({
            where,
            offset: skip,
            limit: defaultLimit,
        });
    } else {
        items = await Studio.findAll({
            where,
            offset: skip,
            limit: defaultLimit,
        });
    }

    if (items.length <= 0) {
        return apiResponse(res, 404, messageEnum.notFound, { "from allll": "!ok" });
    }

    let result = [];
    items.forEach(studio => {
        const studioForResult = new Dto(studio);
        result.push(studioForResult);
    });

    result.sort((a, b) => {
        if (a.isPromoted && !b.isPromoted) {
            return -1; // a should come before b
        } else if (!a.isPromoted && b.isPromoted) {
            return 1; // b should come before a
        } else {
            return Math.random() - 0.5; // randomly sort remaining items
        }
    });

    return apiResponse(res, 200, messageEnum.get_success, result);
}

export const getMe = async (req, res) => {
    const authHeader = req.headers.authorization;

    let data: any = await jwt.decode(authHeader);
    let result: any = null;
    let studioId: any = undefined;

    if (data) {
        if (data.studioData) {
            if (data.studioData.studioId) {
                studioId = data.studioData.studioId;
            } else {
                studioId = false;
            }
        } else {
            studioId = false;
        }
    } else {
        studioId = false;
    }

    if (studioId) {
        studioId = data.studioData.studioId;
        result = await Studio.findOne({
            where: {
                studioId
            }
        });
    } else {
        result = data;
    }

    return apiResponse(res, 200, messageEnum.get_success, result);
}

export const frogotPassWord = async (req, res) => {
    let email : string = req.body.email;
    email = email.toLowerCase();

    const studio = await Studio.findOne({
        where: {
            email: email
        }
    });

    if (!studio) {
        return apiResponse(res, 404, messageEnum.notFound, { "msg": "no studio exist" });
    }


    const token = await jwt.sign({ "updatePass": studio.studioId,"email":studio.email,"telId":studio.telegramId }, process.env.JWT_SECRET, { expiresIn: "17m" });

    const link = `https://api.seartudio.com/studio/forgotPass?token=${token}`;

    await sendMessageNormal(studio.telegramId, `برای دریافت رمز عبور جدید \n \`${link}\``);
    await transporter.sendMail({
        from: 'noreply@seartudio.com',
        to: studio.email,
        subject: 'فراموشی رمز عبور',
        html: `برای دریافت رمز عبور جدید \n ${link}`
    });

    return apiResponse(res, 200, messageEnum.get_success, { "msg": "link was sent to client." });
}


export const updatePassWord = async (req, res) => {
    const token = req.query.token;

    let decodedToken: any = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
        return apiResponse(res, 401, messageEnum.err_unauthorized, "faild");
    }

    const studio = decodedToken.updatePass;

    let newPass = generatePassword(5);
    newPass = newPass + "@S"
    const SALT = await bcrypt.genSalt(10);
    const hashPassWord = await bcrypt.hash(newPass, SALT);

    const studioData: any = await Studio.update({
        passWord: hashPassWord
    },
        {
            where: {
                studioId: studio
            },
            returning: true
        }).catch(err => {
            throw err;
        });

    await sendMessageNormal(decodedToken.telId , `رمز عبور جدید شما:\n ${newPass} \n رمز عبور دلخواهتان را از پنل استودیو ثبت کنید.`);

    await transporter.sendMail({
        from: 'noreply@seartudio.com',
        to: decodedToken.email,
        subject: 'فراموشی رمز عبور',
        html: `رمز عبور جدید شما : ${newPass} \n برای تنظیم رمز عبور جدید دلخواه خود از طریق پنل استودیو اقدام کنید.`
    });

    return apiResponse(res, 201, messageEnum.created_201, { "msg": "passWord updated successfully." });
}

export const getLink = async (req, res) => {
    return apiResponse(res, 200, messageEnum.get_success, "https://t.me/seartudio");
}

export const deleteStudio = async (req, res) => {
    const passWord = req.body.passWord;
    const studio = req.studio;

    const studioData = await Studio.findOne({
        where: {
            studioId: studio.studioId
        }
    });
    if (!studioData) {
        return apiResponse(res, 404, messageEnum.notFound, { "msg": "no studio exist" });
    }

    const passwordMatch = await bcrypt.compare(passWord, studioData.passWord);

    if (passwordMatch) {

        await Studio.destroy({
            where: {
                studioId: studio.studioId
            }
        });

        return apiResponse(res, 404, messageEnum.notFound, { "msg": "account was deleted successfully!" });

    } else {

        return apiResponse(res, 400, messageEnum.bad_request, { "msg": "worng password!" });

    }
}