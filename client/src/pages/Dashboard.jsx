import React, { useState, useEffect } from 'react';
import { Avatar, Button, Card, Checkbox, Flex, Typography } from 'antd';
import { useAuth } from '../contexts/AuthContext.jsx';
import { UserOutlined } from "@ant-design/icons";
import MapComponent from '../components/MapComponent'; // Компонент карты
import { Link } from 'react-router-dom'; // Импортируем Link
import useGetCafeData from '../hooks/useGetCafeData'; // Импортируем хук для данных кафе
import useGetUserInfo from '../hooks/useGetUserInfo'; // Импортируем хук для данных пользователя

const Dashboard = () => {
  const { userData, logout } = useAuth();
  const [allergens, setAllergens] = useState([]);
  const [name, setName] = useState([]);
  const [updateKey, setUpdateKey] = useState(0); // Состояние для обновления карты
  const { cafeData, loading, error } = useGetCafeData(); // Получаем данные кафе с помощью хука
  const { userInfo, loading: userLoading, error: userError } = useGetUserInfo(); // Получаем данные пользователя с помощью хука

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.full_name);
      setAllergens(userInfo.allergies); // Устанавливаем аллергены пользователя
    }
  }, [userInfo]);

  const handleLogout = async () => {
    await logout();
  };

  const handleRefreshMap = () => {
    setUpdateKey(prevKey => prevKey + 1); // Обновляем карту, чтобы перерисовать маркеры
  };

  return (
    <div>
      <Card className="profile-card">
        <Flex vertical gap="small" align="center">
          <Avatar size={80} icon={<UserOutlined />} className="avatar" />
          <Typography.Title level={2} strong className="username">
            {name}
          </Typography.Title>
          <Typography.Text type="secondary" strong>
            Почта: {userData.email}
          </Typography.Text>
          <Link to="/changepassword" className="link-button">
            <Button size="large" type="primary" className="profile-btn">
              Сменить пароль
            </Button>
          </Link>

          <Link to="/userinfo" className="link-button">
            <Button size="large" type="primary" className="profile-btn">
              Смена информации
            </Button>
          </Link>

          <Button 
            size="large" 
            type="primary" 
            onClick={handleRefreshMap} 
            className="profile-btn"
          >
            Обновить карту
          </Button>

          <Button 
            size="large" 
            type="primary" 
            className="profile-btn logout-btn"
            onClick={handleLogout}
          >
            Выход
          </Button>

        </Flex>
      </Card>

      <Card className="map-container" style={{ marginTop: '0%' }}>
        {loading ? (
          <Typography.Text>Загрузка карты...</Typography.Text>
        ) : error ? (
          <Typography.Text type="danger">{error}</Typography.Text>
        ) : (
          <MapComponent
            cafeData={cafeData} // Передаем данные о кафе в компонент карты
            allergens={allergens}
            updateKey={updateKey} // Передаем ключ для обновления карты
          />
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
