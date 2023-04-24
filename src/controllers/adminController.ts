import messageEnum from "enums/messageEnum";
import { apiResponse } from "utils/apiRespones";
import DB from "../databases";
import Dto from "dto/studioDto";
import bcrypt from "bcrypt";


const suacKey = process.env.SUPER_ACCESS_KEY
const Admin = DB.Admin;
const Studio = DB.Studio;


export const getActiveStudios = async (req, res) => {
    const activeStudios = await Studio.findAll({
        where: {
            isActive: true
        }
    });
    let resualt = [];
    activeStudios.forEach(studio => {
        const dtoStudio = new Dto(studio);
        resualt.push(dtoStudio);
    });
    return apiResponse(res, 200, messageEnum.get_success, resualt);
}

export const getDeactiveStudios = async (req, res) => {
    const deactiveStudios = await Studio.findAll({
        where: {
            isActive: false
        }
    });
    let resualt = [];
    deactiveStudios.forEach(studio => {
        const dtoStudio = new Dto(studio);
        resualt.push(dtoStudio);
    });
    return apiResponse(res, 200, messageEnum.get_success, resualt);
}

export const getAllStudios = async (req, res) => {
    const allStudios = await Studio.findAll();
    let resualt = [];
    allStudios.forEach(studio => {
        const dtoStudio = new Dto(studio);
        resualt.push(dtoStudio);
    });
    return apiResponse(res, 200, messageEnum.get_success, resualt);
}

export const activateStudio = async (req, res) => {
    const { subscriptionMonths, studioId } = req.body;

    let endDate = new Date(); // Get the current date/time

    endDate.setMonth(endDate.getMonth() + subscriptionMonths); // Add the number of months to the current date

    await Studio.update({
        isActive: true,
        expireDate: endDate
    },
        {
            where: {
                studioId
            }
        }).catch(err => {
            throw err;
        });

    const updated = await Studio.findOne({
        where: { studioId }
    });

    return apiResponse(res, 201, messageEnum.created_201, new Dto(updated));
}

export const promoteStudio = async (req, res) => {
    const { studioId, promotMonths } = req.body;

    let endDate = new Date(); // Get the current date/time

    endDate.setMonth(endDate.getMonth() + promotMonths); // Add the number of months to the current date

    await Studio.update({
        isPromoted: true,
        promotExpireDate: endDate,
    },
        {
            where: {
                studioId
            }
        }).catch(err => {
            throw err
        });

    const updated = await Studio.findOne({
        where: {
            studioId
        }
    });

    return apiResponse(res, 201, messageEnum.created_201, new Dto(updated));
}

export const studioVerification = async (req, res) => {
    const { status, studioId } = req.body;
    await Studio.update({
        isVeryfied: status
    },
        { where: { studioId } }).catch(err => {
            throw err
        });

    const update = await Studio.findOne({
        where: {
            studioId
        }
    });

    return apiResponse(res, 201, messageEnum.created_201, new Dto(update));
}

export const AddAdmin = async (req, res) => {
    const { passWord, email, reqSuacKey } = req.body;

    if (reqSuacKey !== suacKey) {
        return apiResponse(res, 401, messageEnum.err_forbidden, {});
    }

    const SALT = await bcrypt.genSalt(10);
    const hashPassWord = await bcrypt.hash(passWord, SALT);

    const newAdmin = await Admin.create({
        passWord: hashPassWord,
        email
    });

    return apiResponse(res, 201, messageEnum.created_201, newAdmin);
}

export const removeAdmin = async (req, res) => {
    const { email, reqSuacKey } = req.body;

    if (reqSuacKey !== suacKey) {
        return apiResponse(res, 401, messageEnum.err_forbidden, {});
    }

    const removedAdmin = await Admin.destroy({
        where: {
            email
        }
    });

    return apiResponse(res, 201, messageEnum.notFound, removedAdmin);
}