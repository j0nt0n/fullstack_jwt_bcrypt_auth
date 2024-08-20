import { useState, useEffect } from 'react';
import { message } from 'antd';

const useGetCafeData = () => {
  const [cafeData, setCafeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCafeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Выполняем запрос к вашему API для получения данных
      const res = await fetch('http://localhost:3000/api/auth/getallrest', { method: 'GET' });

      // Обрабатываем ответ от сервера
      const data = await res.json();

      if (res.ok) {
        if (data.restaurants) {
          // Форматируем данные
          const formattedData = data.restaurants.map((restaurant) => {
            const { _id, coordinates, name, description, imageUrl, products } = restaurant;

            return {
              id: _id, // Используем rest_id объекта
              coordinates: coordinates, // Координаты уже в нужном формате
              name: name, // Название ресторана
              products: products || [], // Массив продуктов (аллергенов)
              description: description, // Описание ресторана
              imageUrl: imageUrl // URL изображения ресторана
            };
          });

          setCafeData(formattedData); // Устанавливаем отформатированные данные
        } else {
          setError('Данные отсутствуют');
          message.error('Данные отсутствуют');
        }
      } else {
        setError('Не удалось загрузить данные с сервера');
        message.error('Не удалось загрузить данные с сервера');
      }
    } catch (err) {
      setError('Произошла ошибка: ' + err.message);
      message.error('Произошла ошибка: ' + err.message);
    } finally {
      setLoading(false); // Завершаем состояние загрузки
    }
  };

  useEffect(() => {
    fetchCafeData(); // Вызываем функцию при монтировании компонента
  }, []);

  return { cafeData, loading, error, fetchCafeData }; // Возвращаем состояние и функцию для повторного вызова
};

export default useGetCafeData;
