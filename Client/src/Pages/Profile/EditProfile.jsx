import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Upload, message, Form } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faUserTag } from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl } from '../../config';
import '../../Styles/antDesignOverride.css';

export default function EditProfile() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [profileImage, setProfileImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [uploadKey, setUploadKey] = useState(0); // Key to force Upload component re-render
  const [fileList, setFileList] = useState([]); // Track file list for Upload component

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1
      }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  useEffect(() => {
    // Get current user data from localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user) {
      navigate('/');
      return;
    }

    form.setFieldsValue({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      role: user.role || ''
    });
    setCurrentImage(user.profile_image || '');
    // Reset profileImage state when component mounts
    setProfileImage(null);
    // Reset fileList state
    setFileList([]);
    // Reset upload key to force Upload component re-render
    setUploadKey(prev => prev + 1);
  }, [navigate, form]);

  const handleImageUpload = (info) => {
    // Update fileList state
    setFileList(info.fileList);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user) {
        messageApi.error('User not found');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('first_name', form.getFieldValue('first_name'));
      formDataToSend.append('last_name', form.getFieldValue('last_name'));
      formDataToSend.append('email', form.getFieldValue('email'));
      formDataToSend.append('role', form.getFieldValue('role'));
      
      if (profileImage) {
        formDataToSend.append('profile_image', profileImage);
      }

      const response = await fetch(buildApiUrl(`/api/team-members/${user.id}`, {
        method: 'PUT',
        body: formDataToSend
      }))

      const data = await response.json();

      if (response.ok) {
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(data));
        messageApi.success('Profile updated successfully');
        // Reset profileImage and upload component for next use
        setProfileImage(null);
        setFileList([]);
        setUploadKey(prev => prev + 1);
        navigate('/dashboard');
      } else {
        messageApi.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      messageApi.error('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="min-h-screen p-8 relative overflow-hidden flex flex-col justify-center">
        <div className="absolute inset-0 z-0" />
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white mb-16 relative z-10 text-center"
        >
          <h1 className="text-4xl font-bold mb-3">Edit Profile</h1>
          <p className="text-gray-300 text-lg">Update your profile information</p>
        </motion.div>

        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="max-w-xl mx-auto relative z-10 w-full"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-16 border border-white/10 shadow-2xl">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="space-y-8"
            >
              {/* Profile Image Section */}
              <motion.div variants={inputVariants} className="text-center mb-8">
                <div className="mb-6">
                  {currentImage ? (
                    <div className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg overflow-hidden">
                      <img
                        src={buildApiUrl(`/${currentImage}`)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg bg-blue-500 flex items-center justify-center text-white text-2xl font-semibold">
                      {form.getFieldValue('first_name')?.[0] || ''}{form.getFieldValue('last_name')?.[0] || ''}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-4 justify-center">
                  <Upload
                    key={uploadKey}
                    name="profile_image"
                    showUploadList={false}
                    beforeUpload={(file) => {
                      setProfileImage(file);
                      messageApi.success('Image selected successfully');
                      return false; // Prevent automatic upload
                    }}
                    onChange={handleImageUpload}
                    fileList={fileList}
                  >
                    <Button 
                      icon={<UploadOutlined />}
                      className="h-12 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-full"
                    >
                      Upload New Image
                    </Button>
                  </Upload>
                </div>
              </motion.div>

              {/* Form Fields */}
              <motion.div variants={inputVariants}>
                <Form.Item
                  name="first_name"
                  rules={[{ required: true, message: 'Please input first name!' }]}
                  className="mb-10"
                >
                  <Input
                    prefix={<FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />}
                    placeholder="First Name"
                    className="h-12 rounded-full text-base bg-white/5 border border-white/10 text-white px-6"
                  />
                </Form.Item>
              </motion.div>

              <motion.div variants={inputVariants}>
                <Form.Item
                  name="last_name"
                  rules={[{ required: true, message: 'Please input last name!' }]}
                  className="mb-10"
                >
                  <Input
                    prefix={<FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />}
                    placeholder="Last Name"
                    className="h-12 rounded-full text-base bg-white/5 border border-white/10 text-white px-6"
                  />
                </Form.Item>
              </motion.div>

              <motion.div variants={inputVariants}>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Please input email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                  className="mb-10"
                >
                  <Input
                    prefix={<FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-2" />}
                    placeholder="Email"
                    className="h-12 rounded-full text-base bg-white/5 border border-white/10 text-white px-6"
                  />
                </Form.Item>
              </motion.div>

              <motion.div variants={inputVariants}>
                <Form.Item
                  name="role"
                  className="mb-12"
                >
                  <Input
                    prefix={<FontAwesomeIcon icon={faUserTag} className="text-gray-400 mr-2" />}
                    placeholder="Role"
                    disabled
                    className="h-12 rounded-full text-base bg-white/5 border border-white/10 text-white px-6 opacity-50"
                  />
                </Form.Item>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                variants={inputVariants}
                className="flex gap-4 pt-6"
              >
                <Button
                  type="default"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 h-12 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 border-none rounded-full text-white font-medium text-base transition-all duration-300"
                >
                  Update Profile
                </Button>
              </motion.div>
            </Form>
          </div>
        </motion.div>
      </div>
    </>
  );
} 