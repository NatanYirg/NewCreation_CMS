'use client';

import { Layout, Menu, Button, Space } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  DollarOutlined,
  LogoutOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import Members from '@/components/Members';
import FoundationClasses from '@/components/FoundationClasses';
import Departments from '@/components/Departments';
import Attendance from '@/components/Attendance';
import Baptism from '@/components/Baptism';
import Family from '@/components/Family';
import Tithe from '@/components/Tithe';

const { Header, Sider, Content } = Layout;

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'members',
      icon: <UserOutlined />,
      label: 'Members',
    },
    {
      key: 'foundation-classes',
      icon: <BookOutlined />,
      label: 'Foundation Classes',
    },
    {
      key: 'departments',
      icon: <TeamOutlined />,
      label: 'Departments',
    },
    {
      key: 'attendance',
      icon: <CalendarOutlined />,
      label: 'Attendance',
    },
    {
      key: 'baptism',
      icon: <CheckCircleOutlined />,
      label: 'Baptism',
    },
    {
      key: 'family',
      icon: <HeartOutlined />,
      label: 'Family',
    },
    {
      key: 'tithe',
      icon: <DollarOutlined />,
      label: 'Tithe',
    },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'members':
        return <Members />;
      case 'foundation-classes':
        return <FoundationClasses />;
      case 'departments':
        return <Departments />;
      case 'attendance':
        return <Attendance />;
      case 'baptism':
        return <Baptism />;
      case 'family':
        return <Family />;
      case 'tithe':
        return <Tithe />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ padding: '16px', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
          {!collapsed && 'NCIC Hub'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
          onClick={(e) => setCurrentPage(e.key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? '☰' : '✕'}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px' }}
          />
          <Space>
            <span>Admin User</span>
            <Button type="text" icon={<LogoutOutlined />}>
              Logout
            </Button>
          </Space>
        </Header>
        <Content style={{ margin: '16px' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}
