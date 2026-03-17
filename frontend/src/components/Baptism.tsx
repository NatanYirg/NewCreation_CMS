'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Spin, Alert, Space, message, DatePicker, Card, Avatar, Drawer, Descriptions, Tag, App } from 'antd';
import { PlusOutlined, DeleteOutlined, UserAddOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { api } from '@/lib/api';
import dayjs from 'dayjs';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface BaptismRound { id: number; name: string; date: string; notes?: string; }
interface BaptismMember { id: number; memberId: number; member: { id: number; firstName: string; lastName: string; photo?: string; phone?: string; email?: string; gender?: string; age?: number; status?: string; }; }

export default function Baptism() {
  const { modal, message: msg } = App.useApp();
  const [rounds, setRounds] = useState<BaptismRound[]>([]);
  const [filteredRounds, setFilteredRounds] = useState<BaptismRound[]>([]);
  const [roundSearch, setRoundSearch] = useState('');
  const [members, setMembers] = useState<{ label: string; value: number }[]>([]);
  const [roundMembers, setRoundMembers] = useState<BaptismMember[]>([]);
  const [filteredRoundMembers, setFilteredRoundMembers] = useState<BaptismMember[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRoundModalOpen, setIsRoundModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [selectedMember, setSelectedMember] = useState<BaptismMember['member'] | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form] = Form.useForm();
  const [memberForm] = Form.useForm();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [roundsRes, membersRes] = await Promise.all([api.get('/baptism/rounds'), api.get('/members')]);
      setRounds(roundsRes.data);
      setFilteredRounds(roundsRes.data);
      setMembers(membersRes.data.map((m: any) => ({ label: `${m.firstName} ${m.lastName}`, value: m.id })));
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoundMembers = async (roundId: number) => {
    try {
      const response = await api.get(`/baptism/rounds/${roundId}/members`);
      setRoundMembers(response.data);
      setFilteredRoundMembers(response.data);
      setMemberSearch('');
    } catch { msg.error('Failed to load round members'); }
  };

  const handleRoundSearch = (value: string) => {
    setRoundSearch(value);
    setFilteredRounds(rounds.filter((r) => r.name.toLowerCase().includes(value.toLowerCase())));
  };

  const handleMemberSearch = (value: string) => {
    setMemberSearch(value);
    const q = value.toLowerCase();
    setFilteredRoundMembers(roundMembers.filter((r) =>
      `${r.member.firstName} ${r.member.lastName}`.toLowerCase().includes(q)
    ));
  };

  const handleCreateRound = async (values: any) => {
    try {
      await api.post('/baptism/rounds', { name: values.name, date: values.date.format('YYYY-MM-DD'), notes: values.notes });
      setIsRoundModalOpen(false);
      form.resetFields();
      msg.success('Baptism round created');
      fetchData();
    } catch { msg.error('Failed to create baptism round'); }
  };

  const handleAddMember = async (values: any) => {
    try {
      await api.post(`/baptism/rounds/${selectedRound}/members`, { memberId: values.memberId });
      setIsMemberModalOpen(false);
      memberForm.resetFields();
      msg.success('Member added to round');
      if (selectedRound) fetchRoundMembers(selectedRound);
    } catch { msg.error('Failed to add member'); }
  };

  const handleDeleteRound = (id: number) => {
    modal.confirm({ title: 'Delete this baptism round?', centered: true, okType: 'danger', onOk: async () => { await api.delete(`/baptism/rounds/${id}`); msg.success('Round deleted'); if (selectedRound === id) { setSelectedRound(null); setRoundMembers([]); setFilteredRoundMembers([]); } fetchData(); } });
  };

  const handleRemoveMember = (memberId: number) => {
    modal.confirm({ title: 'Remove member from round?', centered: true, okType: 'danger', onOk: async () => { await api.delete(`/baptism/rounds/${selectedRound}/members/${memberId}`); msg.success('Member removed'); if (selectedRound) fetchRoundMembers(selectedRound); } });
  };

  const roundColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Date', dataIndex: 'date', key: 'date', render: (d: string) => new Date(d).toLocaleDateString() },
    { title: 'Notes', dataIndex: 'notes', key: 'notes' },
    {
      title: 'Actions', key: 'actions',
      render: (_: any, record: BaptismRound) => (
        <Space>
          <Button type="primary" size="small" icon={<UserAddOutlined />} onClick={() => { setSelectedRound(record.id); setIsMemberModalOpen(true); fetchRoundMembers(record.id); }}>Add Member</Button>
          <Button size="small" onClick={() => { setSelectedRound(record.id); fetchRoundMembers(record.id); }}>View Members</Button>
          <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleDeleteRound(record.id)} />
        </Space>
      ),
    },
  ];

  const memberColumns = [
    {
      title: 'Name', key: 'name',
      render: (_: any, r: BaptismMember) => (
        <Space>
          <Avatar size={28} src={r.member.photo ? `${API_URL}${r.member.photo}` : undefined} icon={<UserOutlined />} />
          {`${r.member.firstName} ${r.member.lastName}`}
        </Space>
      ),
    },
    { title: 'Actions', key: 'actions', render: (_: any, r: BaptismMember) => (<Button danger size="small" icon={<DeleteOutlined />} onClick={(e) => { e.stopPropagation(); handleRemoveMember(r.memberId); }} />) },
  ];

  if (loading) return <Spin />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Input placeholder="Search rounds..." prefix={<SearchOutlined />} value={roundSearch} onChange={(e) => handleRoundSearch(e.target.value)} style={{ maxWidth: 280 }} allowClear onClear={() => handleRoundSearch('')} />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsRoundModalOpen(true)}>Create Baptism Round</Button>
      </div>
      <Table columns={roundColumns} dataSource={filteredRounds} rowKey="id" pagination={{ pageSize: 10 }} />

      {selectedRound && (
        <Card title="Round Members" style={{ marginTop: 24 }}>
          <div style={{ marginBottom: 12 }}>
            <Input placeholder="Search members..." prefix={<SearchOutlined />} value={memberSearch} onChange={(e) => handleMemberSearch(e.target.value)} style={{ maxWidth: 280 }} allowClear onClear={() => handleMemberSearch('')} />
          </div>
          <Table columns={memberColumns} dataSource={filteredRoundMembers} rowKey="id" pagination={false}
            onRow={(r) => ({ onClick: () => { setSelectedMember(r.member); setIsDrawerOpen(true); }, style: { cursor: 'pointer' } })} />
        </Card>
      )}

      <Modal title="Create Baptism Round" open={isRoundModalOpen} onOk={() => form.submit()} onCancel={() => setIsRoundModalOpen(false)}>
        <Form form={form} layout="vertical" onFinish={handleCreateRound}>
          <Form.Item label="Round Name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Date" name="date" rules={[{ required: true }]} initialValue={dayjs()}><DatePicker /></Form.Item>
          <Form.Item label="Notes" name="notes"><Input.TextArea /></Form.Item>
        </Form>
      </Modal>

      <Modal title="Add Member to Round" open={isMemberModalOpen} onOk={() => memberForm.submit()} onCancel={() => setIsMemberModalOpen(false)}>
        <Form form={memberForm} layout="vertical" onFinish={handleAddMember}>
          <Form.Item label="Select Member" name="memberId" rules={[{ required: true }]}>
            <Select placeholder="Choose a member" options={members} showSearch optionFilterProp="label" />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer title={selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : 'Member Details'} open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} width={360}>
        {selectedMember && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Avatar size={80} src={selectedMember.photo ? `${API_URL}${selectedMember.photo}` : undefined} icon={<UserOutlined />} />
              <div style={{ marginTop: 8, fontWeight: 600, fontSize: 16 }}>{selectedMember.firstName} {selectedMember.lastName}</div>
              {selectedMember.status && <Tag color={selectedMember.status === 'ACTIVE' ? 'green' : 'red'} style={{ marginTop: 4 }}>{selectedMember.status}</Tag>}
            </div>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Phone">{selectedMember.phone || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedMember.email || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Gender">{selectedMember.gender || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Age">{selectedMember.age || 'N/A'}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>
    </div>
  );
}