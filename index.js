import 'dotenv/config';
import express from 'express';

import cors from 'cors';
// import cookies from 'cookies';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import sequelize from './bd.js';

import router from './routes/index.js';
import errorHandler from './middleware/ErrorHandlingMiddleware.js';

const PORT = process.env.PORT || 5000;

const app = express();
// app.use(cookies())
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());
app.use(cookieParser(process.env.SECRET_KEY));
app.use(bodyParser.json())
app.use(express.static('static'));
app.use(fileUpload({}));
app.use('/api', router);
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log('server start on port:' + PORT));
  } catch (error) {
    console.log(error);
  }
};
start();


