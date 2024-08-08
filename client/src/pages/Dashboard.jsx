import React from 'react';
import { Avatar, Button, Card, Flex, Typography } from 'antd';
import { useAuth } from '../contexts/AuthContext.jsx';
import { UserOutlined } from "@ant-design/icons";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

const mapState = { center: [55.76, 37.64], zoom: 10 };

const Dashboard = () => {
  const { userData, logout} = useAuth();

  const handleLogout = async () => {
    await logout();
    
  }
  return(
    <div>
      <Card className="profile-card">
        <Flex vertical gap="small" align="center">
          <Avatar size={80} icon={<UserOutlined />} className="avatar" />
          <Typography.Title 
            level={2}   
            strong 
            className="username"
          >
            {userData.name}
          </Typography.Title>
          <Typography.Text type="secondary" strong>
            Email: {userData.email}
          </Typography.Text>
          <Typography.Text type="secondary">
            Role: {userData.role}
          </Typography.Text>
          <Button 
            size="large" 
            type="primary" 
            className="profile-btn"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Flex>
      </Card>

      <YMaps>
        <Map state={mapState}>

          <Placemark
            geometry={{
            coordinates: [55.751574, 37.573856]
          }}
            properties={{
            hintContent: 'Собственный значок метки',
            balloonContent: 'Это красивая метка'
          }}
            options={{
            iconLayout: 'default#image',
            iconImageHref: 'images/myIcon.gif',
            iconImageSize: [30, 42],
            iconImageOffset: [-3, -42]
          }}
          />
        </Map>
        </YMaps>
    </div>
  ); 
};

export default Dashboard;