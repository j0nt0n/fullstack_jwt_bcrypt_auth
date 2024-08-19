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

      // Выполняем запрос к API для получения данных
      const res = await fetch(
        'https://apidata.mos.ru/v1/datasets/587/features?versionNumber=7&releaseNumber=24&api_key=441375bc-4f4e-4fab-9a0c-91640c20e7db', 
        { method: 'GET' }
      );

      const data = await res.json(); // Обрабатываем ответ от сервера

      if (res.ok) {
        if (data.features) {
          // Форматируем данные
          const formattedData = data.features.map((feature) => {
            const { ID, ObjectType, StationaryObjectName, Address } = feature.properties.attributes;
            const { coordinates } = feature.geometry;

            // Меняем местами долготу и широту
            const [longitude, latitude] = coordinates;

            return {
              id: ID, // Используем ID объекта
              coordinates: [latitude, longitude], // Меняем местами координаты
              name: StationaryObjectName, // Название объекта
              products: [], // Массив продуктов пока пустой
              description: `${ObjectType} в ${Address}`, // Формируем описание
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
