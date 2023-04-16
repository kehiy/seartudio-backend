import messageEnum from "enums/messageEnum";
import { apiResponse } from "utils/apiRespones";
import { Telegraf, Markup } from "telegraf";
import DB from "../databases";
import { Op } from "sequelize";

const Studio = DB.Studio;
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const cornKey = process.env.CRONJOB_KEY;


export const checkExpier = async (req, res) => {
    const reqCornKey = req.body.cornKey;
    const now = new Date();


    if (reqCornKey !== cornKey) {
        return apiResponse(res, 401, messageEnum.err_forbidden, {});
    }

    const bot = new Telegraf(botToken);
    const keyboardMarkup = Markup.inlineKeyboard([
        { text: "ارتباط با پشتیبانی", url: "https://t.me/seartudio_support" }
    ]);

    const recordsToDeactivate = await Studio.update(
        {isActive: false},
        {where: {
            isActive: true,
            expireDate: { [Op.lte]: now }
        },
        returning: true
    }).catch(err=>{
        throw err;
    });

    recordsToDeactivate[1].forEach(async studio=>{
        bot.telegram.sendMessage(studio.telegramId, messageEnum.telegramStudioExpire.message.replace("نام",studio.name), keyboardMarkup);
        await delay(1000);
    });

    bot.launch();
    return apiResponse(res,200,messageEnum.cronDone,recordsToDeactivate[1]);
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}