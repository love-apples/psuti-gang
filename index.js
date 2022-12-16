import express from 'express';
import apiRouter from './apiRouter.js';
import bodyParser from 'body-parser';

const PORT = 5000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs')
app.use(express.static('views'))
app.use('/api', apiRouter);

app.get('/', (request, response) => {
    response.render('index');
})

app.listen(PORT, () => console.log('server listening'));