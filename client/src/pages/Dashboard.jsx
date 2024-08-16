import React, { useState } from 'react';
import { Avatar, Button, Card, Checkbox, Flex, Typography } from 'antd';
import { useAuth } from '../contexts/AuthContext.jsx';
import { UserOutlined } from "@ant-design/icons";
import MapComponent from '../components/MapComponent'; // Импортируем компонент карты
import { Link } from 'react-router-dom'; // Импортируйте Link
import restaurantData from '../data/restaurantData'; // Импортируем данные о ресторанах

const Dashboard = () => {
  const { userData, logout } = useAuth();
  const [allergens, setAllergens] = useState([]);
  const [updateKey, setUpdateKey] = useState(0); // Состояние для обновления карты

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
    setUpdateKey(prevKey => prevKey + 1); // Увеличиваем ключ для перерисовки карты
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
          
          {/* Кнопка для перехода на страницу смены пароля */}
          <Link to="/changepassword" className="link-button">
            <Button 
              size="large" 
              type="primary" 
              className="profile-btn"
            >
              Сменить пароль
            </Button>
          </Link>

          <Link to="/userinfo" className="link-button">
            <Button 
              size="large" 
              type="primary" 
              className="profile-btn"
            >
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
            <Typography.Title level={4} strong>Выбор аллергенов или продуктов которые сегодня бы не хотели:</Typography.Title>
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

      <Card className="yandex-map">
        <MapComponent
          restaurantData={restaurantData}
          allergens={allergens}
          updateKey={updateKey}
        />
      </Card>
    </div>
  ); 
};

export default Dashboard;
