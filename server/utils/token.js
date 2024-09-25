const jwt = require('jsonwebtoken');
require('dotenv').config();

// Функция для генерации токена подтверждения
function generateVerificationToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
}

module.exports = {
  generateVerificationToken,
};