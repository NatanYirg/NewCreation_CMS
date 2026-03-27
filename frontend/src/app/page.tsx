'use client';

import { Layout, Menu, Input, Button, Space, Badge } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  DollarOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  HeartOutlined,
  BankOutlined,
  SearchOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
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

const MAIN_NAV = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: 'members', icon: <UserOutlined />, label: 'Members' },
  { key: 'foundation-classes', icon: <BookOutlined />, label: 'Foundation Classes' },
  { key: 'family', icon: <HeartOutlined />, label: 'Families' },
  { key: 'departments', icon: <TeamOutlined />, label: 'Ministries' },
];

const OPS_NAV = [
  { key: 'baptism', icon: <CheckCircleOutlined />, label: 'Baptisms' },
  { key: 'attendance', icon: <CalendarOutlined />, label: 'Attendance' },
  { key: 'tithe', icon: <DollarOutlined />, label: 'Tithes' },
];

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'members': return <Members />;
      case 'foundation-classes': return <FoundationClasses />;
      case 'departments': return <Departments />;
      case 'attendance': return <Attendance />;
      case 'baptism': return <Baptism />;
      case 'family': return <Family />;
      case 'tithe': return <Tithe />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ── Sidebar ── */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={220}
        className="app-sider"
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <BankOutlined />
          </div>
          {!collapsed && (
            <div className="sidebar-logo-text">
              <span className="sidebar-logo-title">NCIC Hub</span>
              <span className="sidebar-logo-sub">Management System</span>
            </div>
          )}
        </div>

        {/* Main nav group */}
        {!collapsed && <div className="sidebar-group-label">Main</div>}
        <Menu
          mode="inline"
          selectedKeys={[currentPage]}
          items={MAIN_NAV}
          onClick={(e) => setCurrentPage(e.key)}
          style={{ marginBottom: 0 }}
        />

        {/* Operations nav group */}
        {!collapsed && <div className="sidebar-group-label">Operations</div>}
        <Menu
          mode="inline"
          selectedKeys={[currentPage]}
          items={OPS_NAV}
          onClick={(e) => setCurrentPage(e.key)}
        />
      </Sider>

      <Layout>
        {/* ── Header ── */}
        <Header className="app-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="sidebar-trigger"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
            <div className="header-search" style={{ display: 'flex' }}>
              <Input
                placeholder="Search members..."
                prefix={<SearchOutlined style={{ color: 'hsl(220, 10%, 60%)' }} />}
                style={{ width: 256 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button
              type="text"
              icon={<BellOutlined style={{ fontSize: 16, color: 'hsl(220, 10%, 46%)' }} />}
              style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            />
            <div style={{ width: 1, height: 24, background: 'hsl(214, 20%, 90%)', margin: '0 4px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="header-user-avatar">
                <UserOutlined style={{ fontSize: 14 }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'hsl(220, 20%, 10%)' }}>
                Admin
              </span>
            </div>
          </div>
        </Header>

        {/* ── Content ── */}
        <Content className="app-content">
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}
