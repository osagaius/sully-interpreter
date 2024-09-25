import express from 'express';
import bodyParser from 'body-parser';
import router from './router';

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/api', router);

export default app;
