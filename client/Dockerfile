# Используем официальный Node.js образ как базовый
FROM node:alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь исходный код в контейнер
COPY . .

# Открываем порт, на котором работает сервер разработки
EXPOSE 5173

# Запускаем сервер разработки
CMD ["npm", "run", "dev", "--", "--host"]