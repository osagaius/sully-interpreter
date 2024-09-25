import express from 'express';
import bodyParser from 'body-parser';
import router from './router';
import path from 'path';

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/api', router);


// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Fallback for all other routes to serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

export default app;

