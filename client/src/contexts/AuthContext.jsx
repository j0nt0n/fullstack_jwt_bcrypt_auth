import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios'; // Для отправки HTTP-запросов

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const storedData = JSON.parse(localStorage.getItem('user_data'));

    useEffect(() => {
        if (storedData) {
            const { userToken, user } = storedData;
            setToken(userToken);
            setUserData(user);
            setIsAuthenticated(true);
        }
    }, []);

    const login = (newToken, newData) => {
        localStorage.setItem(
            "user_data", 
            JSON.stringify({userToken: newToken, user: newData}),
        );

        setToken(newToken);
        setUserData(newData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("user_data");
        setToken(null);
        setUserData(null);
        setIsAuthenticated(false);
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            // Отправка запроса на сервер для смены пароля
            const response = await axios.patch(
                'http://localhost:3000/api/auth/change', // URL сервера
                { currentPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Использование текущего токена
                    }
                }
            );
            
            // Обработка успешного ответа
            console.log(response.data.message);
            // Обновление токена, если сервер вернул новый токен
            if (response.data.token) {
                login(response.data.token, userData);
            }
        } catch (error) {
            console.error('Ошибка при смене пароля:', error.response ? error.response.data.message : error.message);
        }
    };

    return (
        <AuthContext.Provider
            value={{ token, isAuthenticated, login, logout, userData, changePassword }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
