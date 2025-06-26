import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input, Button, Form, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faMapMarkerAlt, faPhone, faGlobe, faFileText } from '@fortawesome/free-solid-svg-icons';

const AddBusiness = () => {
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
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/dive-clubs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        messageApi.success('Business added successfully!');
        form.resetFields();
      } else {
        throw new Error('Failed to add business');
      }
    } catch (error) {
      messageApi.error('Error adding business: ' + error.message);
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
        <h1 className="text-4xl font-bold mb-3">Add New Business</h1>
        <p className="text-gray-300 text-lg">Register a new dive club or business in the system</p>
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
                name="name"
                rules={[{ required: true, message: 'Please enter the business name!' }]}
                className="mb-10"
              >
                <Input
                  prefix={<FontAwesomeIcon icon={faBuilding} className="text-gray-400 mr-2" />}
                  placeholder="Business Name"
                  className="h-12 rounded-full text-base bg-white/5 border border-white/10 text-white px-6"
                />
              </Form.Item>
            </motion.div>

            <motion.div variants={inputVariants}>
              <Form.Item
                name="city"
                rules={[{ required: true, message: 'Please enter the city!' }]}
                className="mb-10"
              >
                <Input
                  prefix={<FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mr-2" />}
                  placeholder="City"
                  className="h-12 rounded-full text-base bg-white/5 border border-white/10 text-white px-6"
                />
              </Form.Item>
            </motion.div>

            <motion.div variants={inputVariants}>
              <Form.Item
                name="address"
                rules={[{ required: true, message: 'Please enter the address!' }]}
                className="mb-10"
              >
                <Input
                  prefix={<FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mr-2" />}
                  placeholder="Address"
                  className="h-12 rounded-full text-base bg-white/5 border border-white/10 text-white px-6"
                />
              </Form.Item>
            </motion.div>

            <motion.div variants={inputVariants}>
              <Form.Item
                name="phone"
                rules={[{ required: true, message: 'Please enter the phone number!' }]}
                className="mb-10"
              >
                <Input
                  prefix={<FontAwesomeIcon icon={faPhone} className="text-gray-400 mr-2" />}
                  placeholder="Phone Number"
                  className="h-12 rounded-full text-base bg-white/5 border border-white/10 text-white px-6"
                />
              </Form.Item>
            </motion.div>

            <motion.div variants={inputVariants}>
              <Form.Item
                name="website"
                className="mb-10"
              >
                <Input
                  prefix={<FontAwesomeIcon icon={faGlobe} className="text-gray-400 mr-2" />}
                  placeholder="Website (optional)"
                  className="h-12 rounded-full text-base bg-white/5 border border-white/10 text-white px-6"
                />
              </Form.Item>
            </motion.div>

            <motion.div variants={inputVariants}>
              <Form.Item
                name="description"
                className="mb-12"
              >
                <Input.TextArea
                  prefix={<FontAwesomeIcon icon={faFileText} className="text-gray-400 mr-2" />}
                  placeholder="Description (optional)"
                  rows={4}
                  className="rounded-2xl text-base bg-white/5 border border-white/10 text-white px-6 py-3"
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
                Add Business
              </Button>
            </motion.div>
          </Form>
        </div>
      </motion.div>
    </div>
    </>
  );
};

export default AddBusiness; 