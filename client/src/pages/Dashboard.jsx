import React from 'react';
import { Avatar, Button, Card, Flex, Typography } from 'antd';
import { useAuth } from '../contexts/AuthContext.jsx';
import { UserOutlined } from "@ant-design/icons";

const Dashboard = () => {
  const { userData, logout} = useAuth();

  const handleLogout = async () => {
    await logout();
    
  }
  return(
    <Card className="profile-card">
      <Flex vertical gap="smal" align="center">
        <Avatar size={150} icon={<UserOutlined />} className="avatar"/>
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
  ); 
};

export default Dashboard;