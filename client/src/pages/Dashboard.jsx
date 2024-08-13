import React, { useState } from 'react';
import { Avatar, Button, Card, Checkbox, Flex, Typography } from 'antd';
import { useAuth } from '../contexts/AuthContext.jsx';
import { UserOutlined } from "@ant-design/icons";
import { YMaps, Map, ObjectManager } from "@pbe/react-yandex-maps";

const mapState = { center: [55.76, 37.64], zoom: 10, controls: ["zoomControl", "fullscreenControl"] };

const restaurantData = [
  { 
    id: 1, 
    coordinates: [55.869339, 37.498519], 
    name: "Ресторан 1", 
    products: ["орехи", "рыба"], 
    description: "Уютный ресторан с отличной кухней и обслуживанием.",
    imageUrl: "https://avatars.mds.yandex.net/get-altay/10238647/2a000001904c30be9b6d405d1e7c1e90048b/L"
  },
  { 
    id: 2, 
    coordinates: [55.856124, 37.555723], 
    name: "Ресторан 2", 
    products: ["молоко", "яйца"],
    description: "Уютный ресторан с отличной кухней и обслуживанием.",
    imageUrl: "https://avatars.mds.yandex.net/get-altay/10238647/2a000001904c30be9b6d405d1e7c1e90048b/L"
  },
  { 
    id: 3, 
    coordinates: [55.751244, 37.618423], 
    name: "Ресторан 3", 
    products: ["орехи", "яйца"],
    description: "Уютный ресторан с отличной кухней и обслуживанием.",
    imageUrl: "https://avatars.mds.yandex.net/get-altay/10238647/2a000001904c30be9b6d405d1e7c1e90048b/L"
  },
];

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

  const objectManagerFeatures = {
    type: "FeatureCollection",
    features: restaurantData.map(restaurant => {
      const hasAllergen = restaurant.products.some(product => allergens.includes(product));
      return {
        type: "Feature",
        id: restaurant.id,
        geometry: { type: "Point", coordinates: restaurant.coordinates },
        properties: {
          balloonContent: `
            <div>
              <h3>${restaurant.name}</h3>
              ${restaurant.description ? `<p>${restaurant.description}</p>` : ''}
              ${restaurant.imageUrl ? `<img src="${restaurant.imageUrl}" alt="${restaurant.name}" style="width:100px;height:auto;" />` : ''}
              <p>Продукты: ${restaurant.products.join(", ")}</p>
            </div>
          `,
          hintContent: restaurant.name,
        },
        options: {
          preset: hasAllergen ? 'islands#redDotIcon' : 'islands#greenDotIcon',
        },
      };
    }),
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
        <YMaps>
          <Map width="950px" height="750px" state={mapState} modules={["control.ZoomControl", "control.FullscreenControl"]}>
            <ObjectManager 
              key={updateKey} // Используем ключ для принудительного обновления
              options={{ clusterize: true, gridSize: 32 }} 
              objects={{ openBalloonOnClick: true }} 
              clusters={{ preset: "islands#redClusterIcons" }} 
              features={objectManagerFeatures} // Используем features вместо defaultFeatures
              modules={[ "objectManager.addon.objectsBalloon", "objectManager.addon.objectsHint" ]}
            />
          </Map>
        </YMaps>
      </Card>
    </div>
  ); 
};

export default Dashboard;
