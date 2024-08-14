import React, { useState } from 'react';
import { Card, Flex, Form, Input, Typography, Button, Alert, Spin } from 'antd';
import { Link } from 'react-router-dom';
import loginImage from '../assets/register.png'
import useChangePassword from '../hooks/useChangePassword'; 

const ChangePassword = () => {
  const { error, loading, changePassword } = useChangePassword();
  const [form] = Form.useForm();

  const handleChangePassword = async (values) => {
    await changePassword(values.currentPassword, values.newPassword);
    form.resetFields(); // Очистка полей формы после успешной смены пароля
  };

  return (
    <Card className="form-container">
      <Flex gap="large" align="center">
        {/* image */}
        <Flex flex={1}>
          <img src={loginImage} className="auth-image" alt="Change Password" />
        </Flex>

        {/* form */}
        <Flex vertical flex={1}>
          <Typography.Title level={3} className="title">
            Смена пароля
          </Typography.Title>
          <Typography.Text type="secondary" strong className="slogan">
            Обновите ваш пароль
          </Typography.Text>
          <Form
            layout="vertical"
            form={form}
            onFinish={handleChangePassword}
            autoComplete="off"
          >
            <Form.Item
              label="Текущий пароль"
              name="currentPassword"
              rules={[
                {
                  required: true,
                  message: 'Пожалуйста, введите ваш текущий пароль!',
                },
              ]}
            >
              <Input.Password size="large" placeholder="Введите текущий пароль" />
            </Form.Item>

            <Form.Item
              label="Новый пароль"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: 'Пожалуйста, введите новый пароль!',
                },
                {
                  min: 2,
                  message: 'Пароль должен содержать как минимум 2 символов!',
                },
              ]}
            >
              <Input.Password size="large" placeholder="Введите новый пароль" />
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

            <Form.Item>
              <Button
                type={`${loading ? '' : 'primary'}`}
                htmlType="submit"
                size="large"
                className="btn"
              >
                {loading ? <Spin /> : 'Сменить пароль'}
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

export default ChangePassword;
