'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  Spin,
  Alert,
  Space,
  message,
  Drawer,
  Descriptions,
  Avatar,
  Tag,
  App,
} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { membersAPI } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Member {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  age?: number;
  gender?: string;
  address?: string;
  status: string;
  photo?: string;
  foundationClasses?: { foundationClass: { id: number; name: string; level: number } }[];
}

export default function Members() {
  const { modal, message: msg } = App.useApp();
  const [members, setMembers] = useState<Member[]>([]);
  const [filtered, setFiltered] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [editFileList, setEditFileList] = useState<any[]>([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await membersAPI.getAll();
      setMembers(response.data);
      setFiltered(response.data);
    } catch (err) {
      setError('Failed to load members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    const q = value.toLowerCase();
    setFiltered(members.filter((m) =>
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
      m.phone.includes(q) ||
      (m.email || '').toLowerCase().includes(q)
    ));
  };

  const handleAddMember = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('phone', values.phone);
      formData.append('email', values.email);
      formData.append('age', values.age);
      formData.append('gender', values.gender);
      formData.append('address', values.address);
      formData.append('status', values.status || 'ACTIVE');

      if (fileList.length > 0) {
        formData.append('photo', fileList[0].originFileObj);
      }

      await membersAPI.create(formData);
      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);
      msg.success('Member added successfully');
      fetchMembers();
    } catch (err) {
      msg.error('Failed to add member');
      console.error(err);
    }
  };

  const handleDelete = (id: number) => {
    modal.confirm({
      title: 'Delete this member?',
      content: 'This action cannot be undone.',
      centered: true,
      okType: 'danger',
      onOk: async () => {
        await membersAPI.delete(id);
        msg.success('Member deleted');
        fetchMembers();
      },
    });
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    editForm.setFieldsValue({
      firstName: member.firstName,
      lastName: member.lastName,
      phone: member.phone,
      email: member.email,
      age: member.age,
      gender: member.gender,
      address: member.address,
      status: member.status,
    });
    setEditFileList([]);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (values: any) => {
    if (!editingMember) return;
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => { if (v !== undefined && v !== null) formData.append(k, String(v)); });
      if (editFileList.length > 0 && editFileList[0].originFileObj) {
        formData.append('photo', editFileList[0].originFileObj);
      }
      await membersAPI.update(editingMember.id, formData);
      setIsEditModalOpen(false);
      editForm.resetFields();
      setEditFileList([]);
      msg.success('Member updated');
      fetchMembers();
    } catch {
      msg.error('Failed to update member');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'name',
      render: (_: any, record: Member) => (
        <Space>
          <Avatar size={32} src={record.photo ? `${API_URL}${record.photo}` : undefined} icon={<UserOutlined />} />
          {`${record.firstName} ${record.lastName}`}
        </Space>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Foundation Class',
      key: 'foundationClass',
      render: (_: any, record: Member) => {
        const fc = record.foundationClasses?.[0]?.foundationClass;
        return fc ? `${fc.name}` : '—';
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Member) => (
        <Space onClick={(e) => e.stopPropagation()}>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  if (loading) return <Spin />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Input
          placeholder="Search by name, phone or email..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ maxWidth: 320 }}
          allowClear
          onClear={() => handleSearch('')}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Member
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => {
            setSelectedMember(record);
            setIsDetailDrawerOpen(true);
          },
          style: { cursor: 'pointer' },
        })}
      />

      <Modal
        title="Add New Member"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddMember}
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Age"
            name="age"
            rules={[{ required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true }]}
          >
            <Select options={[
              { label: 'Male', value: 'MALE' },
              { label: 'Female', value: 'FEMALE' },
            ]} />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Photo"
            name="photo"
            rules={[{ required: true, message: 'Photo is required' }]}
          >
            <Upload
              maxCount={1}
              fileList={fileList}
              onChange={(info) => setFileList(info.fileList)}
              beforeUpload={() => false}
            >
              <Button>Upload Photo</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Status" name="status" initialValue="ACTIVE">
            <Select options={[
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Inactive', value: 'INACTIVE' },
              { label: 'Deceased', value: 'DECEASED' },
              { label: 'Left Church', value: 'LEFT_CHURCH' },
            ]} />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : 'Member Details'}
        onClose={() => setIsDetailDrawerOpen(false)}
        open={isDetailDrawerOpen}
        width={400}
      >
        {selectedMember && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar
                size={96}
                src={selectedMember.photo ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${selectedMember.photo}` : undefined}
                icon={!selectedMember.photo ? <UserOutlined /> : undefined}
              />
              <div style={{ marginTop: 12, fontWeight: 600, fontSize: 18 }}>
                {selectedMember.firstName} {selectedMember.lastName}
              </div>
              <Tag color={selectedMember.status === 'ACTIVE' ? 'green' : 'red'} style={{ marginTop: 4 }}>
                {selectedMember.status}
              </Tag>
            </div>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Phone">{selectedMember.phone}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedMember.email || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Age">{selectedMember.age || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Gender">{selectedMember.gender || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Address">{selectedMember.address || 'N/A'}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>
      <Modal
        title="Edit Member"
        open={isEditModalOpen}
        onOk={() => editForm.submit()}
        onCancel={() => { setIsEditModalOpen(false); editForm.resetFields(); }}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
          <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Email" name="email"><Input type="email" /></Form.Item>
          <Form.Item label="Age" name="age"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Gender" name="gender">
            <Select options={[{ label: 'Male', value: 'MALE' }, { label: 'Female', value: 'FEMALE' }]} />
          </Form.Item>
          <Form.Item label="Address" name="address"><Input /></Form.Item>
          <Form.Item label="Status" name="status">
            <Select options={[
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Inactive', value: 'INACTIVE' },
              { label: 'Deceased', value: 'DECEASED' },
              { label: 'Left Church', value: 'LEFT_CHURCH' },
            ]} />
          </Form.Item>
          <Form.Item label="Photo (optional)">
            <Upload maxCount={1} fileList={editFileList} onChange={(info) => setEditFileList(info.fileList)} beforeUpload={() => false}>
              <Button>Change Photo</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
