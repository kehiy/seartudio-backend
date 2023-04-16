import messageEnum from "enums/messageEnum";
import { apiResponse } from "utils/apiRespones";
import DB from "../databases";
import Dto from "dto/studioDto";

const Admin = DB.Admin;
const Studio = DB.Studio;


export const getActiveStudios = async (req, res) => {
    const activeStudios = await Studio.findAll({
        where: {
            isActive: true
        }
    });
    let resualt = [];
    activeStudios.forEach(studio=>{
        const dtoStudio = new Dto(studio);
        resualt.push(dtoStudio);
    });
    return apiResponse(res, 200, messageEnum.get_success,resualt);
}

export const getDeactiveStudios = async (req, res) => {
    const deactiveStudios = await Studio.findAll({
        where: {
            isActive: false
        }
    });
    let resualt = [];
    deactiveStudios.forEach(studio=>{
        const dtoStudio = new Dto(studio);
        resualt.push(dtoStudio);
    });
    return apiResponse(res, 200, messageEnum.get_success,resualt);
}

export const getAllStudios = async (req, res) => {
    const allStudios = await Studio.findAll();
    let resualt = [];
    allStudios.forEach(studio=>{
        const dtoStudio = new Dto(studio);
        resualt.push(dtoStudio);
    });
    return apiResponse(res, 200, messageEnum.get_success,resualt);
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
    const { studioId, status } = req.body;
    await Studio.update({
        isPromoted: status
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