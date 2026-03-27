'use client';

import { useEffect, useState } from 'react';
import {
  Table, Button, Modal, Form, Input, Select, DatePicker,
  Upload, Spin, Alert, Space, Drawer, Descriptions, Avatar, Tag, App,
} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { membersAPI } from '@/lib/api';
import dayjs from 'dayjs';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const GENDER_OPTIONS = [{ label: 'Male', value: 'MALE' }, { label: 'Female', value: 'FEMALE' }];
const STATUS_OPTIONS = [{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }, { label: 'Left', value: 'LEFT' }, { label: 'Deceased', value: 'DECEASED' }];
const MARITAL_OPTIONS = [{ label: 'Single', value: 'SINGLE' }, { label: 'Married', value: 'MARRIED' }, { label: 'Divorced', value: 'DIVORCED' }, { label: 'Separated', value: 'SEPARATED' }];
const BAPTISM_OPTIONS = [{ label: 'Baptized', value: 'BAPTIZED' }, { label: 'Not Baptized', value: 'NOT_BAPTIZED' }];

const STATUS_COLORS: Record<string, string> = { ACTIVE: 'green', INACTIVE: 'red', LEFT: 'default', DECEASED: 'black' };

interface Member {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  gender?: string;
  birthDate?: string;
  phone: string;
  alternativePhone?: string;
  email?: string;
  city?: string;
  subCity?: string;
  woreda?: string;
  houseNumber?: string;
  joinedDate?: string;
  salvationDate?: string;
  baptismStatus?: string;
  status: string;
  inactiveReason?: string;
  maritalStatus?: string;
  previousChurch?: string;
  notes?: string;
  photo?: string;
  foundationClasses?: { foundationClass: { id: number; name: string; level: number } }[];
}

export default function Members() {
  const { modal, message: msg } = App.useApp();
  const [members, setMembers] = useState<Member[]>([]);
  const [filtered, setFiltered] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [addFileList, setAddFileList] = useState<any[]>([]);
  const [editFileList, setEditFileList] = useState<any[]>([]);

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    try {
      const res = await membersAPI.getAll();
      setMembers(res.data);
      setFiltered(res.data);
    } catch {
      setError('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (list: Member[], q: string, status: string) => {
    return list.filter((m) => {
      const matchSearch =
        `${m.firstName} ${m.middleName} ${m.lastName}`.toLowerCase().includes(q.toLowerCase()) ||
        m.phone.includes(q) ||
        (m.email || '').toLowerCase().includes(q.toLowerCase());
      const matchStatus = status === 'all' || m.status === status;
      return matchSearch && matchStatus;
    });
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setFiltered(applyFilters(members, value, statusFilter));
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setFiltered(applyFilters(members, search, value));
  };

  const buildFormData = (values: any, file?: any): FormData => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') return;
      if (dayjs.isDayjs(v)) fd.append(k, v.toISOString());
      else fd.append(k, String(v));
    });
    if (file?.originFileObj) fd.append('photo', file.originFileObj);
    return fd;
  };

  const handleAdd = async (values: any) => {
    try {
      await membersAPI.create(buildFormData(values, addFileList[0]));
      setIsAddOpen(false);
      addForm.resetFields();
      setAddFileList([]);
      msg.success('Member added');
      fetchMembers();
    } catch { msg.error('Failed to add member'); }
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    editForm.setFieldsValue({
      ...member,
      birthDate: member.birthDate ? dayjs(member.birthDate) : undefined,
      joinedDate: member.joinedDate ? dayjs(member.joinedDate) : undefined,
      salvationDate: member.salvationDate ? dayjs(member.salvationDate) : undefined,
    });
    setEditFileList([]);
    setIsEditOpen(true);
  };

  const handleUpdate = async (values: any) => {
    if (!editingMember) return;
    try {
      await membersAPI.update(editingMember.id, buildFormData(values, editFileList[0]));
      setIsEditOpen(false);
      editForm.resetFields();
      setEditFileList([]);
      msg.success('Member updated');
      fetchMembers();
    } catch { msg.error('Failed to update member'); }
  };

  const handleDelete = (id: number) => {
    modal.confirm({
      title: 'Delete this member?',
      content: 'This cannot be undone.',
      centered: true,
      okType: 'danger',
      onOk: async () => { await membersAPI.delete(id); msg.success('Member deleted'); fetchMembers(); },
    });
  };

  const columns = [
    {
      title: 'Name', key: 'name',
      render: (_: any, m: Member) => (
        <Space>
          <Avatar size={32} src={m.photo ? `${API_URL}${m.photo}` : undefined} icon={<UserOutlined />} />
          {`${m.firstName} ${m.middleName} ${m.lastName}`}
        </Space>
      ),
    },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Foundation Class', key: 'fc',
      render: (_: any, m: Member) => m.foundationClasses?.[0]?.foundationClass?.name || '—',
    },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (s: string) => <Tag color={STATUS_COLORS[s] || 'default'}>{s}</Tag>,
    },
    {
      title: 'Actions', key: 'actions',
      render: (_: any, m: Member) => (
        <Space onClick={(e) => e.stopPropagation()}>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEdit(m)} />
          <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(m.id)} />
        </Space>
      ),
    },
  ];

  if (loading) return <Spin />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div className="page-title">Members</div>
          <div className="page-description">{members.length} total members</div>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddOpen(true)}>Add Member</Button>
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <Input
          placeholder="Search by name or phone..."
          prefix={<SearchOutlined style={{ color: 'hsl(220,10%,60%)' }} />}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          onClear={() => handleSearch('')}
          style={{ flex: 1, minWidth: 200, maxWidth: 320 }}
        />
        <Select
          value={statusFilter}
          onChange={handleStatusFilter}
          style={{ width: 140 }}
          options={[
            { label: 'All Status', value: 'all' },
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Inactive', value: 'INACTIVE' },
            { label: 'Left', value: 'LEFT' },
            { label: 'Deceased', value: 'DECEASED' },
          ]}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        onRow={(m) => ({ onClick: () => { setSelectedMember(m); setIsDetailOpen(true); }, style: { cursor: 'pointer' } })}
      />

      {/* Add Modal */}
      <Modal title="Add Member" open={isAddOpen} onOk={() => addForm.submit()} onCancel={() => setIsAddOpen(false)} width={640}>
        <MemberForm form={addForm} onFinish={handleAdd} fileList={addFileList} setFileList={setAddFileList} />
      </Modal>

      {/* Edit Modal */}
      <Modal title="Edit Member" open={isEditOpen} onOk={() => editForm.submit()} onCancel={() => { setIsEditOpen(false); editForm.resetFields(); }} width={640}>
        <MemberForm form={editForm} onFinish={handleUpdate} fileList={editFileList} setFileList={setEditFileList} isEdit />
      </Modal>

      {/* Detail Drawer */}
      <Drawer
        title={selectedMember ? `${selectedMember.firstName} ${selectedMember.middleName} ${selectedMember.lastName}` : ''}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        width={420}
      >
        {selectedMember && <MemberDetail member={selectedMember} />}
      </Drawer>
    </div>
  );
}

function MemberForm({ form, onFinish, fileList, setFileList, isEdit = false }: any) {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
        <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item label="Middle Name" name="middleName" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item label="Gender" name="gender"><Select options={GENDER_OPTIONS} allowClear /></Form.Item>
        <Form.Item label="Birth Date" name="birthDate"><DatePicker style={{ width: '100%' }} /></Form.Item>
        <Form.Item label="Phone" name="phone" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item label="Alternative Phone" name="alternativePhone"><Input /></Form.Item>
        <Form.Item label="Email" name="email"><Input type="email" /></Form.Item>
        <Form.Item label="City" name="city"><Input /></Form.Item>
        <Form.Item label="Sub City" name="subCity"><Input /></Form.Item>
        <Form.Item label="Woreda" name="woreda"><Input /></Form.Item>
        <Form.Item label="House Number" name="houseNumber"><Input /></Form.Item>
        <Form.Item label="Joined Date" name="joinedDate"><DatePicker style={{ width: '100%' }} /></Form.Item>
        <Form.Item label="Salvation Date" name="salvationDate"><DatePicker style={{ width: '100%' }} /></Form.Item>
        <Form.Item label="Baptism Status" name="baptismStatus" initialValue="NOT_BAPTIZED"><Select options={BAPTISM_OPTIONS} /></Form.Item>
        <Form.Item label="Status" name="status" initialValue="ACTIVE"><Select options={STATUS_OPTIONS} /></Form.Item>
        <Form.Item label="Marital Status" name="maritalStatus"><Select options={MARITAL_OPTIONS} allowClear /></Form.Item>
        <Form.Item label="Previous Church" name="previousChurch" style={{ gridColumn: 'span 2' }}><Input /></Form.Item>
        <Form.Item label="Notes" name="notes" style={{ gridColumn: 'span 2' }}><Input.TextArea rows={2} /></Form.Item>
        <Form.Item label={`Photo${isEdit ? ' (optional)' : ''}`} style={{ gridColumn: 'span 2' }}>
          <Upload maxCount={1} fileList={fileList} onChange={(i) => setFileList(i.fileList)} beforeUpload={() => false} listType="picture">
            <Button>{isEdit ? 'Change Photo' : 'Upload Photo'}</Button>
          </Upload>
        </Form.Item>
      </div>
    </Form>
  );
}

function MemberDetail({ member }: { member: Member }) {
  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <Avatar size={88} src={member.photo ? `${API_URL}${member.photo}` : undefined} icon={<UserOutlined />} />
        <div style={{ marginTop: 8, fontWeight: 600, fontSize: 16 }}>
          {member.firstName} {member.middleName} {member.lastName}
        </div>
        <Space style={{ marginTop: 4 }}>
          <Tag color={STATUS_COLORS[member.status] || 'default'}>{member.status}</Tag>
        </Space>
      </div>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Phone">{member.phone}</Descriptions.Item>
        {member.alternativePhone && <Descriptions.Item label="Alt. Phone">{member.alternativePhone}</Descriptions.Item>}
        {member.email && <Descriptions.Item label="Email">{member.email}</Descriptions.Item>}
        {member.gender && <Descriptions.Item label="Gender">{member.gender}</Descriptions.Item>}
        {member.birthDate && <Descriptions.Item label="Birth Date">{new Date(member.birthDate).toLocaleDateString()}</Descriptions.Item>}
        {member.maritalStatus && <Descriptions.Item label="Marital Status">{member.maritalStatus}</Descriptions.Item>}
        <Descriptions.Item label="Baptism">{member.baptismStatus || 'NOT_BAPTIZED'}</Descriptions.Item>
        {(member.city || member.subCity || member.woreda) && (
          <Descriptions.Item label="Address">
            {[member.city, member.subCity, member.woreda, member.houseNumber].filter(Boolean).join(', ')}
          </Descriptions.Item>
        )}
        {member.joinedDate && <Descriptions.Item label="Joined">{new Date(member.joinedDate).toLocaleDateString()}</Descriptions.Item>}
        {member.salvationDate && <Descriptions.Item label="Salvation Date">{new Date(member.salvationDate).toLocaleDateString()}</Descriptions.Item>}
        {member.previousChurch && <Descriptions.Item label="Previous Church">{member.previousChurch}</Descriptions.Item>}
        {member.foundationClasses?.[0] && (
          <Descriptions.Item label="Foundation Class">{member.foundationClasses[0].foundationClass.name}</Descriptions.Item>
        )}
        {member.inactiveReason && <Descriptions.Item label="Inactive Reason">{member.inactiveReason}</Descriptions.Item>}
        {member.notes && <Descriptions.Item label="Notes">{member.notes}</Descriptions.Item>}
      </Descriptions>
    </>
  );
}
