'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  Spin,
  Alert,
  Space,
  Table,
  Checkbox,
  Input,
  message,
  App,
  Avatar,
} from 'antd';
import { PlusOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { attendanceAPI, foundationClassesAPI } from '@/lib/api';
import dayjs from 'dayjs';

interface Member {
  id: number;
  memberId?: number;
  firstName: string;
  lastName: string;
  present?: boolean;
}

interface Session {
  id: number;
  foundationClassId: number;
  sessionDate: string;
  notes?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Attendance() {
  const { message: msg } = App.useApp();
  const [classes, setClasses] = useState<{ label: string; value: number }[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [sessionSearch, setSessionSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [roster, setRoster] = useState<Member[]>([]);
  const [filteredRoster, setFilteredRoster] = useState<Member[]>([]);
  const [rosterSearch, setRosterSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [rosterForm] = Form.useForm();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await foundationClassesAPI.getAll();
      setClasses(response.data.map((c: any) => ({ label: c.name, value: c.id })));
    } catch (err) {
      msg.error('Failed to load foundation classes');
      console.error(err);
    }
  };

  const fetchSessions = async (classId: number) => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getSessionsByClass(classId);
      setSessions(response.data);
      setFilteredSessions(response.data);
      setSessionSearch('');
    } catch (err) {
      msg.error('Failed to load sessions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoster = async (sessionId: number) => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getRoster(sessionId);
      setRoster(response.data);
      setFilteredRoster(response.data);
      setRosterSearch('');
    } catch (err) {
      msg.error('Failed to load roster');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionSearch = (value: string) => {
    setSessionSearch(value);
    setFilteredSessions(sessions.filter((s) =>
      new Date(s.sessionDate).toLocaleDateString().includes(value) ||
      (s.notes || '').toLowerCase().includes(value.toLowerCase())
    ));
  };

  const handleRosterSearch = (value: string) => {
    setRosterSearch(value);
    const q = value.toLowerCase();
    setFilteredRoster(roster.filter((m) =>
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(q)
    ));
  };

  const handleCreateSession = async (values: any) => {
    try {
      await attendanceAPI.createSession(selectedClass!, values.sessionDate.format('YYYY-MM-DD'), values.notes);
      setIsSessionModalOpen(false);
      form.resetFields();
      msg.success('Session created');
      if (selectedClass) fetchSessions(selectedClass);
    } catch (err) {
      msg.error('Failed to create session');
      console.error(err);
    }
  };

  const handleSubmitAttendance = async (values: any) => {
    try {
      const records = roster.map((member) => ({
        memberId: member.memberId ?? member.id,
        present: values[`member_${member.memberId ?? member.id}`] || false,
      }));
      await attendanceAPI.recordBulk(selectedSession!, records);
      setIsRosterModalOpen(false);
      msg.success('Attendance recorded');
      if (selectedSession) fetchRoster(selectedSession);
    } catch (err) {
      msg.error('Failed to record attendance');
      console.error(err);
    }
  };

  const handleClassChange = (classId: number) => {
    setSelectedClass(classId);
    setSelectedSession(null);
    setSessions([]);
    setRoster([]);
    fetchSessions(classId);
  };

  const handleSessionSelect = (sessionId: number) => {
    setSelectedSession(sessionId);
    fetchRoster(sessionId);
    setIsRosterModalOpen(true);
  };

  return (
    <div>
      <Card title="Attendance Management" style={{ marginBottom: '16px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <label>Select Foundation Class:</label>
            <Select
              placeholder="Choose a foundation class"
              options={classes}
              onChange={handleClassChange}
              style={{ width: '100%', marginTop: '8px' }}
            />
          </div>

          {selectedClass && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsSessionModalOpen(true)}
            >
              Create New Session
            </Button>
          )}
        </Space>
      </Card>

      {selectedClass && sessions.length > 0 && (
        <Card title="Sessions" style={{ marginBottom: '16px' }}>
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span />
            <Input placeholder="Search sessions..." prefix={<SearchOutlined />} value={sessionSearch} onChange={(e) => handleSessionSearch(e.target.value)} style={{ maxWidth: 280 }} allowClear onClear={() => handleSessionSearch('')} />
          </div>
          <Table
            columns={[
              { title: 'Date', dataIndex: 'sessionDate', key: 'sessionDate', render: (date: string) => new Date(date).toLocaleDateString() },
              { title: 'Notes', dataIndex: 'notes', key: 'notes' },
              {
                title: 'Actions', key: 'actions',
                render: (_: any, record: Session) => (
                  <Button type="primary" size="small" onClick={() => handleSessionSelect(record.id)}>Mark Attendance</Button>
                ),
              },
            ]}
            dataSource={filteredSessions}
            rowKey="id"
            pagination={false}
          />
        </Card>
      )}

      <Modal
        title="Create New Session"
        open={isSessionModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsSessionModalOpen(false)}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSession}
        >
          <Form.Item
            label="Session Date"
            name="sessionDate"
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

      <Modal
        title="Mark Attendance"
        open={isRosterModalOpen}
        onOk={() => rosterForm.submit()}
        onCancel={() => setIsRosterModalOpen(false)}
        width={600}
      >
        {loading ? (
          <Spin />
        ) : (
          <>
            <Input
              placeholder="Search members..."
              prefix={<SearchOutlined />}
              value={rosterSearch}
              onChange={(e) => handleRosterSearch(e.target.value)}
              style={{ marginBottom: 12 }}
              allowClear
              onClear={() => handleRosterSearch('')}
            />
            <Form form={rosterForm} layout="vertical" onFinish={handleSubmitAttendance}>
              {filteredRoster.map((member) => {
                const key = member.memberId ?? member.id;
                return (
                  <Form.Item key={key} name={`member_${key}`} valuePropName="checked" initialValue={member.present || false}>
                    <Checkbox>
                      <Space>
                        <Avatar size={24} src={(member as any).photo ? `${API_URL}${(member as any).photo}` : undefined} icon={<UserOutlined />} />
                        {member.firstName} {member.lastName}
                      </Space>
                    </Checkbox>
                  </Form.Item>
                );
              })}
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
}
