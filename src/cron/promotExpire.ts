import messageEnum from "enums/messageEnum";
import { apiResponse } from "utils/apiRespones";
import { Telegraf, Markup } from "telegraf";
import DB from "../databases";
import { Op } from "sequelize";
import { sendMessage } from "telegramBot/bot";
import moment from "moment";

const Studio = DB.Studio;

const cornKey = process.env.SUPER_ACCESS_KEY;



export const checkPromotExpier = async (req, res) => {
    const reqCornKey = req.body.cornKey;
    const now = moment();

    if (reqCornKey !== cornKey) {
        return apiResponse(res, 401, messageEnum.err_forbidden, {});
    }

    const keyboardMarkup = Markup.inlineKeyboard([
        { text: "ارتباط با پشتیبانی", url: "https://t.me/seartudio_support" }
    ]);

    const recordsToDeactivate = await Studio.update(
        { isPromoted: false },
        {
            where: {
                isPromoted: true,
                expireDate: { [Op.lte]: now }
            },
            returning: true
        }).catch(err => {
            throw err;
        });

    recordsToDeactivate[1].forEach(async studio => {
        try {
            const text = messageEnum.telegramStudioExpire.promotMessage.replace('{name}', studio.name);
            await sendMessage(studio.telegramId, text, keyboardMarkup);
        } catch (err) {
            console.log(err);
        }
        await delay(2000);
    });

    return apiResponse(res, 200, messageEnum.cronDone, recordsToDeactivate[1]);
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
