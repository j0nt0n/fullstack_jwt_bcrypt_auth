const nodemailer = require('nodemailer');
require('dotenv').config();

// Функция для отправки письма с подтверждением
async function sendVerificationEmail(user, token) {
  const verificationLink = `http://zdorovyeitochka.ru/api/auth/verify/${token}`;

  // Настройка транспорта с использованием SMTP вашего почтового сервера
  const transporter = nodemailer.createTransport({
    host: 'postfix-mailcow', // Ваш домен почтового сервера
    port: 465, // Стандартный порт для SMTP с TLS
    secure: true, // false для STARTTLS (рекомендуется использовать STARTTLS)
    auth: {
      user: process.env.EMAIL_USER, // Ваша почта (напр., noreply@zdorovyeitochka.ru)
      pass: process.env.EMAIL_PASS, // Ваш пароль к почте
    },
    tls: {
      rejectUnauthorized: false, // Игнорировать самоподписанные сертификаты, если используются
    },
  });

  const mailOptions = {
    from: 'admin@zdorovyeitochka.ru', // Ваш почтовый адрес с домена
    to: user.email,
    subject: 'Подтверждение регистрации',
    text: `Нажмите на следующую ссылку, чтобы подтвердить ваш аккаунт: ${verificationLink}`,
    html: `<p>Нажмите на следующую ссылку, чтобы подтвердить ваш аккаунт: <a href="${verificationLink}">Подтвердить почту</a></p>`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendVerificationEmail,
};