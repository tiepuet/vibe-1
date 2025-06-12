import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Typography, Button, message } from 'antd';
import { 
  DashboardOutlined, 
  CalendarOutlined, 
  ProjectOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Lightbulb } from 'lucide-react';

const { Header, Sider, Content } = AntLayout;
const { Title } = Typography;

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/events',
      icon: <CalendarOutlined />,
      label: 'Events',
    },
    {
      key: '/projects',
      icon: <ProjectOutlined />,
      label: 'Projects',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = async () => {
    try {
      await logout();
      message.success('Đăng xuất thành công!');
      navigate('/login');
    } catch (error) {
      message.error('Có lỗi xảy ra khi đăng xuất!');
    }
  };

  const dropdownItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
      onClick: () => {
        // TODO: Implement profile page
        message.info('Tính năng đang phát triển');
      }
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      onClick: () => {
        // TODO: Implement settings page
        message.info('Tính năng đang phát triển');
      }
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <AntLayout className="min-h-screen">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="bg-white shadow-lg"
        width={250}
      >
        <div className="flex items-center justify-center p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <div>
                <Title level={4} className="m-0 text-gray-800">Teko</Title>
                <p className="text-sm text-gray-500 m-0">Innovation</p>
              </div>
            )}
          </div>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="border-r-0 mt-4"
        />
      </Sider>
      
      <AntLayout>
        <Header className="bg-white shadow-sm px-4 flex items-center justify-between">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg w-16 h-16"
          />
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Xin chào,</div>
              <div className="font-medium text-gray-800">{user?.full_name}</div>
            </div>
            <Dropdown
              menu={{ items: dropdownItems }}
              placement="bottomRight"
              arrow
              trigger={['click']}
            >
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors">
                <Avatar 
                  size="large" 
                  icon={<UserOutlined />}
                  className="bg-blue-500"
                />
                {user?.role === 'admin' && (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content className="m-6 p-6 bg-gray-50 rounded-lg min-h-[calc(100vh-112px)] overflow-auto">
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;