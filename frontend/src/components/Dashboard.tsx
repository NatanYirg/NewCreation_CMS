'use client';

import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Spin, Alert } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { dashboardAPI } from '@/lib/api';

interface DashboardData {
  overview: {
    totalUsers: number;
    totalMembers: number;
    totalLeaders: number;
    totalFoundationClasses: number;
    totalDepartments: number;
    activeMembers: number;
    inactiveMembers: number;
  };
  financials: {
    totalTithe: number;
  };
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardAPI.getAdminDashboard();
        setData(response.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Spin />;
  if (error) return <Alert message={error} type="error" />;
  if (!data) return <Alert message="No data available" type="info" />;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Row gutter={16} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Members"
              value={data.overview.totalMembers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Members"
              value={data.overview.activeMembers}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Foundation Classes"
              value={data.overview.totalFoundationClasses}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Tithe"
              value={data.financials.totalTithe}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Leaders"
              value={data.overview.totalLeaders}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Departments"
              value={data.overview.totalDepartments}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Inactive Members"
              value={data.overview.inactiveMembers}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
