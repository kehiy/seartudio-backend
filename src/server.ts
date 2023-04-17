import App from './app';
import validateEnv from './utils/validateEnv';
import bot from 'telegramBot/bot';

validateEnv();

const app = new App();

console.log('Start ...');


app.listen();
bot.launch();