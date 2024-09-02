import { useState } from 'react';
import { message } from 'antd';
import { useAuth } from '../contexts/AuthContext.jsx';

const useRegUserInfo = () => {
    const { token } = useAuth(); // Предполагается, что токен пользователя доступен через контекст
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const submitUserInfo = async (userInfo) => {
        const { full_name, phone_number, age, gender, allergies } = userInfo;

        try {
            setError(null);
            setLoading(true);

            const res = await fetch("http://192.168.89.181:3000/api/reginfo", {
                method: 'POST', // Используем метод POST для отправки данных
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Передаем токен пользователя в заголовке
                },
                body: JSON.stringify({
                    full_name,
                    phone_number,
                    age,
                    gender,
                    allergies
                }), // Преобразуем данные пользователя в формат JSON для отправки на сервер
            });

            const data = await res.json(); // Обрабатываем ответ от сервера

            if (res.status === 201) {
                message.success(data.message); // Сообщаем об успешной отправке данных
            } else if (res.status === 400 || res.status === 404 || res.status === 409) {
                setError(data.message);
                message.error(data.message); // Выводим ошибку, если сервер вернул соответствующий статус
            } else {
                message.error('Не удалось отправить данные'); // Сообщение об общей ошибке
            }
        } catch (error) {
            message.error('Произошла ошибка: ' + error.message); // Обрабатываем ошибки сети и другие исключения
        } finally {
            setLoading(false); // Сбрасываем состояние загрузки
        }
    };

    return { loading, error, submitUserInfo }; // Возвращаем функцию и состояния
};

export default useRegUserInfo;
