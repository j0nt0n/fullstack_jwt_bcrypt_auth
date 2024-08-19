const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const authRoute = require('./routes/authRoute');
const app = express();

require('dotenv').config();

// 1) промежуточные продукты
app.use(cors());
app.use(express.json());

// 2) роутеры
app.use('/api/auth', authRoute);

// 3) бд
pool.query('SELECT NOW()', (err, res) => {
    if(err) {
      console.error('Error connecting to the database', err.stack);
    } else {
      console.log('Connected to the database:', res.rows);
    }
  });


// 4) глобальный обработчик ошибок
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});


// 5) сервер
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});