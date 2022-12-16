import mysql from 'mysql';

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'psuti-gang'
})

export default connection;