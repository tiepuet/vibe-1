import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Tag, 
  Button, 
  Space, 
  Breadcrumb,
  Row,
  Col,
  Descriptions,
  Avatar,
  Tooltip,
  Divider,
  Empty,
  Alert
} from 'antd';
import { 
  ArrowLeftOutlined,
  CalendarOutlined,
  TeamOutlined,
  BulbOutlined,
  GithubOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EditOutlined,
  UploadOutlined,
  CrownOutlined
} from '@ant-design/icons';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import { mockUsers } from '../../data/mockData';
import ProjectSubmissionModal from './ProjectSubmissionModal';

const { Title, Text, Paragraph } = Typography;

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submissionModalVisible, setSubmissionModalVisible] = useState(false);
  
  const { 
    getProjectById, 
    getEventById, 
    teams, 
    ideas,
    getTeamMembers
  } = useDataStore();
  
  const { user } = useAuthStore();

  const project = getProjectById(id!);
  
  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Empty description="Không tìm thấy dự án" />
      </div>
    );
  }

  const event = getEventById(project.event_id!);
  const team = teams.find(t => t.id === project.team_id);
  const idea = ideas.find(i => i.id === project.idea_id);
  const teamMembers = getTeamMembers(project.team_id!);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isSubmitted = !!project.submitted_at;
  const isTeamMember = teamMembers.some(member => member.id === user?.id);
  const isAdmin = user?.role === 'admin';
  const canSubmit = (isTeamMember || isAdmin) && event?.status === 'open';

  const handleSubmissionModal = () => {
    setSubmissionModalVisible(true);
  };

  const getSubmissionButtonText = () => {
    if (isAdmin && !isTeamMember) {
      return isSubmitted ? 'Cập nhật kết quả (Admin)' : 'Nộp kết quả (Admin)';
    }
    return isSubmitted ? 'Cập nhật kết quả' : 'Nộp kết quả';
  };

  const getSubmissionButtonIcon = () => {
    if (isAdmin && !isTeamMember) {
      return isSubmitted ? <EditOutlined /> : <CrownOutlined />;
    }
    return isSubmitted ? <EditOutlined /> : <UploadOutlined />;
  };

  return (
    <div className="space-y-6">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/projects')}
            className="p-0"
          >
            Projects
          </Button>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{team?.name || 'Unknown Team'}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Project Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Title level={2} className="m-0">Dự án của team {team?.name}</Title>
              <Tag 
                color={isSubmitted ? 'green' : 'orange'} 
                icon={isSubmitted ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                className="px-3 py-1"
              >
                {isSubmitted ? 'Đã nộp' : 'Chưa nộp'}
              </Tag>
            </div>
            {canSubmit && (
              <Button
                type="primary"
                icon={getSubmissionButtonIcon()}
                onClick={handleSubmissionModal}
                size="large"
                className={`border-0 rounded-lg ${
                  isAdmin && !isTeamMember 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600' 
                    : 'bg-gradient-to-r from-green-500 to-blue-600'
                }`}
              >
                {getSubmissionButtonText()}
              </Button>
            )}
          </div>

          {/* Admin Notice */}
          {isAdmin && !isTeamMember && (
            <Alert
              message="Quyền Admin"
              description="Bạn có thể nộp/cập nhật kết quả cho dự án này với tư cách là Admin"
              type="info"
              showIcon
              icon={<CrownOutlined />}
              className="bg-purple-50 border-purple-200"
            />
          )}

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Space direction="vertical" size="small" className="w-full">
                <div className="flex items-center space-x-2">
                  <CalendarOutlined className="text-blue-500" />
                  <Text strong>Sự kiện:</Text>
                  <Text>{event?.name || 'Unknown Event'}</Text>
                </div>
                <div className="flex items-center space-x-2">
                  <BulbOutlined className="text-orange-500" />
                  <Text strong>Ý tưởng:</Text>
                  <Text>{idea?.title || 'Unknown Idea'}</Text>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarOutlined className="text-green-500" />
                  <Text strong>Thời gian trình bày:</Text>
                  <Text>{formatDate(project.scheduled_time)}</Text>
                </div>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <TeamOutlined className="text-purple-500" />
                  <Text strong>Thành viên team:</Text>
                </div>
                <Avatar.Group maxCount={4} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                  {teamMembers.map(member => (
                    <Tooltip key={member.id} title={member.full_name}>
                      <Avatar 
                        icon={<UserOutlined />} 
                        className="border-2 border-white"
                      />
                    </Tooltip>
                  ))}
                </Avatar.Group>
              </div>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Idea Details */}
      {idea && (
        <Card title={
          <Space>
            <BulbOutlined className="text-orange-500" />
            <span>Chi tiết ý tưởng</span>
          </Space>
        }>
          <div className="space-y-4">
            <div>
              <Title level={4}>{idea.title}</Title>
              <Paragraph className="text-gray-600">
                {idea.description || 'Không có mô tả'}
              </Paragraph>
            </div>
            <div className="flex items-center space-x-4">
              <Text strong>Người tạo:</Text>
              <div className="flex items-center space-x-2">
                <Avatar icon={<UserOutlined />} size="small" />
                <Text>{mockUsers.find(u => u.id === idea.user_id)?.full_name || 'Unknown'}</Text>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Text strong>Trạng thái:</Text>
              <Tag color={idea.status === 'approved' ? 'green' : idea.status === 'rejected' ? 'red' : 'blue'}>
                {idea.status === 'approved' ? 'Đã duyệt' : idea.status === 'rejected' ? 'Đã từ chối' : 'Chờ duyệt'}
              </Tag>
            </div>
          </div>
        </Card>
      )}

      {/* Submission Status */}
      <Card title="Trạng thái nộp bài">
        {isSubmitted ? (
          <Alert
            message="Dự án đã được nộp thành công"
            description={`Thời gian nộp: ${formatDate(project.submitted_at!)}`}
            type="success"
            showIcon
            className="mb-6"
          />
        ) : (
          <Alert
            message="Dự án chưa được nộp"
            description="Hãy hoàn thành các yêu cầu dưới đây và nộp dự án trước thời hạn"
            type="warning"
            showIcon
            className="mb-6"
          />
        )}

        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card 
              className={`text-center h-full ${project.code_link ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}
              bodyStyle={{ padding: '24px 16px' }}
            >
              <GithubOutlined 
                className={`text-4xl mb-3 ${project.code_link ? 'text-green-500' : 'text-gray-400'}`} 
              />
              <Title level={5} className="mb-2">Mã nguồn</Title>
              {project.code_link ? (
                <div className="space-y-2">
                  <CheckCircleOutlined className="text-green-500" />
                  <Text className="block text-green-600">Đã nộp</Text>
                  <Button 
                    type="link" 
                    href={project.code_link} 
                    target="_blank"
                    className="p-0"
                  >
                    Xem mã nguồn
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <ClockCircleOutlined className="text-orange-500" />
                  <Text className="block text-orange-600">Chưa nộp</Text>
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card 
              className={`text-center h-full ${project.slide_link ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}
              bodyStyle={{ padding: '24px 16px' }}
            >
              <FileTextOutlined 
                className={`text-4xl mb-3 ${project.slide_link ? 'text-green-500' : 'text-gray-400'}`} 
              />
              <Title level={5} className="mb-2">Slide thuyết trình</Title>
              {project.slide_link ? (
                <div className="space-y-2">
                  <CheckCircleOutlined className="text-green-500" />
                  <Text className="block text-green-600">Đã nộp</Text>
                  <Button 
                    type="link" 
                    href={project.slide_link} 
                    target="_blank"
                    className="p-0"
                  >
                    Xem slide
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <ClockCircleOutlined className="text-orange-500" />
                  <Text className="block text-orange-600">Chưa nộp</Text>
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card 
              className={`text-center h-full ${project.demo_link ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}
              bodyStyle={{ padding: '24px 16px' }}
            >
              <PlayCircleOutlined 
                className={`text-4xl mb-3 ${project.demo_link ? 'text-green-500' : 'text-gray-400'}`} 
              />
              <Title level={5} className="mb-2">Demo sản phẩm</Title>
              {project.demo_link ? (
                <div className="space-y-2">
                  <CheckCircleOutlined className="text-green-500" />
                  <Text className="block text-green-600">Đã nộp</Text>
                  <Button 
                    type="link" 
                    href={project.demo_link} 
                    target="_blank"
                    className="p-0"
                  >
                    Xem demo
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <ClockCircleOutlined className="text-orange-500" />
                  <Text className="block text-orange-600">Chưa nộp</Text>
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {canSubmit && !isSubmitted && (
          <div className="mt-6 text-center">
            <Button
              type="primary"
              size="large"
              icon={getSubmissionButtonIcon()}
              onClick={handleSubmissionModal}
              className={`border-0 rounded-lg px-8 ${
                isAdmin && !isTeamMember 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600' 
                  : 'bg-gradient-to-r from-green-500 to-blue-600'
              }`}
            >
              {getSubmissionButtonText()}
            </Button>
          </div>
        )}
      </Card>

      {/* Team Information */}
      <Card title={
        <Space>
          <TeamOutlined className="text-purple-500" />
          <span>Thông tin team</span>
        </Space>
      }>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Tên team">{team?.name || 'Unknown'}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={team?.status === 'approved' ? 'green' : team?.status === 'rejected' ? 'red' : 'blue'}>
              {team?.status === 'approved' ? 'Đã duyệt' : team?.status === 'rejected' ? 'Đã từ chối' : 'Chờ duyệt'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Số thành viên">{teamMembers.length} người</Descriptions.Item>
          <Descriptions.Item label="Thành viên">
            <div className="space-y-2">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center space-x-2">
                  <Avatar icon={<UserOutlined />} size="small" />
                  <Text>{member.full_name}</Text>
                  <Text className="text-gray-500">({member.email})</Text>
                </div>
              ))}
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <ProjectSubmissionModal
        visible={submissionModalVisible}
        onCancel={() => setSubmissionModalVisible(false)}
        project={project}
      />
    </div>
  );
};

export default ProjectDetail;