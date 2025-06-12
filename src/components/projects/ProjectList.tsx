import React from 'react';
import { Card, Table, Tag, Button, Typography, Space, Avatar, Tooltip } from 'antd';
import { 
  ProjectOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CrownOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import { mockUsers } from '../../data/mockData';

const { Title, Text } = Typography;

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const { projects, teams, ideas, events, getTeamMembers } = useDataStore();
  const { user } = useAuthStore();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const projectsWithDetails = projects.map(project => {
    const team = teams.find(t => t.id === project.team_id);
    const idea = ideas.find(i => i.id === project.idea_id);
    const event = events.find(e => e.id === project.event_id);
    const teamMembers = getTeamMembers(project.team_id!);
    const isTeamMember = teamMembers.some(member => member.id === user?.id);
    const isAdmin = user?.role === 'admin';
    const canAccess = isTeamMember || isAdmin;
    
    return {
      ...project,
      teamName: team?.name,
      ideaTitle: idea?.title,
      eventName: event?.name,
      teamMembers,
      canAccess,
      isTeamMember,
      isAdmin
    };
  });

  const columns = [
    {
      title: 'Team',
      dataIndex: 'teamName',
      key: 'teamName',
      render: (text: string, record: any) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Text strong>{text || 'Unknown Team'}</Text>
            {record.isTeamMember && (
              <Tag color="blue" size="small">Thành viên</Tag>
            )}
            {record.isAdmin && !record.isTeamMember && (
              <Tag color="purple" size="small" icon={<CrownOutlined />}>Admin</Tag>
            )}
          </div>
          <div>
            <Avatar.Group maxCount={3} size="small" maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
              {record.teamMembers?.map((member: any) => (
                <Tooltip key={member.id} title={member.full_name}>
                  <Avatar icon={<UserOutlined />} />
                </Tooltip>
              ))}
            </Avatar.Group>
          </div>
        </div>
      )
    },
    {
      title: 'Sự kiện',
      dataIndex: 'eventName',
      key: 'eventName',
      render: (text: string) => <Text className="text-blue-600">{text || 'Unknown Event'}</Text>
    },
    {
      title: 'Ý tưởng',
      dataIndex: 'ideaTitle',
      key: 'ideaTitle',
      render: (text: string) => (
        <Text className="text-gray-700" ellipsis={{ tooltip: text }}>
          {text || 'Unknown Idea'}
        </Text>
      )
    },
    {
      title: 'Thời gian trình bày',
      dataIndex: 'scheduled_time',
      key: 'scheduled_time',
      render: (time: string) => (
        <Text className="text-sm">{formatDate(time)}</Text>
      )
    },
    {
      title: 'Trạng thái nộp',
      dataIndex: 'submitted_at',
      key: 'submitted_at',
      render: (submitted: string | null) => {
        if (submitted) {
          return (
            <div className="space-y-1">
              <Tag color="green" icon={<CheckCircleOutlined />}>Đã nộp</Tag>
              <div className="text-xs text-gray-500">
                {formatDate(submitted)}
              </div>
            </div>
          );
        }
        return <Tag color="orange" icon={<ClockCircleOutlined />}>Chưa nộp</Tag>;
      }
    },
    {
      title: 'Link nộp bài',
      key: 'submission',
      render: (_, record: any) => {
        const hasCode = !!record.code_link;
        const hasSlide = !!record.slide_link;
        const hasDemo = !!record.demo_link;
        const completedCount = [hasCode, hasSlide, hasDemo].filter(Boolean).length;
        
        return (
          <div className="space-y-1">
            <div className="text-sm">
              <Text className={completedCount === 3 ? 'text-green-600' : 'text-orange-600'}>
                {completedCount}/3 hoàn thành
              </Text>
            </div>
            <div className="flex space-x-1">
              <Tag color={hasCode ? 'green' : 'default'} className="text-xs">Code</Tag>
              <Tag color={hasSlide ? 'green' : 'default'} className="text-xs">Slide</Tag>
              <Tag color={hasDemo ? 'green' : 'default'} className="text-xs">Demo</Tag>
            </div>
          </div>
        );
      }
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button 
          type="primary"
          icon={<EyeOutlined />} 
          onClick={() => navigate(`/projects/${record.id}`)}
          size="small"
          disabled={!record.canAccess}
        >
          Chi tiết
        </Button>
      )
    }
  ];

  // Filter projects based on user role and team membership
  const filteredProjects = user?.role === 'admin' 
    ? projectsWithDetails 
    : projectsWithDetails.filter(project => project.isTeamMember);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="mb-2">Projects</Title>
          <Text className="text-gray-600">
            {user?.role === 'admin' 
              ? 'Quản lý và theo dõi tất cả các dự án trong hệ thống'
              : 'Quản lý và theo dõi các dự án mà bạn tham gia'
            }
          </Text>
        </div>
      </div>

      <Card 
        title={
          <Space>
            <ProjectOutlined className="text-blue-500" />
            <span>
              Danh sách Projects ({filteredProjects.length})
              {user?.role === 'admin' && (
                <Tag color="purple" className="ml-2" icon={<CrownOutlined />}>
                  Admin View
                </Tag>
              )}
            </span>
          </Space>
        }
      >
        <Table
          dataSource={filteredProjects}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} projects`
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <ProjectOutlined style={{ fontSize: '64px' }} />
          </div>
          <Title level={3} className="text-gray-500">
            {user?.role === 'admin' 
              ? 'Chưa có dự án nào trong hệ thống'
              : 'Bạn chưa tham gia dự án nào'
            }
          </Title>
          <Text className="text-gray-400">
            {user?.role === 'admin' 
              ? 'Các dự án sẽ được tạo khi ghép team với ý tưởng'
              : 'Hãy tham gia một team để có thể làm việc trên dự án'
            }
          </Text>
        </div>
      )}
    </div>
  );
};

export default ProjectList;