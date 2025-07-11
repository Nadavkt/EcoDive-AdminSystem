import React, { useEffect, useState } from 'react';
import { Input, Typography, Select, Card, Avatar, Tooltip, Popconfirm, message, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import EditTeamMember from './EditTeamMember';
import { buildApiUrl } from '../../config';
import '../../Styles/antDesignOverride.css';

const { Title } = Typography;
const { Option } = Select;

export default function TeamManagement() {
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const [userRole, setUserRole] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetchTeam();
    // Get current user data from localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    setCurrentUser(user);
    setUserRole(user?.role || '');
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await fetch(buildApiUrl('/api/team-members'));
      const data = await res.json();
      setMembers(data);
      setFiltered(data);
    } catch (err) {
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    const filteredData = members.filter(
      m =>
        m.email.toLowerCase().includes(value.toLowerCase()) ||
        `${m.first_name} ${m.last_name}`.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(filteredData);
  };

  const handleDelete = async (member) => {
    try {
      const response = await fetch(buildApiUrl(`/api/team-members/${member.id}`), {
        method: 'DELETE',
      });
      
      if (response.ok) {
        messageApi.success(`Teammate ${member.first_name} has been deleted`);
        setMembers(members.filter(m => m.id !== member.id));
        setFiltered(filtered.filter(m => m.id !== member.id));
      }
    } catch (err) {
      console.error('Error deleting team member:', err);
      messageApi.error('Error deleting team member:', err);
    }
  };

  const handleEditClick = (member) => {
    setSelectedMember(member);
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setSelectedMember(null);
  };

  const handleEditSuccess = () => {
    setIsEditModalVisible(false);
    setSelectedMember(null);
    fetchTeam(); // Refresh the team list
  };

  // Check if current user is admin (handle both 'Admin' and 'admin' cases)
  const isAdmin = userRole?.toLowerCase() === 'admin';

  // Check if a member is the current logged-in user
  const isCurrentUser = (member) => {
    return currentUser && member.id === currentUser.id;
  };

  return (
    <>
      {contextHolder}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Title style={{fontSize: '50px'}}>Team Management</Title>
        </div>

        <div className="p-4 rounded shadow">
          <div className="flex justify-between items-center mb-8">
            <div className="text-sm font-bold">
              Total Members: <strong>{filtered.length}</strong>
            </div>
            <div className="flex gap-4">
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
                <Option value="Viewer">Viewer</Option>
              </Select>
            </div>
          </div>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} spinning={loading}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-20">
              {filtered.map(member => (
                <Card
                  key={member.id}
                  className="relative overflow-visible hover:shadow-lg transition-shadow duration-300 !bg-transparent"
                  body={{ 
                    padding: '24px', 
                    backgroundColor: 'transparent',
                    border: 'none'
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none'
                  }}
                >
                  <div className="flex flex-col items-center">
                    {/* Avatar positioned half in, half out */}
                    <div className="relative -mt-16 mb-4">
                      <Avatar
                        src={member.profile_image ? `${buildApiUrl('')}/${member.profile_image}` : undefined}
                        size={80}
                        className="border-4 border-white shadow-lg"
                      >
                        {!member.profile_image && `${member.first_name?.[0] || ''}${member.last_name?.[0] || ''}`}
                      </Avatar>
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-semibold text-center mb-1">
                      {member.first_name} {member.last_name}
                    </h3>

                    {/* Email */}
                    <p className="text-gray-400 text-sm mb-1">
                      {member.email}
                    </p>

                    {/* Role */}
                    <p className="text-gray-400 text-sm mb-4">
                      {member.role}
                    </p>

                    {/* Action buttons - only show for admin users and not for current user */}
                    {isAdmin && !isCurrentUser(member) && (
                      <div className="flex gap-4 mt-2">
                        <Tooltip title="Edit">
                          <button 
                            className="p-2 transition-colors"
                            onClick={() => handleEditClick(member)}
                          >
                            <EditOutlined className="text-xl" />
                          </button>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <Popconfirm
                            title="Delete Team Member"
                            description={`Are you sure you want to delete ${member.first_name} ${member.last_name}?`}
                            onConfirm={() => handleDelete(member)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <button className="p-2 transition-colors">
                              <DeleteOutlined className="text-xl" />
                            </button>
                          </Popconfirm>
                        </Tooltip>
                      </div>
                    )}

                    {/* Show indicator for current user */}
                    {isCurrentUser(member) && (
                      <div className="mt-2">
                        <span className="text-blue-500 text-sm font-medium">(You)</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Spin>
        </div>

        {/* Edit Team Member Modal */}
        <EditTeamMember
          isModalVisible={isEditModalVisible}
          onCancel={handleEditCancel}
          onSuccess={handleEditSuccess}
          memberData={selectedMember}
        />
      </div>
    </>
  );
}