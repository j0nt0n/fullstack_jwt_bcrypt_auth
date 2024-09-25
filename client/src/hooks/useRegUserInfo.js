import { useState } from 'react';
import { message } from 'antd';

const useRegUserInfo = (token) => { // Принимаем токен как аргумент
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const submitUserInfo = async (userInfo) => {
        const { full_name, phone_number, age, gender, allergies } = userInfo;

        try {
            setError(null);
            setLoading(true);

            const res = await fetch("api/reginfo", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Используем токен
                },
                body: JSON.stringify({
                    full_name,
                    phone_number,
                    age,
                    gender,
                    allergies
                }),
            });

            const data = await res.json();

            if (res.status === 201) {
                message.success(data.message);
                return true;
            } else {
                setError(data.message);
                message.error(data.message);
                return false;
            }
        } catch (error) {
            message.error('Произошла ошибка: ' + error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, submitUserInfo };
};

export default useRegUserInfo;