'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, Spin, Alert, Button, Table, Tabs, Modal, Form, Select, Avatar, Drawer, Descriptions, Input, Space, App } from 'antd';
import { ArrowLeftOutlined, UserAddOutlined, UserDeleteOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { api } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Department { id: number; name: string; }
interface DeptMember { id: number; memberId: number; member: { id: number; firstName: string; lastName: string; photo?: string; phone?: string; email?: string; }; }
interface DeptLeader { id: number; memberId: number; member: { id: number; firstName: string; lastName: string; photo?: string; }; }

export default function DepartmentDetails() {
  const { modal, message: msg } = App.useApp();
  const router = useRouter();
  const params = useParams();
  const departmentId = Number(params.id);
  const [department, setDepartment] = useState<Department | null>(null);
  const [members, setMembers] = useState<DeptMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<DeptMember[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [leaders, setLeaders] = useState<DeptLeader[]>([]);
  const [filteredLeaders, setFilteredLeaders] = useState<DeptLeader[]>([]);
  const [leaderSearch, setLeaderSearch] = useState('');
  const [allMembers, setAllMembers] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAddLeaderModalOpen, setIsAddLeaderModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<DeptMember['member'] | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form] = Form.useForm();
  const [leaderForm] = Form.useForm();

  useEffect(() => { fetchData(); }, [departmentId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [deptRes, membersRes, leadersRes, allMembersRes] = await Promise.all([
        api.get(`/departments/${departmentId}`),
        api.get(`/departments/${departmentId}/members`),
        api.get(`/departments/${departmentId}/leaders`),
        api.get('/members'),
      ]);
      setDepartment(deptRes.data);
      setMembers(membersRes.data);
      setFilteredMembers(membersRes.data);
      setLeaders(leadersRes.data);
      setFilteredLeaders(leadersRes.data);
      setAllMembers(allMembersRes.data.map((m: any) => ({ label: `${m.firstName} ${m.lastName}`, value: m.id })));
    } catch (err) {
      setError('Failed to load department details');
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
      await api.post(`/departments/${departmentId}/members`, { memberId: values.memberId });
      setIsAddMemberModalOpen(false);
      form.resetFields();
      msg.success('Member added');
      fetchData();
    } catch { msg.error('Failed to add member'); }
  };

  const handleAddLeader = async (values: any) => {
    try {
      await api.post(`/departments/${departmentId}/leaders`, { memberId: values.memberId });
      setIsAddLeaderModalOpen(false);
      leaderForm.resetFields();
      msg.success('Leader assigned');
      fetchData();
    } catch { msg.error('Failed to assign leader'); }
  };

  const handleRemoveMember = (memberId: number) => {
    modal.confirm({ title: 'Remove member from department?', centered: true, onOk: async () => { await api.delete(`/departments/${departmentId}/members/${memberId}`); msg.success('Member removed'); fetchData(); } });
  };

  const handleRemoveLeader = (memberId: number) => {
    modal.confirm({ title: 'Remove leader from department?', centered: true, onOk: async () => { await api.delete(`/departments/${departmentId}/leaders/${memberId}`); msg.success('Leader removed'); fetchData(); } });
  };

  const memberColumns = [
    {
      title: 'Name', key: 'name',
      render: (_: any, r: DeptMember) => (
        <Space>
          <Avatar size={28} src={r.member.photo ? `${API_URL}${r.member.photo}` : undefined} icon={<UserOutlined />} />
          {`${r.member.firstName} ${r.member.lastName}`}
        </Space>
      ),
    },
    { title: 'Actions', key: 'actions', render: (_: any, r: DeptMember) => (<Button danger size="small" icon={<UserDeleteOutlined />} onClick={(e) => { e.stopPropagation(); handleRemoveMember(r.memberId); }}>Remove</Button>) },
  ];

  const leaderColumns = [
    {
      title: 'Name', key: 'name',
      render: (_: any, r: DeptLeader) => (
        <Space>
          <Avatar size={28} src={r.member.photo ? `${API_URL}${r.member.photo}` : undefined} icon={<UserOutlined />} />
          {`${r.member.firstName} ${r.member.lastName}`}
        </Space>
      ),
    },
    { title: 'Actions', key: 'actions', render: (_: any, r: DeptLeader) => (<Button danger size="small" icon={<UserDeleteOutlined />} onClick={() => handleRemoveLeader(r.memberId)}>Remove</Button>) },
  ];

  if (loading) return <Spin />;
  if (error) return <Alert message={error} type="error" />;
  if (!department) return <Alert message="Department not found" type="error" />;

  return (
    <div>
      <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => router.back()} style={{ marginBottom: 16 }}>Back</Button>
      <Card title={department.name}>
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
        ]} />
      </Card>

      <Modal title="Add Member to Department" open={isAddMemberModalOpen} onOk={() => form.submit()} onCancel={() => setIsAddMemberModalOpen(false)}>
        <Form form={form} layout="vertical" onFinish={handleAddMember}>
          <Form.Item label="Select Member" name="memberId" rules={[{ required: true }]}><Select placeholder="Choose a member" options={allMembers} showSearch optionFilterProp="label" /></Form.Item>
        </Form>
      </Modal>

      <Modal title="Add Leader to Department" open={isAddLeaderModalOpen} onOk={() => leaderForm.submit()} onCancel={() => setIsAddLeaderModalOpen(false)}>
        <Form form={leaderForm} layout="vertical" onFinish={handleAddLeader}>
          <Form.Item label="Select Member" name="memberId" rules={[{ required: true }]}><Select placeholder="Choose a member" options={allMembers} showSearch optionFilterProp="label" /></Form.Item>
        </Form>
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