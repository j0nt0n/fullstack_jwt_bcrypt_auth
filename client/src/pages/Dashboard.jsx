import React from 'react';
import { Avatar, Button, Card, Flex, Typography } from 'antd';
import { useAuth } from '../contexts/AuthContext.jsx';
import { UserOutlined } from "@ant-design/icons";
import { YMaps, Map, ObjectManager  } from "@pbe/react-yandex-maps";

const mapState = { center: [55.76, 37.64], zoom: 10, controls: ["zoomControl", "fullscreenControl"],};

const objectManagerFeatures = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: 1,
      geometry: {
        type: "Point",
        coordinates: [55.869339, 37.498519]
      },
      properties: {
        balloonContent: "Точка 1",
        hintContent: "Общага"
      }
    },
    {
      type: "Feature",
      id: 2,
      geometry: {
        type: "Point",
        coordinates: [55.856124, 37.555723]
      },
      properties: {
        balloonContent: "Точка 2",
        hintContent: "Дом любви"
      }
    },
  ]
};

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

      <Card className="yandex-map">
      <YMaps>
        <Map width="950px" height="750px" state={mapState} modules={["control.ZoomControl", "control.FullscreenControl"]}>
        <ObjectManager 
          options={{ 
          clusterize: true, 
          gridSize: 32, 
        }} 
        objects={{ 
          openBalloonOnClick: true, 
          preset: "islands#greenDotIcon", 
        }} 
        clusters={{ 
          preset: "islands#redClusterIcons", 
        }} 
        defaultFeatures={objectManagerFeatures} 
        modules={[ 
          "objectManager.addon.objectsBalloon", 
          "objectManager.addon.objectsHint", 
        ]} 
        />
        </Map>
      </YMaps>
      </Card>
    </div>
  ); 
};

export default Dashboard;