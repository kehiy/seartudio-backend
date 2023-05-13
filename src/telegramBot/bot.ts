// Require the Telegraf module
import { Telegraf, Markup } from "telegraf";
import messages from "./botMessages";
// Create a new Telegraf instance with your bot token
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const support = Markup.inlineKeyboard([
    { text: "ارتباط با پشتیبانی", url: "https://t.me/seartudio_support" }
])

// Add a command handler for /start
bot.command('start', (ctx) => {
    ctx.reply(messages.startMessage);
    const id = ctx.from.id.toString();
    ctx.reply(`شناسه تلگرامی شما: \`${id}\``, { parse_mode: "Markdown" });
});

bot.command('support', (ctx) => {
    ctx.reply(messages.supportMessage, support);
});

bot.command('info', (ctx) => {
    ctx.reply(messages.infoMessage);
});

bot.command('myid', (ctx) => {
    const id = ctx.from.id.toString();
    ctx.reply(`شناسه تلگرامی شما:❤️🤞`);
    ctx.reply(`\`${id}\``, { parse_mode: "Markdown" });
});


export const sendMessage = async (id, text, keyboard) => {
    bot.telegram.sendMessage(id, text, keyboard).catch(err=>{
        return;
    });
}
export const sendMessageNormal = async (id, text) => {
    bot.telegram.sendMessage(id, text,{ parse_mode: "Markdown" }).catch(err=>{
        return;
    });
}

// export the bot
export default bot;