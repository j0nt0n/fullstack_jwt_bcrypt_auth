import { useState } from 'react';
import { message } from 'antd';
import { useAuth } from '../contexts/AuthContext.jsx';

const useChangePassword = () => {
    const { token } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const changePassword = async (currentPassword, newPassword) => {
        try {
            setError(null);
            setLoading(true);

            const res = await fetch("http://localhost:3000/api/auth/change", {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Передача токена в заголовке
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();

            if (res.status === 200) {
                message.success(data.message);
            } else if (res.status === 401 || res.status === 404) {
                setError(data.message);
                message.error(data.message);
            } else {
                message.error('Failed to change password');
            }
        } catch (error) {
            message.error('An error occurred: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, changePassword };
};

export default useChangePassword;
