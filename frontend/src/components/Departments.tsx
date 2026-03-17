'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Spin,
  Alert,
  Space,
  App,
} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { api } from '@/lib/api';

interface Department {
  id: number;
  name: string;
}

export default function Departments() {
  const { modal, message: msg } = App.useApp();
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filtered, setFiltered] = useState<Department[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data);
      setFiltered(response.data);
    } catch (err) {
      setError('Failed to load departments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setFiltered(departments.filter((d) => d.name.toLowerCase().includes(value.toLowerCase())));
  };

  const handleAddDepartment = async (values: any) => {
    try {
      await api.post('/departments', values);
      setIsModalOpen(false);
      form.resetFields();
      msg.success('Department added successfully');
      fetchDepartments();
    } catch (err) {
      msg.error('Failed to add department');
      console.error(err);
    }
  };

  const handleDelete = (id: number) => {
    modal.confirm({
      title: 'Delete this department?',
      centered: true,
      okType: 'danger',
      onOk: async () => {
        await api.delete(`/departments/${id}`);
        msg.success('Department deleted');
        fetchDepartments();
      },
    });
  };

  const handleEdit = (record: Department) => {
    setEditingDept(record);
    editForm.setFieldsValue({ name: record.name });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (values: any) => {
    if (!editingDept) return;
    try {
      await api.put(`/departments/${editingDept.id}`, values);
      setIsEditModalOpen(false);
      editForm.resetFields();
      msg.success('Department updated');
      fetchDepartments();
    } catch {
      msg.error('Failed to update department');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Department) => (
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
          placeholder="Search departments..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ maxWidth: 280 }}
          allowClear
          onClear={() => handleSearch('')}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Add Department
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => router.push(`/departments/${record.id}`),
          style: { cursor: 'pointer' },
        })}
      />

      <Modal
        title="Add New Department"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddDepartment}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter department name' }]}
          >
            <Input placeholder="e.g., Children Ministry" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Department"
        open={isEditModalOpen}
        onOk={() => editForm.submit()}
        onCancel={() => { setIsEditModalOpen(false); editForm.resetFields(); }}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
