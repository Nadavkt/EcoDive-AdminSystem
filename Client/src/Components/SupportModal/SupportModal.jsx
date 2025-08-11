import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { SendOutlined, CloseOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const SupportModal = ({ isVisible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const supportCategories = [
    { value: 'general', label: 'General Question', icon: '❓' },
    { value: 'bug', label: 'Bug Report', icon: '🐛' },
    { value: 'feature', label: 'Feature Request', icon: '💡' },
    { value: 'help', label: 'Help & Support', icon: '🆘' },
    { value: 'feedback', label: 'Feedback', icon: '📝' },
    { value: 'technical', label: 'Technical Issue', icon: '🔧' }
  ];

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('/api/support/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          currentPage: window.location.pathname
        }),
      });

      if (response.ok) {
        messageApi.success('Message sent successfully! We\'ll get back to you soon.');
        form.resetFields();
        onClose();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending support message:', error);
      messageApi.error('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <span className="text-2xl">❓</span>
            <span className="text-lg font-semibold">Contact Support</span>
          </div>
        }
        open={isVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        centered
        className="support-modal"
      >
        <div className="py-4">
          <p className="text-gray-600 mb-6">
            Need help? Have a question? Found a bug? Want to suggest a new feature? 
            We're here to help! Send us a message and we'll get back to you as soon as possible.
          </p>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              category: 'general',
              priority: 'medium'
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select a category' }]}
              >
                <Select placeholder="Select category">
                  {supportCategories.map(category => (
                    <Option key={category.value} value={category.value}>
                      <span className="flex items-center space-x-2">
                        <span>{category.icon}</span>
                        <span>{category.label}</span>
                      </span>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true, message: 'Please select priority' }]}
              >
                <Select placeholder="Select priority">
                  <Option value="low">
                    <span className="flex items-center space-x-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <span>Low</span>
                    </span>
                  </Option>
                  <Option value="medium">
                    <span className="flex items-center space-x-2">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                      <span>Medium</span>
                    </span>
                  </Option>
                  <Option value="high">
                    <span className="flex items-center space-x-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      <span>High</span>
                    </span>
                  </Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item
              name="subject"
              label="Subject"
              rules={[
                { required: true, message: 'Please enter a subject' },
                { min: 5, message: 'Subject must be at least 5 characters' }
              ]}
            >
              <Input 
                placeholder="Brief description of your inquiry"
                maxLength={100}
                showCount
              />
            </Form.Item>

            <Form.Item
              name="message"
              label="Message"
              rules={[
                { required: true, message: 'Please enter your message' },
                { min: 20, message: 'Message must be at least 20 characters' }
              ]}
            >
              <TextArea
                placeholder="Please provide detailed information about your inquiry, question, or issue..."
                rows={6}
                maxLength={1000}
                showCount
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Your Email (Optional)"
              rules={[
                { type: 'email', message: 'Please enter a valid email address' }
              ]}
            >
              <Input 
                placeholder="your.email@example.com"
                addonBefore="📧"
              />
            </Form.Item>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button 
                onClick={handleCancel}
                icon={<CloseOutlined />}
                size="large"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SendOutlined />}
                size="large"
                className="bg-blue-500 hover:bg-blue-600"
              >
                Send Message
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default SupportModal;
