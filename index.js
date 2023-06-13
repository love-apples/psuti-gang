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
            return response.status(500).json({'error': 'Ошибка на сервере'});
        }

        response.render('index', {'rows': rows});

    });
})

app.get('/auth', (request, response) => {
    response.render('auth');
});

app.get('/register', (request, response) => {
    response.render('register');
});

app.get('/create-theme', (request, response) => {
    response.render('create-theme');
});

app.get('/user/:id', (request, response) => {
    database.query('SELECT * FROM `users` WHERE id="' + request.params.id + '";', (error, rows, fields) => {
        if (error) {
            return response.status(500).json({'error': 'Ошибка на сервере.' + error});
        }

        if (!rows.length > 0) {
            return response.status(403).json({'error': 'Пользователь не найден.'})
        }

        return response.render('user', {'result': {
            'id': rows[0].id, 
            'username': rows[0].username, 
            'role': rows[0].role, 
            'date_register_unix': rows[0].date_register_unix,
            'banned': rows[0].banned,
            'image_link': rows[0].image_link,
            'description': rows[0].description
        }});

    });
});

app.get('/theme/:id', (request, response) => {
    database.query('SELECT * FROM `themes` WHERE id="' + request.params.id + '";', (error, rows, fields) => {
        if (error) {
            return response.status(500).json({'error': 'Ошибка на сервере.' + error});
        }

        if (!rows.length > 0) {
            return response.status(403).json({'error': 'Тема не найдена.'})
        }

        return response.render('theme', {'result': {
            'id': rows[0].id, 
            'author': rows[0].author, 
            'title': rows[0].title, 
            'description': rows[0].description,
            'date_create': rows[0].date_create,
            'author_id': rows[0].author_id,
        }});

    });
});

app.listen(PORT, () => console.log('server listening'));