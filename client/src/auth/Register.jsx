import React from 'react';
import { Card, Flex, Form, Input, Typography, Button, Alert, Spin} from 'antd';
import { Link } from 'react-router-dom';
import registerImage from '../assets/register.png'
import useSignup from '../hooks/useSignup';

const Register = () => {
  const  {loading, error, registerUser } = useSignup();
  const handleRegister = (values) =>{
    registerUser(values);
  }
  return (
    <Card className="form-contianer">
      <Flex gap="large" align="center">
        {/* form */}
        <Flex vertical flex={1}>
          <Typography.Title level={3} className="title">
            Создать учетную запись
          </Typography.Title>
          <Typography.Text type="secondary" strong className="slogan">
            Присоединяйтесь для облегчения своей жизни!
          </Typography.Text>
          <Form 
            layout="vertical"
            onFinish={handleRegister}
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

            <Form.Item 
              label="Подтвердите пароль" 
              name="passwordConfirm" 
              rules={[
              {
              required: true,
              message: 'Пожалуйста, введите свой подтверждающий пароль!'
              },
            ]}>
              <Input.Password size="large" placeholder="Повторно введите свой пароль!" />
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
                {loading ? <Spin /> : 'Создать аккаунт'}
              </Button>
            </Form.Item>
            <Form.Item>
              <Link to="/login">
                <Button size="large" className="btn">
                  Войти в уже существующий
                </Button>
              </Link>
            </Form.Item>

          </Form>
        </Flex>

        {/* image */}
        <Flex flex={1}>
          <img src={registerImage} className="auth-image" />
        </Flex>
      </Flex>
    </Card>
  );
};

export default Register;