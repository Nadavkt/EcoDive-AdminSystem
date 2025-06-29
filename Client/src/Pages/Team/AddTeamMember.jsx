import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input, Button, Upload, message, Form, Select } from 'antd';
import { UploadOutlined, UserAddOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl } from '../../config';
import '../../Styles/antDesignOverride.css';

const { Option } = Select;

export default function AddTeamMember() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

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

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key === 'profile_image' && profileImage) {
          formData.append(key, profileImage);
        } else {
          formData.append(key, values[key]);
        }
      });

      const response = await fetch(buildApiUrl('/api/team-members'), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add team member');
      }

      messageApi.success('Team member added successfully');
      form.resetFields();
      setProfileImage(null);
    } catch (error) {
      messageApi.error('Failed to add team member: ' + error.message);
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
          <h1 className="text-4xl font-bold mb-3">Add Team Member</h1>
          <p className="text-gray-300 text-lg">Such an amazing to add new member to our team</p>
        </motion.div>

        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="max-w-xl mx-auto relative z-10 w-full"
        >
          <div data-test='form' className="bg-white/10 backdrop-blur-lg rounded-2xl p-16 border border-white/10 shadow-2xl">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="space-y-8"
              autoComplete='off'
            >
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
                  name="password"
                  rules={[
                    { required: true, message: 'Please input password!' },
                    { min: 8, message: 'Password must be at least 8 characters!' }
                  ]}
                  className="mb-10"
                >
                  <Input.Password
                    prefix={<FontAwesomeIcon icon={faLock} className="text-gray-400 mr-2" />}
                    placeholder="Password"
                    className="h-12 rounded-full text-base bg-white/5 border border-white/10 text-white px-6"
                  />
                </Form.Item>
              </motion.div>

              <motion.div variants={inputVariants}>
                <Form.Item
                  name="role"
                  rules={[{ required: true, message: 'Please select a role!' }]}
                  className="mb-10"
                >
                  <Select
                    placeholder="Select role"
                    className="h-12 rounded-full text-base bg-white/5 border border-white/10 text-white"
                    classNames={{
                      popup: {
                        root: "bg-white/10 backdrop-blur-lg border border-white/10"
                      }
                    }}
                  >
                    <Option value="Admin">Admin</Option>
                    <Option value="Viewer">Viewer</Option>
                  </Select>
                </Form.Item>
              </motion.div>

              <motion.div variants={inputVariants}>
                <Form.Item
                  name="profile_image"
                  label="Profile Image"
                  valuePropName="file"
                  getValueFromEvent={e => e && e.fileList && e.fileList[0]}
                  rules={[
                    { required: false },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        const isJpgOrPng = value.type === 'image/jpeg' || value.type === 'image/png' || value.type === 'image/jpg';
                        if (!isJpgOrPng) {
                          return Promise.reject(new Error('Only JPG/PNG files are allowed!'));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                  className="mb-12"
                >
                  <Upload
                    beforeUpload={file => {
                      setProfileImage(file);
                      return false; // Prevent automatic upload
                    }}
                    accept=".jpg,.jpeg,.png"
                    maxCount={1}
                    showUploadList={{ showRemoveIcon: true }}
                    onRemove={() => setProfileImage(null)}
                  >
                    <Button 
                      icon={<UploadOutlined />}
                      className="h-12 w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-full"
                    >
                      Select Image (JPG/PNG)
                    </Button>
                  </Upload>
                </Form.Item>
              </motion.div>

              <motion.div
                variants={inputVariants}
                className="flex justify-center pt-6"
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<UserAddOutlined />}
                  className="submit-button h-12 w-full bg-blue-500 hover:bg-blue-600 border-none rounded-full text-white font-medium text-base transition-all duration-300"
                >
                  Add Team Member
                </Button>
              </motion.div>
            </Form>
          </div>
        </motion.div>
      </div>
    </>
  );
} 