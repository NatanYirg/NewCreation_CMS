'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, Spin, Alert, Button, Table, Tabs, Modal, Form, Select, message, Avatar, Drawer, Descriptions, Input, Space, App } from 'antd';
import { ArrowLeftOutlined, UserAddOutlined, UserDeleteOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { api, foundationClassesAPI } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface FoundationClass { id: number; name: string; level: number; }
interface ClassMember { id: number; memberId: number; member: { id: number; firstName: string; lastName: string; photo?: string; phone?: string; email?: string; }; }
interface ClassLeader { id: number; memberId: number; isMainLeader: boolean; member: { id: number; firstName: string; lastName: string; photo?: string; }; }

export default function FoundationClassDetails() {
  const { modal, message: msg } = App.useApp();
  const router = useRouter();
  const params = useParams();
  const classId = Number(params.id);
  const [classData, setClassData] = useState<FoundationClass | null>(null);
  const [members, setMembers] = useState<ClassMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<ClassMember[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [leaders, setLeaders] = useState<ClassLeader[]>([]);
  const [filteredLeaders, setFilteredLeaders] = useState<ClassLeader[]>([]);
  const [leaderSearch, setLeaderSearch] = useState('');
  const [allMembers, setAllMembers] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAddLeaderModalOpen, setIsAddLeaderModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<ClassMember['member'] | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form] = Form.useForm();
  const [leaderForm] = Form.useForm();

  // Attendance state
  const [weekSessions, setWeekSessions] = useState<{ id: number; sessionDate: string; notes?: string; attendances: { present: boolean; member: { id: number; firstName: string; lastName: string; photo?: string } }[] }[]>([]);
  const [sessionDetailOpen, setSessionDetailOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<typeof weekSessions[0] | null>(null);

  useEffect(() => { fetchData(); }, [classId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classRes, membersRes, leadersRes, allMembersRes, sessionsRes] = await Promise.all([
        foundationClassesAPI.getById(classId),
        api.get(`/foundation-class-members/ListAll/${classId}`),
        api.get(`/foundation-class-leaders/GetLeader/${classId}`),
        api.get('/members'),
        api.get(`/attendance/sessions/class/${classId}`),
      ]);
      setClassData(classRes.data);
      setMembers(membersRes.data);
      setFilteredMembers(membersRes.data);
      setLeaders(leadersRes.data);
      setFilteredLeaders(leadersRes.data);
      setAllMembers(allMembersRes.data.map((m: any) => ({ label: `${m.firstName} ${m.lastName}`, value: m.id })));

      // Filter sessions to current ISO week (Mon–Sun)
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0=Sun
      const diffToMon = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
      const monday = new Date(now); monday.setDate(now.getDate() + diffToMon); monday.setHours(0,0,0,0);
      const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6); sunday.setHours(23,59,59,999);
      const thisWeek = sessionsRes.data.filter((s: any) => {
        const d = new Date(s.sessionDate);
        return d >= monday && d <= sunday;
      });
      setWeekSessions(thisWeek);
    } catch (err) {
      setError('Failed to load class details');
    } finally {
      setLoading(false);
    }
  };

  const handleMemberSearch = (value: string) => {
    setMemberSearch(value);
    const q = value.toLowerCase();
    setFilteredMembers(members.filter((r) => `${r.member.firstName} ${r.member.lastName}`.toLowerCase().includes(q)));
  };

  const handleLeaderSearch = (value: string) => {
    setLeaderSearch(value);
    const q = value.toLowerCase();
    setFilteredLeaders(leaders.filter((r) => `${r.member.firstName} ${r.member.lastName}`.toLowerCase().includes(q)));
  };

  const handleAddMember = async (values: any) => {
    try {
      await api.post('/foundation-class-members/assign', { memberId: values.memberId, foundationClassId: classId });
      setIsAddMemberModalOpen(false);
      form.resetFields();
      msg.success('Member added to class');
      fetchData();
    } catch { msg.error('Failed to add member'); }
  };

  const handleAddLeader = async (values: any) => {
    try {
      await api.post('/foundation-class-leaders/AssignLeader', { memberId: values.memberId, foundationClassId: classId, isMainLeader: values.isMainLeader || false });
      setIsAddLeaderModalOpen(false);
      leaderForm.resetFields();
      msg.success('Leader assigned');
      fetchData();
    } catch { msg.error('Failed to assign leader'); }
  };

  const handleRemoveMember = (memberId: number) => {
    modal.confirm({ title: 'Remove member from class?', centered: true, onOk: async () => { await api.delete(`/foundation-class-members/DeleteMember/${memberId}`); msg.success('Member removed'); fetchData(); } });
  };

  const handleRemoveLeader = (leaderId: number) => {
    modal.confirm({ title: 'Remove leader from class?', centered: true, onOk: async () => { await api.delete(`/foundation-class-leaders/${leaderId}`); msg.success('Leader removed'); fetchData(); } });
  };

  const memberColumns = [
    {
      title: 'Name', key: 'name',
      render: (_: any, r: ClassMember) => (
        <Space>
          <Avatar size={28} src={r.member.photo ? `${API_URL}${r.member.photo}` : undefined} icon={<UserOutlined />} />
          {`${r.member.firstName} ${r.member.lastName}`}
        </Space>
      ),
    },
    { title: 'Actions', key: 'actions', render: (_: any, r: ClassMember) => (<Button danger size="small" icon={<UserDeleteOutlined />} onClick={(e) => { e.stopPropagation(); handleRemoveMember(r.memberId); }}>Remove</Button>) },
  ];

  const leaderColumns = [
    {
      title: 'Name', key: 'name',
      render: (_: any, r: ClassLeader) => (
        <Space>
          <Avatar size={28} src={r.member.photo ? `${API_URL}${r.member.photo}` : undefined} icon={<UserOutlined />} />
          {`${r.member.firstName} ${r.member.lastName}`}
        </Space>
      ),
    },
    { title: 'Main Leader', dataIndex: 'isMainLeader', key: 'isMainLeader', render: (v: boolean) => (v ? 'Yes' : 'No') },
    { title: 'Actions', key: 'actions', render: (_: any, r: ClassLeader) => (<Button danger size="small" icon={<UserDeleteOutlined />} onClick={() => handleRemoveLeader(r.id)}>Remove</Button>) },
  ];

  if (loading) return <Spin />;
  if (error) return <Alert message={error} type="error" />;
  if (!classData) return <Alert message="Class not found" type="error" />;

  return (
    <div>
      <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => router.back()} style={{ marginBottom: 16 }}>Back</Button>
      <Card title={`${classData.name} (Level ${classData.level})`}>
        <Tabs items={[
          {
            key: 'members', label: `Members (${members.length})`,
            children: (
              <div>
                <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button type="primary" icon={<UserAddOutlined />} onClick={() => setIsAddMemberModalOpen(true)}>Add Member</Button>
                  <Input placeholder="Search members..." prefix={<SearchOutlined />} value={memberSearch} onChange={(e) => handleMemberSearch(e.target.value)} style={{ maxWidth: 260 }} allowClear onClear={() => handleMemberSearch('')} />
                </div>
                <Table columns={memberColumns} dataSource={filteredMembers} rowKey="id" pagination={false}
                  onRow={(r) => ({ onClick: () => { setSelectedMember(r.member); setIsDrawerOpen(true); }, style: { cursor: 'pointer' } })} />
              </div>
            ),
          },
          {
            key: 'leaders', label: `Leaders (${leaders.length})`,
            children: (
              <div>
                <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button type="primary" icon={<UserAddOutlined />} onClick={() => setIsAddLeaderModalOpen(true)}>Add Leader</Button>
                  <Input placeholder="Search leaders..." prefix={<SearchOutlined />} value={leaderSearch} onChange={(e) => handleLeaderSearch(e.target.value)} style={{ maxWidth: 260 }} allowClear onClear={() => handleLeaderSearch('')} />
                </div>
                <Table columns={leaderColumns} dataSource={filteredLeaders} rowKey="id" pagination={false} />
              </div>
            ),
          },
          { key: 'attendance', label: 'This Week Attendance', children: (
            weekSessions.length === 0
              ? <Alert message="No sessions this week" type="info" />
              : <Table
                  rowKey="id"
                  pagination={false}
                  dataSource={weekSessions}
                  onRow={(s) => ({ onClick: () => { setSelectedSession(s); setSessionDetailOpen(true); }, style: { cursor: 'pointer' } })}
                  columns={[
                    { title: 'Date', dataIndex: 'sessionDate', key: 'date', render: (d: string) => new Date(d).toLocaleDateString() },
                    { title: 'Present', key: 'present', render: (_: any, s: any) => s.attendances.filter((a: any) => a.present).length },
                    { title: 'Absent', key: 'absent', render: (_: any, s: any) => s.attendances.filter((a: any) => !a.present).length },
                    { title: 'Total', key: 'total', render: (_: any, s: any) => s.attendances.length },
                    { title: 'Notes', dataIndex: 'notes', key: 'notes', render: (n: string) => n || '—' },
                  ]}
                />
          ) },
        ]} />
      </Card>

      <Modal title="Add Member to Class" open={isAddMemberModalOpen} onOk={() => form.submit()} onCancel={() => setIsAddMemberModalOpen(false)}>
        <Form form={form} layout="vertical" onFinish={handleAddMember}>
          <Form.Item label="Select Member" name="memberId" rules={[{ required: true }]}><Select placeholder="Choose a member" options={allMembers} showSearch optionFilterProp="label" /></Form.Item>
        </Form>
      </Modal>

      <Modal title="Add Leader to Class" open={isAddLeaderModalOpen} onOk={() => leaderForm.submit()} onCancel={() => setIsAddLeaderModalOpen(false)}>
        <Form form={leaderForm} layout="vertical" onFinish={handleAddLeader}>
          <Form.Item label="Select Member" name="memberId" rules={[{ required: true }]}><Select placeholder="Choose a member" options={allMembers} showSearch optionFilterProp="label" /></Form.Item>
          <Form.Item label="Main Leader?" name="isMainLeader" initialValue={false}><Select options={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} /></Form.Item>
        </Form>
      </Modal>

      <Modal
        title={selectedSession ? `Session — ${new Date(selectedSession.sessionDate).toLocaleDateString()}` : 'Session Details'}
        open={sessionDetailOpen}
        onCancel={() => setSessionDetailOpen(false)}
        footer={null}
        width={520}
      >
        {selectedSession && (
          <Tabs items={[
            {
              key: 'present', label: `Present (${selectedSession.attendances.filter((a) => a.present).length})`,
              children: (
                <Table
                  rowKey={(r: any) => r.member.id}
                  pagination={false}
                  dataSource={selectedSession.attendances.filter((a) => a.present)}
                  columns={[{
                    title: 'Name', key: 'name',
                    render: (_: any, r: any) => (
                      <Space>
                        <Avatar size={28} src={r.member.photo ? `${API_URL}${r.member.photo}` : undefined} icon={<UserOutlined />} />
                        {`${r.member.firstName} ${r.member.lastName}`}
                      </Space>
                    ),
                  }]}
                />
              ),
            },
            {
              key: 'absent', label: `Absent (${selectedSession.attendances.filter((a) => !a.present).length})`,
              children: (
                <Table
                  rowKey={(r: any) => r.member.id}
                  pagination={false}
                  dataSource={selectedSession.attendances.filter((a) => !a.present)}
                  columns={[{
                    title: 'Name', key: 'name',
                    render: (_: any, r: any) => (
                      <Space>
                        <Avatar size={28} src={r.member.photo ? `${API_URL}${r.member.photo}` : undefined} icon={<UserOutlined />} />
                        {`${r.member.firstName} ${r.member.lastName}`}
                      </Space>
                    ),
                  }]}
                />
              ),
            },
          ]} />
        )}
      </Modal>

      <Drawer title={selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : 'Member Details'} open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} width={360}>
        {selectedMember && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Avatar size={80} src={selectedMember.photo ? `${API_URL}${selectedMember.photo}` : undefined} icon={<UserOutlined />} />
              <div style={{ marginTop: 8, fontWeight: 600, fontSize: 16 }}>{selectedMember.firstName} {selectedMember.lastName}</div>
            </div>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Phone">{selectedMember.phone || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedMember.email || 'N/A'}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>
    </div>
  );
}