import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider, Spin } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Lightbulb } from 'lucide-react';

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, loginWithGoogle, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values: { fullName: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const result = await register(values.fullName, values.email, values.password);
      if (result.success) {
        if (result.error) {
          // This means email confirmation is required
          message.info(result.error);
        } else {
          message.success('Đăng ký thành công!');
          navigate('/dashboard');
        }
      } else {
        message.error(result.error || 'Đăng ký thất bại!');
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
        message.error(result.error || 'Đăng ký với Google thất bại!');
      }
      // Note: For OAuth, the redirect happens automatically
    } catch (error) {
      message.error('Có lỗi xảy ra khi đăng ký với Google!');
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
            <Title level={3} className="text-center text-gray-800 mb-6">Đăng ký</Title>
            
            <Form
              name="register"
              onFinish={onFinish}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                name="fullName"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ tên!' },
                  { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Họ và tên"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Email"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Mật khẩu"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Xác nhận mật khẩu"
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
                  {loading ? <Spin size="small" /> : 'Đăng ký'}
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
              {googleLoading ? 'Đang chuyển hướng...' : 'Đăng ký với Google'}
            </Button>

            <div className="text-center">
              <Text className="text-gray-600">
                Đã có tài khoản? <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">Đăng nhập ngay</Link>
              </Text>
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <Text className="text-sm text-green-800">
                <strong>Lưu ý:</strong><br />
                • Tài khoản mới sẽ có quyền User<br />
                • Liên hệ admin để được cấp quyền quản trị<br />
                • Email xác nhận có thể được yêu cầu
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;