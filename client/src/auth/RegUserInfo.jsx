import React, { useState } from 'react';
import { Card, Flex, Form, Input, Typography, Button, Alert, Spin } from 'antd';
import { Link } from 'react-router-dom';
import registerImage from '../assets/register.png';
import useRegUserInfo from '../hooks/useRegUserInfo'; // Хук для отправки данных пользователя

const RegisterUserInfo = () => {
  const { error, loading, submitUserInfo } = useRegUserInfo();
  const [form] = Form.useForm();

  const handleRegisterUserInfo = async (values) => {
    // Преобразование строки аллергий в массив, удаление пробелов и приведение к нижнему регистру
    const allergiesArray = values.allergies
      .split(',')
      .map(allergy => allergy.trim().toLowerCase());

    const userInfo = { ...values, allergies: allergiesArray };
    
    await submitUserInfo(userInfo); // Отправляем данные формы
    form.resetFields(); // Очистка полей формы после успешной регистрации
  };

  return (
    <Card className="form-container">
      <Flex gap="large" align="center">
        {/* image */}
        <Flex flex={1}>
          <img src={registerImage} className="auth-image" alt="Register User Info" />
        </Flex>

        {/* form */}
        <Flex vertical flex={1}>
          <Typography.Title level={3} className="title">
            Регистрация информации о пользователе
          </Typography.Title>
          <Typography.Text type="secondary" strong className="slogan">
            Заполните вашу информацию
          </Typography.Text>
          <Form
            layout="vertical"
            form={form}
            onFinish={handleRegisterUserInfo}
            autoComplete="off"
          >
            <Form.Item
              label="Полное имя"
              name="full_name"
              rules={[
                {
                  required: true,
                  message: 'Пожалуйста, введите ваше полное имя!',
                },
              ]}
            >
              <Input size="large" placeholder="Введите ваше полное имя" />
            </Form.Item>

            <Form.Item
              label="Номер телефона"
              name="phone_number"
              rules={[
                {
                  required: true,
                  message: 'Пожалуйста, введите ваш номер телефона!',
                },
              ]}
            >
              <Input size="large" placeholder="Введите ваш номер телефона" />
            </Form.Item>

            <Form.Item
              label="Возраст"
              name="age"
              rules={[
                {
                  required: true,
                  message: 'Пожалуйста, введите ваш возраст!',
                },
              ]}
            >
              <Input size="large" placeholder="Введите ваш возраст" />
            </Form.Item>

            <Form.Item
              label="Пол"
              name="gender"
              rules={[
                {
                  required: true,
                  message: 'Пожалуйста, укажите ваш пол!',
                },
              ]}
            >
              <Input size="large" placeholder="Укажите ваш пол (мужской/женский)" />
            </Form.Item>

            <Form.Item
              label="Аллергии"
              name="allergies"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input size="large" placeholder="Укажите ваши аллергии через запятую" />
            </Form.Item>

            {error && (
              <Alert
                description={error}
                type="error"
                showIcon
                closable
                className="alert"
              />
            )}

            <Form.Item>
              <Button
                type={`${loading ? '' : 'primary'}`}
                htmlType="submit"
                size="large"
                className="btn"
              >
                {loading ? <Spin /> : 'Отправить информацию'}
              </Button>
            </Form.Item>
            <Form.Item>
              <Link to="/">
                <Button size="large" className="btn">
                  Назад на главную
                </Button>
              </Link>
            </Form.Item>
          </Form>
        </Flex>
      </Flex>
    </Card>
  );
};

export default RegisterUserInfo;
