import React from 'react';
import { Card, Row, Col, Statistic, Typography, Table, Tag, Progress } from 'antd';
import { 
  CalendarOutlined, 
  TeamOutlined, 
  BulbOutlined, 
  ProjectOutlined,
  TrophyOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { events, teams, ideas, projects } = useDataStore();
  const { user } = useAuthStore();

  const openEvents = events.filter(e => e.status === 'open').length;
  const approvedTeams = teams.filter(t => t.status === 'approved').length;
  const approvedIdeas = ideas.filter(i => i.status === 'approved').length;
  const submittedProjects = projects.filter(p => p.submitted_at).length;

  const recentEvents = events.slice(0, 5).map(event => ({
    key: event.id,
    name: event.name,
    status: event.status,
    start_time: new Date(event.start_time).toLocaleDateString('vi-VN'),
    teams: teams.filter(t => t.event_id === event.id).length,
    ideas: ideas.filter(i => i.event_id === event.id).length
  }));

  const eventColumns = [
    {
      title: 'Tên sự kiện',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          draft: { color: 'orange', text: 'Nháp' },
          open: { color: 'green', text: 'Mở' },
          closed: { color: 'red', text: 'Đóng' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_time',
      key: 'start_time'
    },
    {
      title: 'Teams',
      dataIndex: 'teams',
      key: 'teams',
      render: (count: number) => <Text>{count} teams</Text>
    },
    {
      title: 'Ideas',
      dataIndex: 'ideas',
      key: 'ideas',
      render: (count: number) => <Text>{count} ideas</Text>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="mb-2">Dashboard</Title>
          <Text className="text-gray-600">Chào mừng trở lại, {user?.full_name}!</Text>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Sự kiện đang mở"
              value={openEvents}
              prefix={<CalendarOutlined className="text-blue-500" />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Teams đã duyệt"
              value={approvedTeams}
              prefix={<TeamOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Ideas đã duyệt"
              value={approvedIdeas}
              prefix={<BulbOutlined className="text-orange-500" />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Projects đã nộp"
              value={submittedProjects}
              prefix={<ProjectOutlined className="text-purple-500" />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <div className="flex items-center space-x-2">
                <CalendarOutlined className="text-blue-500" />
                <span>Sự kiện gần đây</span>
              </div>
            }
            className="h-full"
          >
            <Table
              dataSource={recentEvents}
              columns={eventColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <div className="space-y-4">
            <Card 
              title={
                <div className="flex items-center space-x-2">
                  <TrophyOutlined className="text-yellow-500" />
                  <span>Tiến độ tổng quan</span>
                </div>
              }
            >
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <Text className="text-sm">Events hoàn thành</Text>
                    <Text className="text-sm">{Math.round((events.filter(e => e.status === 'closed').length / events.length) * 100)}%</Text>
                  </div>
                  <Progress 
                    percent={Math.round((events.filter(e => e.status === 'closed').length / events.length) * 100)} 
                    strokeColor="#52c41a"
                    size="small"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <Text className="text-sm">Projects hoàn thành</Text>
                    <Text className="text-sm">{Math.round((submittedProjects / projects.length) * 100)}%</Text>
                  </div>
                  <Progress 
                    percent={Math.round((submittedProjects / projects.length) * 100)} 
                    strokeColor="#1890ff"
                    size="small"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <Text className="text-sm">Ideas được duyệt</Text>
                    <Text className="text-sm">{Math.round((approvedIdeas / ideas.length) * 100)}%</Text>
                  </div>
                  <Progress 
                    percent={Math.round((approvedIdeas / ideas.length) * 100)} 
                    strokeColor="#fa8c16"
                    size="small"
                  />
                </div>
              </div>
            </Card>

            <Card 
              title={
                <div className="flex items-center space-x-2">
                  <ClockCircleOutlined className="text-red-500" />
                  <span>Sắp diễn ra</span>
                </div>
              }
            >
              <div className="space-y-3">
                {events.filter(e => e.status === 'open').slice(0, 3).map(event => (
                  <div key={event.id} className="p-3 bg-blue-50 rounded-lg">
                    <Text strong className="block">{event.name}</Text>
                    <Text className="text-sm text-gray-600">
                      {new Date(event.start_time).toLocaleDateString('vi-VN')}
                    </Text>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;