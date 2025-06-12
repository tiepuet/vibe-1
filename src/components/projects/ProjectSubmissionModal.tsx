import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Button, 
  message,
  Typography,
  Space,
  Card,
  Alert
} from 'antd';
import { 
  GithubOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  CrownOutlined
} from '@ant-design/icons';
import { Project } from '../../types';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';

const { Title, Text } = Typography;

interface ProjectSubmissionModalProps {
  visible: boolean;
  onCancel: () => void;
  project: Project | null;
}

const ProjectSubmissionModal: React.FC<ProjectSubmissionModalProps> = ({ 
  visible, 
  onCancel, 
  project 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { updateProject, getTeamMembers } = useDataStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (visible && project) {
      form.setFieldsValue({
        code_link: project.code_link || '',
        slide_link: project.slide_link || '',
        demo_link: project.demo_link || ''
      });
    }
  }, [visible, project, form]);

  const handleSubmit = async (values: any) => {
    if (!project) return;

    setLoading(true);
    try {
      const updateData = {
        code_link: values.code_link || null,
        slide_link: values.slide_link || null,
        demo_link: values.demo_link || null,
        submitted_at: new Date().toISOString()
      };

      await updateProject(project.id, updateData);
      
      const isAdmin = user?.role === 'admin';
      const teamMembers = getTeamMembers(project.team_id!);
      const isTeamMember = teamMembers.some(member => member.id === user?.id);
      
      if (isAdmin && !isTeamMember) {
        message.success('Admin đã nộp kết quả dự án thành công!');
      } else {
        message.success('Nộp kết quả dự án thành công!');
      }
      
      onCancel();
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const validateUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isSubmitted = !!project?.submitted_at;
  const isAdmin = user?.role === 'admin';
  const teamMembers = project ? getTeamMembers(project.team_id!) : [];
  const isTeamMember = teamMembers.some(member => member.id === user?.id);
  const isAdminSubmission = isAdmin && !isTeamMember;

  const getModalTitle = () => {
    if (isAdminSubmission) {
      return 'Nộp kết quả dự án (Admin)';
    }
    return 'Nộp kết quả dự án';
  };

  const getSubmitButtonText = () => {
    if (isAdminSubmission) {
      return isSubmitted ? 'Cập nhật (Admin)' : 'Nộp kết quả (Admin)';
    }
    return isSubmitted ? 'Cập nhật' : 'Nộp kết quả';
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isAdminSubmission 
              ? 'bg-gradient-to-r from-purple-500 to-pink-600' 
              : 'bg-gradient-to-r from-green-500 to-blue-600'
          }`}>
            {isAdminSubmission ? (
              <CrownOutlined className="text-white text-sm" />
            ) : (
              <CheckCircleOutlined className="text-white text-sm" />
            )}
          </div>
          <Title level={4} className="m-0">
            {getModalTitle()}
          </Title>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      destroyOnClose
    >
      <div className="mt-6">
        {isSubmitted && (
          <Alert
            message="Dự án đã được nộp"
            description={`Thời gian nộp: ${new Date(project!.submitted_at!).toLocaleString('vi-VN')}`}
            type="success"
            showIcon
            className="mb-6"
          />
        )}

        {isAdminSubmission && (
          <Alert
            message="Nộp bài với quyền Admin"
            description="Bạn đang nộp kết quả cho dự án này với tư cách là Admin. Hành động này sẽ được ghi nhận trong hệ thống."
            type="info"
            showIcon
            icon={<CrownOutlined />}
            className="mb-6 bg-purple-50 border-purple-200"
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
        >
          <Space direction="vertical" size="large" className="w-full">
            {/* Source Code Section */}
            <Card className="border-l-4 border-l-blue-500">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GithubOutlined className="text-blue-600 text-xl" />
                </div>
                <div className="flex-1">
                  <Title level={5} className="mb-2">Mã nguồn</Title>
                  <Text className="text-gray-600 block mb-3">
                    Link repository chứa mã nguồn của dự án (GitHub, GitLab, Bitbucket...)
                  </Text>
                  <Form.Item
                    name="code_link"
                    rules={[
                      {
                        validator: (_, value) => {
                          if (value && !validateUrl(value)) {
                            return Promise.reject('URL không hợp lệ!');
                          }
                          return Promise.resolve();
                        }
                      }
                    ]}
                  >
                    <Input
                      placeholder="https://github.com/username/project-name"
                      prefix={<LinkOutlined className="text-gray-400" />}
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>
              </div>
            </Card>

            {/* Slide Section */}
            <Card className="border-l-4 border-l-orange-500">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileTextOutlined className="text-orange-600 text-xl" />
                </div>
                <div className="flex-1">
                  <Title level={5} className="mb-2">Slide thuyết trình</Title>
                  <Text className="text-gray-600 block mb-3">
                    Link slide thuyết trình (Google Slides, PowerPoint Online, PDF...)
                  </Text>
                  <Form.Item
                    name="slide_link"
                    rules={[
                      {
                        validator: (_, value) => {
                          if (value && !validateUrl(value)) {
                            return Promise.reject('URL không hợp lệ!');
                          }
                          return Promise.resolve();
                        }
                      }
                    ]}
                  >
                    <Input
                      placeholder="https://docs.google.com/presentation/d/..."
                      prefix={<LinkOutlined className="text-gray-400" />}
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>
              </div>
            </Card>

            {/* Demo Section */}
            <Card className="border-l-4 border-l-green-500">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <PlayCircleOutlined className="text-green-600 text-xl" />
                </div>
                <div className="flex-1">
                  <Title level={5} className="mb-2">Demo sản phẩm</Title>
                  <Text className="text-gray-600 block mb-3">
                    Link demo trực tiếp hoặc video demo sản phẩm
                  </Text>
                  <Form.Item
                    name="demo_link"
                    rules={[
                      {
                        validator: (_, value) => {
                          if (value && !validateUrl(value)) {
                            return Promise.reject('URL không hợp lệ!');
                          }
                          return Promise.resolve();
                        }
                      }
                    ]}
                  >
                    <Input
                      placeholder="https://your-demo.vercel.app hoặc https://youtube.com/watch?v=..."
                      prefix={<LinkOutlined className="text-gray-400" />}
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>
              </div>
            </Card>
          </Space>

          <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
            <Button 
              onClick={onCancel}
              size="large"
              className="rounded-lg"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className={`border-0 rounded-lg px-8 ${
                isAdminSubmission 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600' 
                  : 'bg-gradient-to-r from-green-500 to-blue-600'
              }`}
            >
              {getSubmitButtonText()}
            </Button>
          </div>
        </Form>

        <div className={`mt-6 p-4 rounded-lg ${
          isAdminSubmission ? 'bg-purple-50' : 'bg-blue-50'
        }`}>
          <Title level={5} className={`mb-2 ${
            isAdminSubmission ? 'text-purple-800' : 'text-blue-800'
          }`}>
            Lưu ý quan trọng:
          </Title>
          <ul className={`text-sm space-y-1 mb-0 ${
            isAdminSubmission ? 'text-purple-700' : 'text-blue-700'
          }`}>
            <li>• Đảm bảo tất cả các link đều có thể truy cập công khai</li>
            <li>• Mã nguồn nên có README.md với hướng dẫn cài đặt và chạy</li>
            <li>• Slide thuyết trình nên có quyền xem công khai</li>
            <li>• Demo sản phẩm nên hoạt động ổn định</li>
            <li>• Bạn có thể cập nhật lại sau khi đã nộp</li>
            {isAdminSubmission && (
              <li>• <strong>Admin:</strong> Hành động này sẽ được ghi nhận với quyền quản trị</li>
            )}
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default ProjectSubmissionModal;