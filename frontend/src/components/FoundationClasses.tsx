'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Spin,
  Alert,
  Space,
  message,
  App,
  Avatar,
} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { foundationClassesAPI } from '@/lib/api';

interface FoundationClass {
  id: number;
  name: string;
  level: number;
  members?: any[];
  leaders?: any[];
  teachers?: any[];
}

export default function FoundationClasses() {
  const { modal, message: msg } = App.useApp();
  const router = useRouter();
  const [classes, setClasses] = useState<FoundationClass[]>([]);
  const [filtered, setFiltered] = useState<FoundationClass[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<FoundationClass | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await foundationClassesAPI.getAll();
      setClasses(response.data);
      setFiltered(response.data);
    } catch (err) {
      setError('Failed to load foundation classes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setFiltered(classes.filter((c) => c.name.toLowerCase().includes(value.toLowerCase())));
  };

  const handleAddClass = async (values: any) => {
    try {
      await foundationClassesAPI.create(values);
      setIsModalOpen(false);
      form.resetFields();
      msg.success('Foundation class added successfully');
      fetchClasses();
    } catch (err) {
      msg.error('Failed to add foundation class');
      console.error(err);
    }
  };

  const handleDelete = (id: number) => {
    modal.confirm({
      title: 'Delete this foundation class?',
      centered: true,
      okType: 'danger',
      onOk: async () => {
        await foundationClassesAPI.delete(id);
        msg.success('Foundation class deleted');
        fetchClasses();
      },
    });
  };

  const handleEdit = (record: FoundationClass) => {
    setEditingClass(record);
    editForm.setFieldsValue({ name: record.name, level: record.level });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (values: any) => {
    if (!editingClass) return;
    try {
      await foundationClassesAPI.update(editingClass.id, values);
      setIsEditModalOpen(false);
      editForm.resetFields();
      msg.success('Foundation class updated');
      fetchClasses();
    } catch {
      msg.error('Failed to update foundation class');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: 'Members',
      dataIndex: 'members',
      key: 'members',
      render: (members: any[]) => members?.length || 0,
    },
    {
      title: 'Leaders',
      dataIndex: 'leaders',
      key: 'leaders',
      render: (leaders: any[]) => leaders?.length || 0,
    },
    {
      title: 'Teachers',
      dataIndex: 'teachers',
      key: 'teachers',
      render: (teachers: any[]) => teachers?.length || 0,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: FoundationClass) => (
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
          placeholder="Search classes..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ maxWidth: 280 }}
          allowClear
          onClear={() => handleSearch('')}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Add Foundation Class
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => router.push(`/foundation-classes/${record.id}`),
          style: { cursor: 'pointer' },
        })}
      />

      <Modal
        title="Add New Foundation Class"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddClass}
        >
          <Form.Item
            label="Class Name"
            name="name"
            rules={[{ required: true, message: 'Please enter class name' }]}
          >
            <Input placeholder="e.g., Foundation Class 1" />
          </Form.Item>
          <Form.Item
            label="Level"
            name="level"
            rules={[{ required: true, message: 'Please select a level' }]}
          >
            <Select options={[{ label: 'Level 1', value: 1 }, { label: 'Level 2', value: 2 }]} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Foundation Class"
        open={isEditModalOpen}
        onOk={() => editForm.submit()}
        onCancel={() => { setIsEditModalOpen(false); editForm.resetFields(); }}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
          <Form.Item label="Class Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Level" name="level" rules={[{ required: true }]}>
            <Select options={[{ label: 'Level 1', value: 1 }, { label: 'Level 2', value: 2 }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
