import { useState, useEffect } from 'react';
import { message } from 'antd';
import { useAuth } from '../contexts/AuthContext.jsx';

const useGetUserInfo = () => {
  const { token } = useAuth(); // Получаем токен из контекста
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserInfo = async () => {
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

      // Выполняем запрос к API для получения данных пользователя
      const res = await fetch('http://localhost:3000/api/auth/getinfo', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Передаем токен в заголовке запроса
        },
      });

      const data = await res.json(); // Обрабатываем ответ от сервера

      if (res.ok) {
        if (data.status === 'success') {
          setUserInfo(data.user); // Устанавливаем данные пользователя в состояние
        } else {
          setError(data.message || 'Ошибка при загрузке данных');
          message.error(data.message || 'Ошибка при загрузке данных');
        }
      } else if (res.status === 401) {
        setError('Не авторизован. Пожалуйста, войдите в систему.');
        message.error('Не авторизован. Пожалуйста, войдите в систему.');
      } else {
        setError('Не удалось загрузить данные пользователя');
        message.error('Не удалось загрузить данные пользователя');
      }
    } catch (err) {
      setError('Произошла ошибка: ' + err.message);
      message.error('Произошла ошибка: ' + err.message);
    } finally {
      setLoading(false); // Останавливаем загрузку в любом случае
    }
  };

  useEffect(() => {
    fetchUserInfo(); // Вызываем функцию для получения данных при монтировании компонента
  }, []);

  return { userInfo, loading, error, fetchUserInfo }; // Возвращаем состояние и функцию
};

export default useGetUserInfo;
