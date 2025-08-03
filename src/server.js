import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routers/contactsRouter.js';
import { getAllContacts, getContactById } from './services/contacts';
 
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

  app.use('/contacts', contactsRouter);

  app.use('*', (req, res, next) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  app.get('/contacts', async (req, res) => {
    const students = await getAllContacts();

    res.status(200).json({
      data: students,
    });
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contacttId } = req.params;
    const contact = await getContactById(contacttId);   
    
	if (!contact) {
	  res.status(404).json({
		  message: 'Contact not found'
	  });
	  return;
	}

    res.status(200).json({
      data: contact,
    });
  });

}