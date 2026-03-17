'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Alert,
  Space,
  DatePicker,
  message,
  App,
  Avatar,
} from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { titheAPI, foundationClassesAPI } from '@/lib/api';
import dayjs from 'dayjs';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Tithe {
  id: number;
  amount: number;
  type: string;
  name?: string;
  email?: string;
  phone?: string;
  foundationClassId?: number;
  date: string;
  member?: { id: number; firstName: string; lastName: string; photo?: string };
}

export default function Tithe() {
  const { modal, message: msg } = App.useApp();
  const [tithes, setTithes] = useState<Tithe[]>([]);
  const [filtered, setFiltered] = useState<Tithe[]>([]);
  const [search, setSearch] = useState('');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tithesRes, classesRes] = await Promise.all([
        titheAPI.getAll(),
        foundationClassesAPI.getAll(),
      ]);
      setTithes(tithesRes.data);
      setFiltered(tithesRes.data);
      setClasses(classesRes.data.map((c: any) => ({ label: c.name, value: c.id })));
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTithe = async (values: any) => {
    try {
      setIsSubmitting(true);
      const payload: any = {
        type: values.type,
        amount: values.amount,
        date: values.date.format('YYYY-MM-DD'),
      };
      if (values.name) payload.name = values.name;
      if (values.email) payload.email = values.email;
      if (values.phone) payload.phone = values.phone;
      if (values.notes) payload.notes = values.notes;
      if (values.foundationClassId) payload.foundationClassId = Number(values.foundationClassId);
      await titheAPI.record(payload);
      msg.success('Tithe recorded successfully');
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (err: any) {
      msg.error(err?.response?.data?.message || 'Failed to record tithe');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    const q = value.toLowerCase();
    setFiltered(tithes.filter((t) => (t.name || '').toLowerCase().includes(q)));
  };

  const handleDelete = (id: number) => {
    modal.confirm({
      title: 'Delete this tithe record?',
      centered: true,
      okType: 'danger',
      onOk: async () => {
        await titheAPI.delete(id);
        msg.success('Tithe deleted');
        fetchData();
      },
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: Tithe) => {
        const photo = record.member?.photo;
        return (
          <Space>
            <Avatar size={28} src={photo ? `${API_URL}${photo}` : undefined} icon={<UserOutlined />} />
            {record.name || (record.member ? `${record.member.firstName} ${record.member.lastName}` : '—')}
          </Space>
        );
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `$${Number(amount).toFixed(2)}`,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Tithe) => (
        <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
      ),
    },
  ];

  if (loading) return <Spin />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Input
          placeholder="Search by name..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ maxWidth: 280 }}
          allowClear
          onClear={() => handleSearch('')}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Record Tithe
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Record Tithe"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        okButtonProps={{ loading: isSubmitting }}
        cancelButtonProps={{ disabled: isSubmitting }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddTithe}
        >
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true }]}
            initialValue="NAMED"
          >
            <Select options={[
              { label: 'Named', value: 'NAMED' },
              { label: 'Anonymous', value: 'ANONYMOUS' },
            ]} />
          </Form.Item>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} step={0.01} />
          </Form.Item>
          <Form.Item label="Foundation Class" name="foundationClassId">
            <Select
              placeholder="Select or leave empty"
              allowClear
              options={classes}
            />
          </Form.Item>
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true }]}
            initialValue={dayjs()}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item label="Notes" name="notes">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
