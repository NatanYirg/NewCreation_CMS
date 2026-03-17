'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  Select,
  Button,
  Modal,
  Form,
  Spin,
  Alert,
  Space,
  Table,
  Input,
  Avatar,
  App,
} from 'antd';
import { PlusOutlined, DeleteOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { api } from '@/lib/api';

interface FamilyRelation {
  relationshipId: number;
  relationType: string;
  memberId: number;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Family() {
  const { modal, message: msg } = App.useApp();
  const [members, setMembers] = useState<{ label: string; value: number; photo?: string }[]>([]);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyRelation[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await api.get('/members');
      setMembers(response.data.map((m: any) => ({
        label: `${m.firstName} ${m.lastName}`,
        value: m.id,
        photo: m.photo,
      })));
    } catch (err) {
      msg.error('Failed to load members');
      console.error(err);
    }
  };

  const fetchFamilyMembers = async (memberId: number) => {
    try {
      setLoading(true);
      const response = await api.get(`/family/member/${memberId}`);
      setFamilyMembers(response.data);
      setSearch('');
    } catch (err) {
      msg.error('Failed to load family members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleMemberSelect = (memberId: number) => {
    setSelectedMember(memberId);
    fetchFamilyMembers(memberId);
  };

  const handleAddRelationship = async (values: any) => {
    try {
      await api.post('/family/relationships', {
        memberId1: selectedMember,
        memberId2: values.relatedMemberId,
        relationType: values.relationType,
      });
      setIsModalOpen(false);
      form.resetFields();
      msg.success('Relationship added');
      if (selectedMember) fetchFamilyMembers(selectedMember);
    } catch (err) {
      msg.error('Failed to add relationship');
      console.error(err);
    }
  };

  const handleDeleteRelationship = (relationshipId: number) => {
    modal.confirm({
      title: 'Delete this relationship?',
      centered: true,
      okType: 'danger',
      onOk: async () => {
        await api.delete(`/family/relationships/${relationshipId}`);
        msg.success('Relationship deleted');
        if (selectedMember) fetchFamilyMembers(selectedMember);
      },
    });
  };

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_: any, record: FamilyRelation) => {
        const memberInfo = members.find((m) => m.value === record.memberId);
        return (
          <Space>
            <Avatar size={28} src={memberInfo?.photo ? `${API_URL}${memberInfo.photo}` : undefined} icon={<UserOutlined />} />
            {`${record.firstName} ${record.lastName}`}
          </Space>
        );
      },
    },
    {
      title: 'Relationship',
      key: 'relationType',
      render: (_: any, record: FamilyRelation) => record.relationType || 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: FamilyRelation) => (
        <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleDeleteRelationship(record.relationshipId)} />
      ),
    },
  ];

  return (
    <div>
      <Card title="Family Mapping" style={{ marginBottom: '16px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
              disabled={!selectedMember}
            >
              Add Family Relationship
            </Button>
            <Input
              placeholder="Search members..."
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ maxWidth: 280 }}
              allowClear
              onClear={() => handleSearch('')}
            />
          </div>
          <div>
            <label>Select Member:</label>
            <Select
              placeholder="Choose a member"
              options={members.filter((m) => !search || m.label.toLowerCase().includes(search.toLowerCase()))}
              onChange={handleMemberSelect}
              style={{ width: '100%', marginTop: '8px' }}
              showSearch
              optionFilterProp="label"
              value={selectedMember}
            />
          </div>
        </Space>
      </Card>

      {selectedMember && (
        <Card title="Family Members">
          {loading ? (
            <Spin />
          ) : familyMembers.length > 0 ? (
            <Table
              columns={columns}
              dataSource={familyMembers}
              rowKey="relationshipId"
              pagination={false}
            />
          ) : (
            <Alert message="No family members found" type="info" />
          )}
        </Card>
      )}

      <Modal
        title="Add Family Relationship"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddRelationship}
        >
          <Form.Item
            label="Related Member"
            name="relatedMemberId"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Choose a member"
              options={members.filter((m: any) => m.value !== selectedMember)}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.Item
            label="Relationship Type"
            name="relationType"
            rules={[{ required: true }]}
          >
            <Select options={[
              { label: 'Spouse', value: 'SPOUSE' },
              { label: 'Parent', value: 'PARENT' },
              { label: 'Child', value: 'CHILD' },
              { label: 'Sibling', value: 'SIBLING' },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
