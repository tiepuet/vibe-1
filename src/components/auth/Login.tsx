import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider, Spin } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Lightbulb } from 'lucide-react';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, loginWithGoogle, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const result = await login(values.email, values.password);
      if (result.success) {
        message.success('Đăng nhập thành công!');
        navigate('/dashboard');
      } else {
        message.error(result.error || 'Đăng nhập thất bại!');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        message.error(result.error || 'Đăng nhập với Google thất bại!');
      }
      // Note: For OAuth, the redirect happens automatically
    } catch (error) {
      message.error('Có lỗi xảy ra khi đăng nhập với Google!');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <Title level={2} className="text-gray-800 mb-2">Teko Innovation</Title>
          <Text className="text-gray-600">Khơi nguồn sáng tạo - Kiến tạo tương lai</Text>
        </div>

        <Card className="shadow-xl border-0 rounded-2xl">
          <div className="p-6">
            <Title level={3} className="text-center text-gray-800 mb-6">Đăng nhập</Title>
            
            <Form
              name="login"
              onFinish={onFinish}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Email"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Mật khẩu"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 border-0 text-white font-medium"
                  loading={loading}
                  disabled={googleLoading}
                >
                  {loading ? <Spin size="small" /> : 'Đăng nhập'}
                </Button>
              </Form.Item>
            </Form>

            <Divider>hoặc</Divider>

            <Button
              icon={<GoogleOutlined />}
              className="w-full h-12 rounded-lg border-gray-300 text-gray-700 font-medium mb-4 hover:border-blue-400 hover:text-blue-600 transition-colors"
              size="large"
              loading={googleLoading}
              disabled={loading}
              onClick={handleGoogleLogin}
            >
              {googleLoading ? 'Đang chuyển hướng...' : 'Đăng nhập với Google'}
            </Button>

            <div className="text-center">
              <Text className="text-gray-600">
                Chưa có tài khoản? <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">Đăng ký ngay</Link>
              </Text>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <Text className="text-sm text-blue-800">
                <strong>Hướng dẫn:</strong><br />
                1. Đăng ký tài khoản mới hoặc đăng nhập với Google<br />
                2. Sử dụng email và mật khẩu để đăng nhập<br />
                3. Liên hệ admin để được cấp quyền quản trị
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;