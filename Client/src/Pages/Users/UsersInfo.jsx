import React, { useEffect, useState } from 'react';
import {
  Input,
  Typography,
  Table,
  Tooltip,
  message,
  Form,
  Button,
  Popconfirm
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { buildApiUrl } from '../../config';
import '../../Styles/antDesignOverride.css';
import '../../Styles/tailwindOverride.css';

const { Title } = Typography;

export default function UsersInfo() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(buildApiUrl('/api/users'));
      const data = await res.json();
      setUsers(data);
      setFiltered(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    const lower = value.toLowerCase();
    const filteredData = users.filter(
      (user) =>
        user.first_name.toLowerCase().includes(lower) ||
        user.last_name.toLowerCase().includes(lower) ||
        user.email.toLowerCase().includes(lower)
    );
    setFiltered(filteredData);
  };

  const handleDelete = async (user) => {
    try {
      const response = await fetch(buildApiUrl(`/api/users/${user.id}`), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to delete user');
      }
      messageApi.success('User deleted successfully');
      fetchUsers(); // refresh the list
    } catch (err) {
      console.error('Delete error:', err);
      messageApi.error(err.message || 'Failed to delete user');
    }
  };

  const handleEditClick = (record) => {
    setEditingUser((prev) => (prev === record.id ? null : record.id));
    form.setFieldsValue(record);
  };

  const handleSave = async () => {
    try {
      const updatedUser = await form.validateFields();

      const res = await fetch(buildApiUrl(`/api/users/${editingUser}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) throw new Error('Failed to update user');

      messageApi.success('User updated successfully');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      messageApi.error('Update failed');
    }
    
  };

  const columns = [
    {
      title: 'Profile',
      dataIndex: 'profile_image',
      key: 'profile_image',
      render: (image, record) => {
        // console.log('image src:', image)
        return image ? (
          <img
            src={buildApiUrl(`/${image}`)}
            className="h-10 w-10 rounded-full object-cover"
            alt={`${record.first_name} ${record.last_name}`}
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
            {record.first_name?.[0] || ''}{record.last_name?.[0] || ''}
          </div>
        )
      },
    },
    { title: 'First Name', dataIndex: 'first_name', key: 'first_name' },
    { title: 'Last Name', dataIndex: 'last_name', key: 'last_name' },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <a
          style={{ color: 'rgb(76,197,255)' }}
          href={`mailto:${email}`}
        >
          {email}
        </a>
      ),
    },
    { title: 'ID Number', dataIndex: 'id_number', key: 'id_number' },
    {
      title: 'More',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-3">
          <Tooltip title="Edit">
            <EditOutlined
              className="cursor-pointer"
              onClick={() => handleEditClick(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete User"
              description={`Are you sure you want to delete ${record.first_name} ${record.last_name}?`}
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined className="cursor-pointer" />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  const expandRowToEdit = () => {
    return (
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="first_name" label="First Name">
            <Input />
          </Form.Item>
          <Form.Item name="last_name" label="Last Name">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="id_number" label="ID Number">
            <Input />
          </Form.Item>
        </div>
        <div className="text-right mt-4">
          <Button onClick={() => setEditingUser(null)} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Form>
    );
  };

  return (
    <>
    {contextHolder}
      <div className="space-y-6 ">
        <div className="flex justify-between items-center">
          <Title style={{fontSize: '50px'}}>Users Information</Title>
        </div>

        <div className="p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-bold">
              Total Users: <strong>{filtered.length}</strong>
            </div>
            <div className="w-64">
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={filtered}
            rowKey="id"
            pagination={{ pageSize: 12 }}
            scroll={{ x: 'max-content' }}
            expandedRowRender={(record) =>
              record.id === editingUser ? expandRowToEdit(record) : null
            }
            expandedRowKeys={editingUser ? [editingUser] : []}
            onExpand={(expanded, record) =>
              setEditingUser(expanded ? record.id : null)
            }
            expandIcon={() => null} // hide the plus icon
          />
        </div>
      </div>
    </>
  );
} 