const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoute = require('./routes/authRoute');
const app = express();

// 1) промежуточные продукты
app.use(cors());
app.use(express.json());

// 2) роутеры
app.use('/api/auth', authRoute);

// 3) монго дб
mongoose
    .connect('mongodb://127.0.0.1:27017/js')
    .then(() => console.log('Connected to Mongo!'))
    .catch((error) => console.error('Failed to connect to MongoDB', error));


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
const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`App runing on ${PORT}`);
});