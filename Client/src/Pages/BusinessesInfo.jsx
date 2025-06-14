import React, { useEffect, useState } from 'react';
import { Input, Typography, Table, Tooltip, Drawer, Form, Button, message, Popconfirm } from 'antd';
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
      messageApi.error('Failed to fetch dive clubs');
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

  const handleDelete = async (club) => {
    try {
      const response = await fetch(`http://localhost:5001/api/dive-clubs/${club.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Delete failed');
      }
      messageApi.success('Dive club deleted successfully');
      fetchClubs(); // refresh the list
    } catch (err) {
      console.error(err);
      messageApi.error(err.message || 'Failed to delete dive club');
    }
  };

  const handleEditClick = (record) => {
    setEditingClub((prev) => (prev === record.id ? null : record.id));
    form.setFieldsValue(record);
  };

  const handleSave = async () => {
    try {
      const updatedClub = await form.validateFields();

      const res = await fetch(`http://localhost:5001/api/dive-clubs/${editingClub}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedClub),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update dive club');
      }

      messageApi.success('Dive club updated successfully');
      setEditingClub(null);
      fetchClubs();
    } catch (err) {
      console.error(err);
      messageApi.error(err.message || 'Failed to update dive club');
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
            <Popconfirm
              title="Delete Dive Club"
              description={`Are you sure you want to delete ${record.name}?`}
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

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
      <div className="space-y-6 min-w-0 overflow-hidden">
        <div className="flex justify-between items-center">
          <Title style={{fontSize: '50px'}}>Dive clubs Information</Title>
        </div>

        <div className="p-4 rounded shadow min-w-0">
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
            className="overflow-x-auto"
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