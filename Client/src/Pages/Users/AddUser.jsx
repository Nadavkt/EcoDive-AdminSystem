import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input, Button, Form, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faIdCard, faLock } from '@fortawesome/free-solid-svg-icons';

const AddUser = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
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
    //console.log('Form submitted with values:', values); // Debug log
    setLoading(true);
    
    try {
      //console.log('Sending data to server:', values); // Debug log

      const response = await fetch('http://localhost:5001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      //console.log('Response status:', response.status); // Debug log
      //console.log('Response headers:', Object.fromEntries(response.headers.entries())); // Debug log

      if (response.ok) {
        // const responseData = await response.json();
        // console.log('Success response:', responseData); // Debug log
        messageApi.success('User added successfully!');
        form.resetFields();
      } else {
        // Get the error message from the response
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        console.log('Error response:', errorData); // Debug log
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Request failed:', error); // Debug log
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        messageApi.error('Cannot connect to server. Please check if the server is running on http://localhost:5001');
      } else {
        messageApi.error('Error adding user: ' + error.message);
      }
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
        <h1 className="text-4xl font-bold mb-3">Add New User</h1>
        <p className="text-gray-300 text-lg">Create a new user account in the system</p>
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
            onFinish={onFinish}
            className="space-y-8"
          >
            <motion.div variants={inputVariants}>
              <Form.Item
                name="firstName"
                rules={[{ required: true, message: 'Please enter your first name!' }]}
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
                name="lastName"
                rules={[{ required: true, message: 'Please enter your last name!' }]}
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
                  { required: true, message: 'Please enter your email!' },
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
                name="idNumber"
                rules={[{ required: true, message: 'Please enter your ID number!' }]}
                className="mb-10"
              >
                <Input
                  prefix={<FontAwesomeIcon icon={faIdCard} className="text-gray-400 mr-2" />}
                  placeholder="ID Number"
                  className="h-12 rounded-full text-base bg-white/5 border border-white/10 text-white px-6"
                />
              </Form.Item>
            </motion.div>

            <motion.div variants={inputVariants}>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please enter your password!' }]}
                className="mb-12"
              >
                <Input.Password
                  prefix={<FontAwesomeIcon icon={faLock} className="text-gray-400 mr-2" />}
                  placeholder="Password"
                  className="h-12 rounded-full text-base bg-white/5 border border-white/10 text-white px-6"
                />
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
                className="submit-button h-12 w-full bg-blue-500 hover:bg-blue-600 border-none rounded-full text-white font-medium text-base transition-all duration-300"
              >
                Add User
              </Button>
            </motion.div>
          </Form>
        </div>
      </motion.div>
    </div>
    </>
  );
};

export default AddUser; 