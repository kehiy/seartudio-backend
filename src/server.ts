import App from './app';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App();

console.log('Start ...');

app.listen();
