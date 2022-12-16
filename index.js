import express, { response } from 'express';
import apiRouter from './apiRouter.js';
import bodyParser from 'body-parser';
import database from './database.js'

const PORT = 5000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs')
app.use(express.static('views'))
app.use('/api', apiRouter);

app.get('/', (request, response) => {
    database.query('SELECT * FROM `themes`;', (error, rows, fields) => {
        if (error) {
            return response.status(500).json({'error': 'Ошибка на сервере, пошел ты нахуй.' + error});
        }

        response.render('index', {'rows': rows});

    });
})

app.get('/auth', (request, response) => {
    response.render('auth');
});

app.listen(PORT, () => console.log('server listening'));