import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Tag, 
  Tabs, 
  Table, 
  Button, 
  Space, 
  Image,
  Breadcrumb,
  Statistic,
  Row,
  Col,
  Progress,
  Avatar,
  Tooltip
} from 'antd';
import { 
  ArrowLeftOutlined,
  CalendarOutlined,
  TeamOutlined,
  BulbOutlined,
  ProjectOutlined,
  TrophyOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useDataStore } from '../../store/dataStore';
import { mockUsers } from '../../data/mockData';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { 
    getEventById, 
    getTeamsByEvent, 
    getIdeasByEvent, 
    getCriteriaByEvent,
    getProjectsByEvent,
    getTeamMembers
  } = useDataStore();

  const event = getEventById(id!);
  const teams = getTeamsByEvent(id!);
  const ideas = getIdeasByEvent(id!);
  const criteria = getCriteriaByEvent(id!);
  const projects = getProjectsByEvent(id!);

  if (!event) {
    return <div>Event not found</div>;
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      draft: { color: 'orange', text: 'Nháp' },
      open: { color: 'green', text: 'Đang mở' },
      closed: { color: 'red', text: 'Đã đóng' },
      pending: { color: 'blue', text: 'Chờ duyệt' },
      approved: { color: 'green', text: 'Đã duyệt' },
      rejected: { color: 'red', text: 'Đã từ chối' }
    };
    return configs[status as keyof typeof configs];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Teams table columns
  const teamColumns = [
    {
      title: 'Tên team',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Thành viên',
      dataIndex: 'id',
      key: 'members',
      render: (teamId: string) => {
        const members = getTeamMembers(teamId);
        return (
          <Avatar.Group maxCount={3} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
            {members.map(member => (
              <Tooltip key={member.id} title={member.full_name}>
                <Avatar icon={<UserOutlined />} />
              </Tooltip>
            ))}
          </Avatar.Group>
        );
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => formatDate(date)
    }
  ];

  // Ideas table columns
  const ideaColumns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Người tạo',
      dataIndex: 'user_id',
      key: 'user_id',
      render: (userId: string) => {
        const user = mockUsers.find(u => u.id === userId);
        return user?.full_name || 'Unknown';
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => formatDate(date)
    }
  ];

  // Projects table columns
  const projectColumns = [
    {
      title: 'Team',
      dataIndex: 'team_id',
      key: 'team_id',
      render: (teamId: string) => {
        const team = teams.find(t => t.id === teamId);
        return team?.name || 'Unknown';
      }
    },
    {
      title: 'Idea',
      dataIndex: 'idea_id',
      key: 'idea_id',
      render: (ideaId: string) => {
        const idea = ideas.find(i => i.id === ideaId);
        return idea?.title || 'Unknown';
      }
    },
    {
      title: 'Thời gian trình bày',
      dataIndex: 'scheduled_time',
      key: 'scheduled_time',
      render: (time: string) => formatDate(time)
    },
    {
      title: 'Trạng thái nộp bài',
      dataIndex: 'submitted_at',
      key: 'submitted_at',
      render: (submitted: string | null) => {
        if (submitted) {
          return <Tag color="green" icon={<CheckCircleOutlined />}>Đã nộp</Tag>;
        }
        return <Tag color="orange" icon={<ClockCircleOutlined />}>Chưa nộp</Tag>;
      }
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/projects/${record.id}`)}
        >
          Xem chi tiết
        </Button>
      )
    }
  ];

  // Criteria table columns
  const criteriaColumns = [
    {
      title: 'Tên tiêu chí',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Trọng số',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight: number) => `x${weight}`
    },
    {
      title: 'Điểm tối đa',
      dataIndex: 'max_score',
      key: 'max_score',
      render: (score: number) => `${score} điểm`
    }
  ];

  const approvedTeams = teams.filter(t => t.status === 'approved').length;
  const approvedIdeas = ideas.filter(i => i.status === 'approved').length;
  const submittedProjects = projects.filter(p => p.submitted_at).length;

  return (
    <div className="space-y-6">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/events')}
            className="p-0"
          >
            Sự kiện
          </Button>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{event.name}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Event Header */}
      <Card className="overflow-hidden">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={8}>
            <Image
              src={event.image_url || 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg'}
              alt={event.name}
              className="rounded-lg object-cover"
              height={200}
            />
          </Col>
          <Col xs={24} md={16}>
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Title level={2} className="m-0">{event.name}</Title>
                  <Tag color={getStatusConfig(event.status).color} className="px-3 py-1">
                    {getStatusConfig(event.status).text}
                  </Tag>
                </div>
                {event.slogan && (
                  <Text className="text-lg text-blue-600 font-medium italic">{event.slogan}</Text>
                )}
              </div>

              <Text className="text-gray-600 block">{event.description}</Text>

              <div className="flex items-center space-x-2 text-gray-600">
                <CalendarOutlined />
                <Text>
                  {formatDate(event.start_time)} - {formatDate(event.end_time)}
                </Text>
              </div>

              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Statistic
                    title="Teams"
                    value={approvedTeams}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Ideas"
                    value={approvedIdeas}
                    prefix={<BulbOutlined />}
                    valueStyle={{ color: '#fa8c16' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Projects"
                    value={projects.length}
                    prefix={<ProjectOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Đã nộp"
                    value={submittedProjects}
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Progress Overview */}
      <Card title="Tiến độ tổng quan">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <div className="text-center">
              <div className="mb-2">
                <Text className="text-sm text-gray-600">Teams được duyệt</Text>
              </div>
              <Progress
                type="circle"
                percent={Math.round((approvedTeams / teams.length) * 100) || 0}
                strokeColor="#52c41a"
                size={100}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="text-center">
              <div className="mb-2">
                <Text className="text-sm text-gray-600">Ideas được duyệt</Text>
              </div>
              <Progress
                type="circle"
                percent={Math.round((approvedIdeas / ideas.length) * 100) || 0}
                strokeColor="#fa8c16"
                size={100}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="text-center">
              <div className="mb-2">
                <Text className="text-sm text-gray-600">Projects hoàn thành</Text>
              </div>
              <Progress
                type="circle"
                percent={Math.round((submittedProjects / projects.length) * 100) || 0}
                strokeColor="#1890ff"
                size={100}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="text-center">
              <div className="mb-2">
                <Text className="text-sm text-gray-600">Tổng tiến độ</Text>
              </div>
              <Progress
                type="circle"
                percent={Math.round(((approvedTeams + approvedIdeas + submittedProjects) / (teams.length + ideas.length + projects.length)) * 100) || 0}
                strokeColor="#722ed1"
                size={100}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Detailed Tabs */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
          <TabPane 
            tab={
              <Space>
                <TeamOutlined />
                Teams ({teams.length})
              </Space>
            } 
            key="teams"
          >
            <Table
              dataSource={teams}
              columns={teamColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane 
            tab={
              <Space>
                <BulbOutlined />
                Ideas ({ideas.length})
              </Space>
            } 
            key="ideas"
          >
            <Table
              dataSource={ideas}
              columns={ideaColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane 
            tab={
              <Space>
                <ProjectOutlined />
                Projects ({projects.length})
              </Space>
            } 
            key="projects"
          >
            <Table
              dataSource={projects}
              columns={projectColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane 
            tab={
              <Space>
                <TrophyOutlined />
                Tiêu chí chấm điểm ({criteria.length})
              </Space>
            } 
            key="criteria"
          >
            <Table
              dataSource={criteria}
              columns={criteriaColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default EventDetail;