import React, { useEffect, useState } from 'react';
import { Input, List, Avatar, Typography, Select } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import '../Styles/antDesignOverride.css';

const { Title } = Typography;
const { Option } = Select;

export default function TeamManagement() {
  const [members, setMembers] = useState([]); // For creating new members
  const [filtered, setFiltered] = useState([]); // for choosing the kind of filtering the admin want 
  const [search, setSearch] = useState(''); // for searching what the client want 
  // const [role, setRole] = useState('Admin'); // Simulating logged-in role for now

  // Fetch team members from backend
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/team-members');
        const data = await res.json();
        setMembers(data);
        setFiltered(data);
      } catch (err) {
        console.error('Error fetching team members:', err);
      }
    };
    fetchTeam();
  }, []);

  //Search filter
  const handleSearch = (value) => {
    setSearch(value);
    const filteredData = members.filter(
      m =>
        m.email.toLowerCase().includes(value.toLowerCase()) ||
        `${m.first_name} ${m.last_name}`.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(filteredData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title style={{fontSize: '50px'}}>Team Management</Title>
        {/* <Tooltip title={role !== 'Admin' ? 'Only Admins can add members' : ''}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={role !== 'Admin'}
          >
            Add Member
          </Button>
        </Tooltip> */}
      </div>

      <div className=" p-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-bold">
            Total Members: <strong>{filtered.length}</strong>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-64"
            />
            <Select
              defaultValue="All"
              onChange={(value) => {
                const filteredRole = value === 'All' ? members : members.filter(m => m.role === value);
                setFiltered(filteredRole);
              }}
              className="w-40"
            >
              <Option value="All">All Roles</Option>
              <Option value="Admin">Admin</Option>
              <Option value="Editor">Editor</Option>
              <Option value="Viewer">Viewer</Option>
            </Select>
          </div>
        </div>

        <List
          itemLayout="horizontal"
          dataSource={filtered}
          renderItem={member => (
            <List.Item
              actions={[<MoreOutlined key="more" style={{ fontSize: '18px' }} />]}
            >
              <List.Item.Meta
                avatar={<Avatar src={member.profile_image || ''} />}
                title={`${member.first_name} ${member.last_name}`}
                description={
                  <>
                    <div className='text-white'>{member.email}</div>
                    <div className="text-sm text-white">{member.role}</div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}