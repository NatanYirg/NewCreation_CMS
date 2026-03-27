'use client';

import { useEffect, useState } from 'react';
import { Row, Col, Card, Avatar, Spin, Alert } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  DollarOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { dashboardAPI } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface MonthData { month: string; total: number; }
interface RecentMember {
  id: number; firstName: string; middleName: string; lastName: string;
  status: string; createdAt: string; photo?: string;
}
interface DashboardData {
  totalMembers: number;
  activeMembers: number;
  totalFoundationClasses: number;
  baptizedThisYear: number;
  monthlyOffering: number;
  monthlyChart: MonthData[];
  recentMembers: RecentMember[];
}

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  ACTIVE:   { bg: 'hsl(142,71%,40%,0.1)',  color: 'hsl(142,71%,32%)',  border: 'hsl(142,71%,40%,0.3)' },
  INACTIVE: { bg: 'hsl(0,72%,51%,0.1)',    color: 'hsl(0,72%,42%)',    border: 'hsl(0,72%,51%,0.3)' },
  LEFT:     { bg: 'hsl(210,14%,93%)',       color: 'hsl(220,10%,46%)',  border: 'hsl(220,10%,46%,0.3)' },
  DECEASED: { bg: 'hsl(210,14%,93%)',       color: 'hsl(220,10%,46%)',  border: 'hsl(220,10%,46%,0.3)' },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.LEFT;
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 6,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      textTransform: 'capitalize', whiteSpace: 'nowrap',
    }}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function MemberAvatar({ name, photo }: { name: string; photo?: string }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  if (photo) {
    return <img src={`${API_URL}${photo}`} alt={name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />;
  }
  return (
    <div style={{
      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
      background: 'hsl(199,89%,36%,0.1)', color: 'hsl(199,89%,36%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 600, fontSize: 13,
    }}>
      {initials}
    </div>
  );
}

function StatCard({ icon, label, value, iconColor }: { icon: React.ReactNode; label: string; value: string | number; iconColor: string }) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ color: iconColor, fontSize: 15 }}>{icon}</span>
        <span style={{ color: 'hsl(220,10%,46%)', fontSize: 12 }}>{label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: 'hsl(220,20%,10%)', lineHeight: 1 }}>{value}</div>
    </div>
  );
}

function BarChart({ data }: { data: MonthData[] }) {
  const max = Math.max(...data.map((d) => d.total), 1);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));

  return (
    <div style={{ display: 'flex', height: 220, gap: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-between', paddingRight: 8, paddingBottom: 24 }}>
        {ticks.map((t) => (
          <span key={t} style={{ fontSize: 11, color: 'hsl(220,10%,60%)', whiteSpace: 'nowrap' }}>
            ₦{t >= 1000 ? `${Math.round(t / 1000)}K` : t}
          </span>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 10, borderLeft: '1px solid hsl(214,20%,90%)', paddingLeft: 8 }}>
        {data.map((d) => (
          <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: '100%',
              height: `${(d.total / max) * 180}px`,
              minHeight: d.total > 0 ? 4 : 0,
              background: 'hsl(199,89%,36%)',
              borderRadius: '4px 4px 0 0',
              transition: 'height 0.3s',
            }} />
            <span style={{ fontSize: 11, color: 'hsl(220,10%,60%)' }}>{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardAPI.getAdminDashboard()
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin style={{ display: 'block', marginTop: 64 }} />;
  if (error) return <Alert message={error} type="error" />;
  if (!data) return null;

  const fmt = (n: number) =>
    n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000 ? `₦${Math.round(n / 1_000)}K`
    : `₦${n}`;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Dashboard</div>
        <div className="page-description">Overview of your church at a glance</div>
      </div>

      {/* Stat cards */}
      <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
        {[
          { icon: <UserOutlined />, label: 'Total Members',      value: data.totalMembers,          color: 'hsl(199,89%,36%)' },
          { icon: <TeamOutlined />, label: 'Active Members',     value: data.activeMembers,          color: 'hsl(142,71%,40%)' },
          { icon: <CheckCircleOutlined />, label: 'Baptized This Year', value: data.baptizedThisYear, color: 'hsl(262,60%,55%)' },
          { icon: <DollarOutlined />, label: 'Monthly Offering', value: fmt(data.monthlyOffering),   color: 'hsl(38,92%,50%)' },
          { icon: <BookOutlined />, label: 'Foundation Classes', value: data.totalFoundationClasses, color: 'hsl(340,65%,55%)' },
        ].map((s) => (
          <Col key={s.label} xs={12} sm={8} md={8} lg={Math.floor(24 / 5)}>
            <StatCard icon={s.icon} label={s.label} value={s.value} iconColor={s.color} />
          </Col>
        ))}
      </Row>

      {/* Chart + Recent */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={15}>
          <Card
            title="Monthly Tithe Summary"
            styles={{ body: { padding: '16px 20px' } }}
          >
            <BarChart data={data.monthlyChart} />
          </Card>
        </Col>
        <Col xs={24} lg={9}>
          <Card
            title="Recent Registrations"
            styles={{ body: { padding: '8px 16px' } }}
            style={{ height: '100%' }}
          >
            {data.recentMembers.map((m, i) => (
              <div
                key={m.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 0',
                  borderBottom: i < data.recentMembers.length - 1 ? '1px solid hsl(214,20%,93%)' : 'none',
                }}
              >
                <MemberAvatar
                  name={`${m.firstName} ${m.middleName} ${m.lastName}`}
                  photo={m.photo}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {m.firstName} {m.middleName} {m.lastName}
                  </div>
                  <div style={{ fontSize: 11, color: 'hsl(220,10%,60%)' }}>
                    {new Date(m.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' })}
                  </div>
                </div>
                <StatusBadge status={m.status} />
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
