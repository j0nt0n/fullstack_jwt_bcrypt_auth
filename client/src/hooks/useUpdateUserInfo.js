import { useState } from 'react';
import { message } from 'antd';
import { useAuth } from '../contexts/AuthContext.jsx';

const useUpdateUserInfo = () => {
  const { token } = useAuth(); // Получаем токен из контекста
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateUserInfo = async (values, onSuccess) => {
    try {
      setLoading(true);
      setError(null);

      // Проверяем наличие токена
      if (!token) {
        setError('Токен отсутствует. Пожалуйста, войдите в систему.');
        message.error('Токен отсутствует. Пожалуйста, войдите в систему.');
        setLoading(false);
        return;
      }

      // Выполняем запрос к API для обновления данных пользователя
      const res = await fetch('http://localhost:3000/api/updinfo', {
        method: 'PATCH', // Используем метод PATCH для обновления данных
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Передаем токен в заголовке запроса
        },
        body: JSON.stringify(values), // Преобразуем данные пользователя в формат JSON для отправки на сервер
      });

      const data = await res.json(); // Обрабатываем ответ от сервера

      if (res.ok) {
        message.success('Информация успешно обновлена'); // Сообщаем об успешном обновлении
        if (onSuccess) {
          onSuccess(); // Вызываем колбек после успешного обновления
        }
      } else if (res.status === 401) {
        setError('Не авторизован. Пожалуйста, войдите в систему.');
        message.error('Не авторизован. Пожалуйста, войдите в систему.');
      } else {
        setError(data.message || 'Не удалось обновить данные пользователя');
        message.error(data.message || 'Не удалось обновить данные пользователя');
      }
    } catch (err) {
      setError('Произошла ошибка: ' + err.message);
      message.error('Произошла ошибка: ' + err.message);
    } finally {
      setLoading(false); // Останавливаем загрузку в любом случае
    }
  };

  return { updateUserInfo, loading, error };
};

export default useUpdateUserInfo;
