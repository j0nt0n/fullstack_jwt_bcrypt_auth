import React, { useState, useEffect } from 'react';
import { Avatar, Button, Card, Checkbox, Flex, Typography } from 'antd';
import { useAuth } from '../contexts/AuthContext.jsx';
import { UserOutlined } from "@ant-design/icons";
import MapComponent from '../components/MapComponent'; // Компонент карты
import { Link } from 'react-router-dom'; // Импортируем Link
import useGetCafeData from '../hooks/useGetCafeData'; // Импортируем хук для данных кафе

const Dashboard = () => {
  const { userData, logout } = useAuth();
  const [allergens, setAllergens] = useState([]);
  const [updateKey, setUpdateKey] = useState(0); // Состояние для обновления карты
  const { cafeData, loading, error } = useGetCafeData(); // Получаем данные кафе с помощью хука

  const handleLogout = async () => {
    await logout();
  };

  const handleAllergenChange = (e) => {
    const value = e.target.value;
    setAllergens(prevAllergens =>
      prevAllergens.includes(value)
        ? prevAllergens.filter(item => item !== value)
        : [...prevAllergens, value]
    );
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
            {userData.name}
          </Typography.Title>
          <Typography.Text type="secondary" strong>
            Почта: {userData.email}
          </Typography.Text>
          <Typography.Text type="secondary">
            Роль: {userData.role}
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
            className="profile-btn"
            onClick={handleLogout}
          >
            Выход
          </Button>

          <Card className="allergen-card">
            <Typography.Title level={4} strong>Выбор аллергенов или продуктов, которые сегодня бы не хотели:</Typography.Title>
            <div>
              <Checkbox value="орехи" onChange={handleAllergenChange}>орехи</Checkbox>
              <Checkbox value="яйца" onChange={handleAllergenChange}>яйца</Checkbox>
              <Checkbox value="молоко" onChange={handleAllergenChange}>молоко</Checkbox>
            </div>
            <Button 
              type="primary" 
              onClick={handleRefreshMap} 
              style={{ marginTop: '16px' }}
            >
              Обновить карту
            </Button>
          </Card>
        </Flex>
      </Card>

      <Card className="yandex-map" style={{ marginTop: '16px' }}>
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
