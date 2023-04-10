import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
//
import { NODE_ENV, PORT, ORIGIN, CREDENTIALS } from './config';
import DB from './databases';
import errorMiddleware from './middlewares/error';
import { authenticated } from './middlewares/auth';
import clients from './routes/clients';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor() {
    this.app = express();
    this.env = NODE_ENV;
    this.port = PORT || 3000;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeRoutes();
    this.app.use(errorMiddleware);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`\n\nServer running in ${process.env.NODE_ENV} mode on port ${PORT} \n\n`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    DB.sequelize.sync();
  }

  private initializeMiddlewares() {
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    const limiter = rateLimit({
      windowMs: 60000,
      max: 60,
      handler: (req, res) => {
        return res.status(429).json({ message: 'Too many requests' });
      },
    });
    this.app.use(limiter);
  }

  private initializeRoutes() {
    this.app.get('/test', (req, res) => {
      res.end('Hi');
    });

    this.app.use('/clients', authenticated, clients);
  }

  private initializeSwagger() {
    console.log('cwd', process.cwd());

  };
}

export default App;