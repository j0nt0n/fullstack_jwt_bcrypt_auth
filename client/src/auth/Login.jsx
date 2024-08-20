import React from 'react';
import { Card, Flex, Form, Input, Typography, Button, Alert, Spin} from 'antd';
import { Link } from 'react-router-dom';
import loginImage from '../assets/register.png'
import useLogin from '../hooks/useLogin';

const Login = () => {
  const {error, loading, loginUser} = useLogin();
  const handleLogin = async (values) =>{
    await loginUser(values);
   }
  return (
    <Card className="form-contianer">
      <Flex gap="large" align="center">
        {/* image */}
        <Flex flex={1}>
          <img src={loginImage} className="auth-image" />
        </Flex>

        {/* form */}
        <Flex vertical flex={1}>
          <Typography.Title level={3} className="title">
            Вход в аккаунт
          </Typography.Title>
          <Typography.Text type="secondary" strong className="slogan">
            Войдите в свой аккаунт!
          </Typography.Text>
          <Form 
            layout="vertical"
            onFinish={handleLogin}
            autoComplete="off"
          >

            <Form.Item 
              label="Почта" 
              name="email" 
              rules={[
              {
              required: true,
              message: 'Пожалуйста, введите свой адрес электронной почты!'
              },
              {
                type: 'email',
                message: 'Введенный адрес электронной почты неверен',
              }
            ]}>
              <Input size="large" placeholder="Введите свой адрес электронной почты!" />
            </Form.Item>

            <Form.Item 
              label="Пароль" 
              name="password" 
              rules={[
              {
              required: true,
              message: 'Пожалуйста, введите свой пароль!'
              },
            ]}>
              <Input.Password size="large" placeholder="Введите свой пароль!" />
            </Form.Item>

            {
              error && 
                <Alert 
                  description={error}  
                  type="error" 
                  showIcon 
                  closable 
                  className="alert"
                />
              
            }

            <Form.Item >
              <Button 
                type={`${loading ? '' : 'primary'}`} 
                htmlType="submit" 
                size="large" 
                className="btn"
              >
                {loading ? <Spin /> : 'Вход'}
              </Button>
            </Form.Item>
            <Form.Item>
              <Link to="/signup">
                <Button size="large" className="btn">
                  Создать учетную запись
                </Button>
              </Link>
            </Form.Item>
          </Form>
        </Flex>
      </Flex>
    </Card>
  );
};

export default Login;