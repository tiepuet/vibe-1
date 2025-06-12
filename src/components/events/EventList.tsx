import React, { useState } from 'react';
import { Card, Row, Col, Tag, Button, Typography, Image, Space, Dropdown } from 'antd';
import { 
  CalendarOutlined, 
  TeamOutlined, 
  BulbOutlined,
  EyeOutlined,
  PlusOutlined,
  EditOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import EventModal from './EventModal';
import { Event } from '../../types';

const { Title, Text, Paragraph } = Typography;

const EventList: React.FC = () => {
  const navigate = useNavigate();
  const { events, teams, ideas } = useDataStore();
  const { user } = useAuthStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const getStatusConfig = (status: string) => {
    const configs = {
      draft: { color: 'orange', text: 'Nháp' },
      open: { color: 'green', text: 'Đang mở' },
      closed: { color: 'red', text: 'Đã đóng' }
    };
    return configs[status as keyof typeof configs];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCreateEvent = () => {
    setModalMode('create');
    setSelectedEvent(null);
    setModalVisible(true);
  };

  const handleEditEvent = (event: Event) => {
    setModalMode('edit');
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  const getEventActions = (event: Event) => {
    const items = [
      {
        key: 'view',
        label: 'Xem chi tiết',
        icon: <EyeOutlined />,
        onClick: () => navigate(`/events/${event.id}`)
      }
    ];

    if (user?.role === 'admin') {
      items.push({
        key: 'edit',
        label: 'Chỉnh sửa',
        icon: <EditOutlined />,
        onClick: () => handleEditEvent(event)
      });
    }

    return items;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="mb-2">Sự kiện</Title>
          <Text className="text-gray-600">Quản lý và theo dõi các sự kiện sáng tạo</Text>
        </div>
        {user?.role === 'admin' && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            size="large"
            className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 rounded-lg px-6"
            onClick={handleCreateEvent}
          >
            Tạo sự kiện mới
          </Button>
        )}
      </div>

      <Row gutter={[24, 24]}>
        {events.map(event => {
          const eventTeams = teams.filter(t => t.event_id === event.id);
          const eventIdeas = ideas.filter(i => i.event_id === event.id);
          const statusConfig = getStatusConfig(event.status);

          return (
            <Col xs={24} lg={12} xl={8} key={event.id}>
              <Card
                className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                cover={
                  <div className="relative">
                    <Image
                      alt={event.name}
                      src={event.image_url || 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg'}
                      height={200}
                      className="object-cover"
                      preview={false}
                    />
                    <div className="absolute top-4 right-4">
                      <Tag color={statusConfig.color} className="px-3 py-1 text-sm font-medium">
                        {statusConfig.text}
                      </Tag>
                    </div>
                    {user?.role === 'admin' && (
                      <div className="absolute top-4 left-4">
                        <Dropdown
                          menu={{ items: getEventActions(event) }}
                          placement="bottomLeft"
                          trigger={['click']}
                        >
                          <Button
                            type="text"
                            icon={<MoreOutlined />}
                            className="bg-white/80 backdrop-blur-sm hover:bg-white/90 border-0 shadow-sm"
                            size="small"
                          />
                        </Dropdown>
                      </div>
                    )}
                  </div>
                }
                actions={[
                  <Button 
                    type="text" 
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Xem chi tiết
                  </Button>
                ]}
              >
                <div className="space-y-3">
                  <div>
                    <Title level={4} className="mb-2 line-clamp-2">{event.name}</Title>
                    {event.slogan && (
                      <Text className="text-blue-600 font-medium italic block mb-2">{event.slogan}</Text>
                    )}
                  </div>

                  <Paragraph 
                    ellipsis={{ rows: 2 }} 
                    className="text-gray-600 min-h-[48px]"
                  >
                    {event.description}
                  </Paragraph>

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <CalendarOutlined className="mr-2" />
                      <Text className="text-sm">
                        {formatDate(event.start_time)} - {formatDate(event.end_time)}
                      </Text>
                    </div>

                    <div className="flex items-center justify-between">
                      <Space size="large">
                        <div className="flex items-center text-green-600">
                          <TeamOutlined className="mr-1" />
                          <Text className="text-sm font-medium">{eventTeams.length} Teams</Text>
                        </div>
                        <div className="flex items-center text-orange-600">
                          <BulbOutlined className="mr-1" />
                          <Text className="text-sm font-medium">{eventIdeas.length} Ideas</Text>
                        </div>
                      </Space>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {events.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <CalendarOutlined style={{ fontSize: '64px' }} />
          </div>
          <Title level={3} className="text-gray-500">Chưa có sự kiện nào</Title>
          <Text className="text-gray-400">Bắt đầu bằng cách tạo sự kiện đầu tiên của bạn</Text>
          {user?.role === 'admin' && (
            <div className="mt-6">
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                size="large"
                className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 rounded-lg px-6"
                onClick={handleCreateEvent}
              >
                Tạo sự kiện đầu tiên
              </Button>
            </div>
          )}
        </div>
      )}

      <EventModal
        visible={modalVisible}
        onCancel={handleCloseModal}
        event={selectedEvent}
        mode={modalMode}
      />
    </div>
  );
};

export default EventList;