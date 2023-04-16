// Require the Telegraf module
import { Telegraf, Markup } from "telegraf";
import messages from "./botMessages";
import { copy } from "copy-paste";
// Create a new Telegraf instance with your bot token
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const support = Markup.inlineKeyboard([
    { text: "ارتباط با پشتیبانی", url: "https://t.me/seartudio_support" }
])

// Add a command handler for /start
bot.command('start', (ctx) => {
    ctx.reply(messages.startMessage);
    ctx.reply("برای کپی کردن شناسه تلگرامی خود کلیک کنید.", Markup.inlineKeyboard([
        Markup.button.callback("شناسه تلگرامی شما", 'copy_value')
    ]));
});

bot.command('support', (ctx) => {
    ctx.reply(messages.supportMessage,support);
});

bot.command('info', (ctx) => {
    ctx.reply(messages.infoMessage, );
});

bot.command('myid', (ctx) => {
    ctx.reply("برای کپی کردن شناسه تلگرامی خود کلیک کنید.", Markup.inlineKeyboard([
        Markup.button.callback("شناسه تلگرامی شما", 'copy_value')
    ]));
});

bot.action('copy_value', async (ctx) => {
    // Perform the action of copying the value here
    let value = ctx.from.id.toString();
    await copy(value);
    ctx.reply(`شناسه تلگرامی شما کپی شد.`);
});

export const sendMessage = async (id, text, keyboard) => {
    bot.telegram.sendMessage(id, text, keyboard);
}

// export the bot
export default bot;