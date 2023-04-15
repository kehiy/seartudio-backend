import Dto from "../dto/studioDto";
import DB from "../databases";
import { Sequelize } from "sequelize";
import { apiResponse } from "utils/apiRespones";
import { measureMemory } from "vm";
import messageEnum from "enums/messageEnum";

const Studio = DB.Studio;

export const getHomePage = async (req, res) => {
    const studios = await Studio.findAll({
        where: { isActive: true },
        order: Sequelize.literal('RANDOM()'),
        limit: 4
    });

    let result = [];
    studios.forEach(studio => {
        const studioForResult = new Dto(studio);
        result.push(studioForResult);
    });

    console.log(__dirname);
    return apiResponse(res, 200, messageEnum.get_success, result);
}