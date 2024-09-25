import { useState } from 'react';
import { message } from "antd";

const useSignup = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const registerUser = async (values) => {
        // Проверка, что пароли совпадают
        if (values.password !== values.passwordConfirm) {
            return setError("Пароли должны совпадать");
        }

        try {
            setError(null);
            setLoading(true);

            // Отправка данных на сервер
            const res = await fetch("api/auth/signup", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            // Успешная регистрация
            if (res.status === 201) {
                message.success("Регистрация успешна! Проверьте вашу почту для подтверждения.");
            }
            // Ошибка при регистрации (например, пользователь уже существует)
            else if (res.status === 400) {
                setError(data.message);
            } else {
                message.error("Не удалось выполнить регистрацию");
            }
        } catch (error) {
            message.error("Ошибка: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, registerUser };
};

export default useSignup;