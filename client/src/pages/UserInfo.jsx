import React, { useEffect } from 'react';
import { Card, Flex, Form, Input, Typography, Button, Alert, Spin } from 'antd';
import { Link } from 'react-router-dom'; // Импортируем useNavigate
import useFetchUserInfo from '../hooks/useGetUserInfo'; // Хук для получения данных
import useUpdateUserInfo from '../hooks/useUpdateUserInfo'; // Хук для обновления данных

const UserInfo = () => {
  const [form] = Form.useForm();
  const { userInfo, loading: fetchingLoading, error: fetchingError, fetchUserInfo } = useFetchUserInfo();
  const { updateUserInfo, loading: updatingLoading, error: updatingError } = useUpdateUserInfo();

  useEffect(() => {
    if (userInfo) {
      console.log('Данные пользователя:', userInfo); // Логирование данных
      form.setFieldsValue({
        ...userInfo,
        allergies: userInfo.allergies.length > 0 ? userInfo.allergies.join(', ') : 'нету',
      });
    }
  }, [userInfo, form]);

  const handleUpdateUserInfo = (values) => {
    const updatedValues = {
      ...values,
      allergies: values.allergies.split(',').map(allergy => allergy.trim()),
    };

    updateUserInfo(updatedValues, fetchUserInfo);
  };

  if (fetchingLoading) {
    return <Spin size="large" />;
  }

  if (fetchingError) {
    return <Alert message="Ошибка" description={fetchingError} type="error" showIcon />;
  }

  return (
    <Card className="form-container">
      <Flex gap="large" align="center">
        <Flex vertical flex={1}>
          <Typography.Title level={3} className="title">
            Информация о пользователе
          </Typography.Title>
          <Typography.Text type="secondary" strong className="slogan">
            Здесь вы можете обновить вашу информацию
          </Typography.Text>
          <Form
            layout="vertical"
            form={form}
            onFinish={handleUpdateUserInfo}
            autoComplete="off"
          >
            <Form.Item
              label="Полное имя"
              name="full_name"
              rules={[
                { required: true, message: 'Пожалуйста, введите ваше полное имя!' },
              ]}
            >
              <Input size="large" placeholder="Введите ваше полное имя" />
            </Form.Item>

            <Form.Item
              label="Номер телефона"
              name="phone_number"
              rules={[
                { required: true, message: 'Пожалуйста, введите ваш номер телефона!' },
              ]}
            >
              <Input size="large" placeholder="Введите ваш номер телефона" />
            </Form.Item>

            <Form.Item
              label="Возраст"
              name="age"
              rules={[
                { required: true, message: 'Пожалуйста, введите ваш возраст!' },
              ]}
            >
              <Input size="large" placeholder="Введите ваш возраст" />
            </Form.Item>

            <Form.Item
              label="Пол"
              name="gender"
              rules={[
                { required: true, message: 'Пожалуйста, укажите ваш пол!' },
              ]}
            >
              <Input size="large" placeholder="Укажите ваш пол (мужской/женский)" />
            </Form.Item>

            <Form.Item
              label="Аллергии"
              name="allergies"
            >
              <Input size="large" placeholder="Укажите ваши аллергии через запятую" />
            </Form.Item>

            {updatingError && (
              <Alert description={updatingError} type="error" showIcon closable className="alert" />
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" className="btn">
                {updatingLoading ? <Spin /> : 'Обновить информацию'}
              </Button>
            </Form.Item>
            <Form.Item>
              <Link to="/dashboard">
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

export default UserInfo;
