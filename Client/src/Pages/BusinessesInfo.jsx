import React, { useEffect, useState } from 'react';
import { Input, Typography, Table, Tooltip, Drawer, Form, Button, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import '../Styles/antDesignOverride.css'

const { Title } = Typography;

export default function BusinessesInfo() {
  const [clubs, setClubs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [editingClub, setEditingClub] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch dive clubs from backend
  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/dive-clubs');
      const data = await res.json();
      setClubs(data);
      setFiltered(data);
    } catch (err) {
      console.error('Error fetching dive clubs:', err);
    }
  };

  // Search filter by name or city
  const handleSearch = (value) => {
    setSearch(value);
    const filteredData = clubs.filter(
      (club) =>
        club.name.toLowerCase().includes(value.toLowerCase()) ||
        club.city.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(filteredData);
  };

  const handleDelete = (club) => {
  
    // Confirm dialog using native window.confirm for now
    if (window.confirm(`Delete ${club.name}?`)) {
      fetch(`http://localhost:5001/api/users/${club.id}`, {
        method: 'DELETE',
      })
        .then(async (res) => {
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Delete failed');
          }
          messageApi.success('User deleted successfully');
          fetchClubs(); // refresh the list
        })
        .catch((err) => {
          console.error(err);
          messageApi.error(err.message || 'Delete failed');
        });
    }
  };

  const handleEditClick = (record) => {
    setEditingClub((prev) => (prev === record.id ? null : record.id));
    form.setFieldsValue(record);
  };

  const handleSave = async () => {
    try {
      const updatedUser = await form.validateFields();

      const res = await fetch(`http://localhost:5001/api/users/${editingClub}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) throw new Error('Failed to update user');

      messageApi.success('User updated successfully');
      setEditingClub(null);
      fetchClubs();
    } catch (err) {
      console.error(err);
      messageApi.error('Update failed');
    }
    
  };

  // Columns definition for the table
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'City', dataIndex: 'city', key: 'city' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      render: (url) => (
        <a style={{color: ' rgb(76,197,255)'}} href={url} target="_blank" rel="noreferrer">
          {url}
        </a>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <Tooltip title={text}>
          <span className="line-clamp-1 truncate max-w-xs">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'More',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-3">
          <Tooltip title="Edit">
            <EditOutlined
              onClick={() => handleEditClick(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  // const handleEdit = (user) => {
  //   setEditingClub(user);
  //   form.setFieldsValue(user);
  // };

  // const handleDelete = (user) => {
  //   console.log('Delete clicked:', user);
  //   // Add delete logic here later
  // };

  // const handleSave = async () => {
  //   try {
  //     const updatedClub = await form.validateFields();
  //     const res = await fetch(`http://localhost:5001/api/users/${editingClub.id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(updatedClub),
  //     });

  //     if (!res.ok) throw new Error('Failed to update user');

  //     message.success('Club updated successfully');
  //     setEditingClub(null);
  //     fetchClubs(); // refresh data
  //   } catch (err) {
  //     console.error(err);
  //     message.error('Update failed');
  //   }
  // };

  const expandRowToEdit = () => {
    return (
        <Form layout="vertical" form={form}>
          <div className='grid grid-cols-2 gap-4'>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="city" label="City" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Address" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="website" label="Website" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </div>

          <div className="text-right">
            <Button onClick={() => setEditingClub(null)} style={{ marginRight: 8 }}>
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Title level={1}>Dive clubs Information</Title>
        </div>

        <div className="p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-bold">
              Total Clubs: <strong>{filtered.length}</strong>
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
              record.id === editingClub ? expandRowToEdit(record) : null
            }
            expandedRowKeys={editingClub ? [editingClub] : []}
            onExpand={(expanded, record) =>
              setEditingClub(expanded ? record.id : null)
            }
            expandIcon={() => null} // hide the plus icon
          />
        </div>
      </div>
    </>
  );
}