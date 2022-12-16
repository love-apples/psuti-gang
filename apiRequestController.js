import tools from "./tools.js";
import database from "./database.js";
import crypto from 'crypto';

class apiRequestController {
    async register(request, response) {
        if (!tools.checkJsonKey(request.body, 'login') || !tools.checkJsonKey(request.body, 'password') || !tools.checkJsonKey(request.body, 'username')) {
            return response.status(400).json({'error': 'Некорректные данные.'});
        }

        var login = tools.delInjection(request.body.login);
        var password = tools.delInjection(request.body.password);
        var username = tools.delInjection(request.body.username);

        database.query('SELECT * FROM `users` WHERE login="' + login + '";', (error, rows, fields) => {
            
            if (error) {
                return response.status(500).json({'error': 'Ошибка на сервере, пошел ты нахуй.'});
            }

            if (rows.length > 0) {
                return response.status(403).json({'error': 'Этот логин занят.'})
            }

            if (login.length > 50) {
                return response.status(403).json({'error': 'Логин не может составлять больше 50 символов'})
            }

            if (username.length > 50) {
                return response.status(403).json({'error': 'Имя не должно составлять больше 50 символов'})
            }

            database.query("INSERT INTO `users` (" + 
                "`login`, " + 
                "`password_md5`, " + 
                "`username`, " + 
                "`token`, " + 
                "`role`, " + 
                "`date_register_unix`, " + 
                "`banned`, " + 
                "`image_link`, " + 
                "`description`) VALUES (" +
                "'" + login + "', " + 
                "'" + crypto.createHash('md5').update(password).digest('hex') + "', " + 
                "'" + username + "', " + 
                "'" + tools.createToken(50) + "', " + 
                "'user', " + 
                "'" + Date.now() + "', " + 
                "'0', " + 
                "'https://sun9-83.userapi.com/impg/FNZUm9VIPnQuDj_QtmY_PqWwaMkkJ6KYZqMY_g/b2lipxRH7rU.jpg?size=1440x1425&quality=95&sign=e657c2ef30fcb0757a499aa1806eefe5&type=album', " + 
                "'Пользователь не указал информации о себе.');", (error) => {
                    if (error) { 
                        return response.status(500).json({'error': 'Произошла ошибка на сервере.'})
                    }
                })

            return response.status(200).json({'result': 'Успех!'})
            
        });
    }

    async auth(request, response) {
        if (!tools.checkJsonKey(request.body, 'login') || !tools.checkJsonKey(request.body, 'password')) {
            return response.status(400).json({'error': 'Некорректные данные.'});
        }

        var login = tools.delInjection(request.body.login);
        var password = tools.delInjection(request.body.password);

        database.query('SELECT * FROM `users` WHERE login="' + login + '";', (error, rows, fields) => {
            if (error) {
                return response.status(500).json({'error': 'Ошибка на сервере, пошел ты нахуй.'});
            }

            if (!rows.length > 0) {
                return response.status(403).json({'error': 'Вы ввели неверный логин или пароль.'})
            }

            if (crypto.createHash('md5').update(password).digest('hex') != rows[0].password_md5) {
                return response.status(403).json({'error': 'Вы ввели неверный логин или пароль.'})
            }
            
            return response.status(200).json({'result': 'Успех!', 'token': rows[0].token})
        });
    }

    async setDescription(request, response) {
        if (!tools.checkJsonKey(request.body, 'token') || !tools.checkJsonKey(request.body, 'description')) {
            return response.status(400).json({'error': 'Некорректные данные.'});
        }

        var token = tools.delInjection(request.body.token);
        var description = tools.delInjection(request.body.description);

        database.query('SELECT * FROM `users` WHERE token="' + token + '";', (error, rows, fields) => {
            if (error) {
                return response.status(500).json({'error': 'Ошибка на сервере, пошел ты нахуй.'});
            }

            if (!rows.length > 0) {
                return response.status(403).json({'error': 'Доступ запрещён.'})
            }

            if (token != rows[0].token) {
                return response.status(403).json({'error': 'Доступ запрещён.'})
            }

            if (description.length > 1000) {
                return response.status(400).json({'error': 'Описание не должно составлять больше 1000 символов'})
            }
            
            database.query("UPDATE `users` SET `description` = '" + description + "' WHERE `token` = '" + token + "';", (error) => {
                if (error) {
                    return response.status(500).json({'error': 'Произошла ошибка на сервере.'})
                }
            })

            return response.status(200).json({'result': 'Описание успешно изменено!'})
        });
    }

    async getUser(request, response) {
        if (!tools.checkJsonKey(request.body, 'id')) {
            return response.status(400).json({'error': 'Некорректные данные.'});
        }

        var id = tools.delInjection(request.body.id);

        database.query('SELECT * FROM `users` WHERE id="' + id + '";', (error, rows, fields) => {
            if (error) {
                return response.status(500).json({'error': 'Ошибка на сервере, пошел ты нахуй.' + error});
            }

            if (!rows.length > 0) {
                return response.status(403).json({'error': 'Пользователь не найден.'})
            }

            return response.status(200).json({'result': {
                'id': rows[0].id, 
                'username': rows[0].username, 
                'role': rows[0].role, 
                'date_register_unix': rows[0].date_register_unix,
                'banned': rows[0].banned,
                'image_link': rows[0].image_link,
                'description': rows[0].description
            }});

        });
    }

    async setImageLink(request, response) {
        if (!tools.checkJsonKey(request.body, 'token') || !tools.checkJsonKey(request.body, 'imageLink')) {
            return response.status(400).json({'error': 'Некорректные данные.'});
        }

        var token = tools.delInjection(request.body.token);
        var imageLink = tools.delInjection(request.body.imageLink);

        database.query('SELECT * FROM `users` WHERE token="' + token + '";', (error, rows, fields) => {
            if (error) {
                return response.status(500).json({'error': 'Ошибка на сервере, пошел ты нахуй.'});
            }

            if (!rows.length > 0) {
                return response.status(403).json({'error': 'Доступ запрещён.'})
            }

            if (token != rows[0].token) {
                return response.status(403).json({'error': 'Доступ запрещён.'})
            }

            if (imageLink.length > 500) {
                return response.status(400).json({'error': 'Ссылка на аватар не должна составлять больше 500 символов'})
            }
            
            database.query("UPDATE `users` SET `image_link` = '" + imageLink + "' WHERE `token` = '" + token + "';", (error) => {
                if (error) {
                    return response.status(500).json({'error': 'Произошла ошибка на сервере.'})
                }
            })

            return response.status(200).json({'result': 'Ссылка на аватар успешно изменена!'})
        });
    }

    async createTheme(request, response) {
        if (!tools.checkJsonKey(request.body, 'title') || !tools.checkJsonKey(request.body, 'description' || !tools.checkJsonKey(request.body, 'token'))) {
            return response.status(400).json({'error': 'Некорректные данные.'});
        }

        var title = tools.delInjection(request.body.title);
        var description = tools.delInjection(request.body.description);
        var token = tools.delInjection(request.body.token);

        if (title > 50) {
            return response.status(403).json({'error': 'Название темы не должно составлять больше 50 символов'})
        }

        if (description.length > 1000) {
            return response.status(403).json({'error': 'Описание темы не должно составлять больше 1000 символов'})
        }

        database.query('SELECT * FROM `users` WHERE token="' + token + '";', (error, rows, fields) => {
            if (error) {
                return response.status(500).json({'error': 'Ошибка на сервере, пошел ты нахуй.'});
            }

            if (!rows.length > 0) {
                return response.status(403).json({'error': 'Доступ запрещён.'})
            }

            database.query("INSERT INTO `themes` (" + 
                "`author`, " +
                "`title`, " +
                "`description`, " +
                "`date_create`, " + 
                "`author_id`" + ") VALUES (" +
                "'" + rows[0].username + "', " +
                "'" + title + "', " +
                "'" + description + "', " +
                "'" + Date.now() + "', " +
                "'" + rows[0].id + "'" +
                ");", (error, rows_database) => {
                    if (error) {
                        return response.status(500).json({'error': 'Произошла ошибка на сервере.'})
                    }

                    return response.status(200).json({'result': {'message': 'Успех!', 'theme_id': rows_database.insertId}})
            })
        });
    }

    async getTheme(request, response) {
        if (!tools.checkJsonKey(request.body, 'theme_id' || !tools.checkJsonKey(request.body, 'token'))) {
            return response.status(400).json({'error': 'Некорректные данные.'});
        }

        var theme_id = tools.delInjection(request.body.theme_id);
        var token = tools.delInjection(request.body.token);
        
        database.query('SELECT * FROM `users` WHERE token="' + token + '";', (error, rows, fields) => {
            if (error) {
                return response.status(500).json({'error': 'Ошибка на сервере, пошел ты нахуй.'});
            }

            if (!rows.length > 0) {
                return response.status(403).json({'error': 'Доступ запрещён.'})
            }

            database.query('SELECT * FROM `themes` WHERE id="' + theme_id + '";', (error, rows_database, fields) => {
                if (error) {
                    return response.status(500).json({'error': 'Ошибка на сервере, пошел ты нахуй.'});
                }
    
                if (!rows_database.length > 0) {
                    return response.status(403).json({'error': 'Тема не найдена.'})
                }
    
                return response.status(200).json({'result': {
                    'id': rows_database[0].id,
                    'author_id': rows_database[0].author_id,
                    'author': rows_database[0].author, 
                    'description': rows_database[0].description, 
                    'date_create': rows_database[0].date_create
                }});
    
            });
        })
    }

    async editTheme(request, response) {
        if (
            !tools.checkJsonKey(request.body, 'token') || 
            !tools.checkJsonKey(request.body, 'description') || 
            !tools.checkJsonKey(request.body, 'title') || 
            !tools.checkJsonKey(request.body, 'theme_id') ||
            !tools.checkJsonKey(request.body, 'user_id')
        ) {
            return response.status(400).json({'error': 'Некорректные данные.'});
        }

        var token = tools.delInjection(request.body.token);
        var description = tools.delInjection(request.body.description);
        var title = tools.delInjection(request.body.title);
        var theme_id = tools.delInjection(request.body.theme_id);
        var user_id = tools.delInjection(request.body.user_id);

        database.query('SELECT * FROM `users` WHERE token="' + token + '";', (error, rows_user, fields) => {
            if (error) {
                return response.status(500).json({'error': 'Ошибка на сервере, пошел ты нахуй.'});
            }

            if (!rows_user.length > 0 || rows_user[0].id != user_id) {
                return response.status(403).json({'error': 'Доступ запрещён.'})
            }

            database.query('SELECT * FROM `themes` WHERE id="' + theme_id + '";', (error, rows_database, fields) => {
                if (error) {
                    return response.status(500).json({'error': 'Ошибка на сервере, пошел ты нахуй.'});
                }
    
                if (!rows_database.length > 0) {
                    return response.status(403).json({'error': 'Тема не найдена.'})
                }

                if (rows_database[0].author_id != user_id) {
                    return response.status(403).json({'error': 'Вы не являетесь автором темы.'})
                }

                if (description.length > 1000) {
                    return response.status(403).json({'error': 'Описание не должно составлять больше 1000 символов'})
                }
    
                if (title.length > 100) {
                    return response.status(403).json({'error': 'Название темы не должно составлять больше 100 символов'})
                }

                database.query("UPDATE `themes` SET `title` = '" + title + "', `description` = '" + description + "' WHERE `id` = '" + theme_id + "';", (error, rows_database) => {
                    if (error) {
                        return response.status(500).json({'error': 'Произошла ошибка на сервере.' + error})
                    }

                    return response.status(200).json({'result': 'Описание успешно изменено!'})
                })
            });
        });
    }

    async deleteTheme(request, response) {
        if (
            !tools.checkJsonKey(request.body, 'token') || 
            !tools.checkJsonKey(request.body, 'theme_id') ||
            !tools.checkJsonKey(request.body, 'user_id')
        ) {
            return response.status(400).json({'error': 'Некорректные данные.'});
        }

        var token = tools.delInjection(request.body.token);
        var theme_id = tools.delInjection(request.body.theme_id);
        var user_id = tools.delInjection(request.body.user_id);

        database.query('SELECT * FROM `users` WHERE token="' + token + '";', (error, rows_user, fields) => {
            if (error) {
                return response.status(500).json({'error': 'Ошибка на сервере, пошел ты нахуй.'});
            }

            if (!rows_user.length > 0 || rows_user[0].id != user_id) {
                return response.status(403).json({'error': 'Доступ запрещён.'})
            }

            database.query('SELECT * FROM `themes` WHERE id="' + theme_id + '";', (error, rows_database, fields) => {
                if (error) {
                    return response.status(500).json({'error': 'Ошибка на сервере, пошел ты нахуй.'});
                }
    
                if (!rows_database.length > 0) {
                    return response.status(403).json({'error': 'Тема не найдена.'})
                }

                if (rows_database[0].author_id != user_id) {
                    return response.status(403).json({'error': 'Вы не являетесь автором темы.'})
                }

                database.query("DELETE FROM `themes` WHERE `themes`.`id` = '" + theme_id + "';", (error, rows_database) => {
                    if (error) {
                        return response.status(500).json({'error': 'Произошла ошибка на сервере.' + error})
                    }

                    return response.status(200).json({'result': 'Тема успешно удалена!'})
                })
            });
        });
    }

    async getThemes(request, response) {
        database.query('SELECT * FROM `themes`;', (error, rows, fields) => {
            if (error) {
                return response.status(500).json({'error': 'Ошибка на сервере, пошел ты нахуй.' + error});
            }

            return response.status(200).json({'result': rows});

        });
    }
}

export default new apiRequestController;