import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyparser from 'body-parser';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import UserRouter from './api/User';
import EventApi from './api/Event';
import FileRouter from './api/File';
import env from './util/constants/env';

declare module 'express-session' {
  interface SessionData {
    oauthRequestToken?: string;
    oauthRequestTokenSecret?: string;
    oauthAccessToken?: string;
  }
}
const app = express();

app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyparser.json());
app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

mongoose.connect(env.databaseConnectionUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
  autoIndex: true,
});

app.use('/users', UserRouter);
app.use('/events', EventApi);
app.use('/files', FileRouter);

app.listen(env.port, () => {
  console.log('Server running on port 8746');
});
