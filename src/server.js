import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { getEnvVar } from './utils/getEnvVar.js';
import router from './routers/contacts.js';
import { errorHandler, notFoundhandler } from './middlewares/errorHandler.js';

 
const logger = pino();

const PORT = Number(getEnvVar('PORT', '3000'));


export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  app.use(router);

  app.use(notFoundhandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

}