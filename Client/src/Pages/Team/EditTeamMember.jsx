import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faUserTag } from '@fortawesome/free-solid-svg-icons';

const { Option } = Select;

const EditTeamMember = ({ isModalVisible, onCancel, onSuccess, memberData }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (memberData && isModalVisible) {
      form.setFieldsValue({
        first_name: memberData.first_name,
        last_name: memberData.last_name,
        email: memberData.email,
        role: memberData.role
      });
    }
  }, [memberData, isModalVisible, form]);

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(`http://localhost:5001/api/team-members/${memberData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update team member');
      }

      messageApi.success('Team member updated successfully');
      form.resetFields();
      onSuccess();
    } catch (error) {
      messageApi.error(`Failed to update team member: ${error.message}`);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Edit Team Member"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="edit-team-member-modal"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4 space-y-6"
          size="large"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <Form.Item
              name="first_name"
              rules={[{ required: true, message: 'Please input first name!' }]}
              className="mb-6"
            >
              <Input
                prefix={<FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />}
                placeholder="First Name"
                className="h-12 text-lg"
              />
            </Form.Item>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <Form.Item
              name="last_name"
              rules={[{ required: true, message: 'Please input last name!' }]}
              className="mb-6"
            >
              <Input
                prefix={<FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />}
                placeholder="Last Name"
                className="h-12 text-lg"
              />
            </Form.Item>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
              className="mb-6"
            >
              <Input
                prefix={<FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-2" />}
                placeholder="Email"
                className="h-12 text-lg"
              />
            </Form.Item>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <Form.Item
              name="role"
              rules={[{ required: true, message: 'Please select a role!' }]}
              className="mb-6"
            >
              <Select
                placeholder="Select role"
                className="h-12 text-lg"
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
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button 
              onClick={handleCancel}
              size="large"
              className="h-12 px-8 text-lg"
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              size="large"
              className="h-12 px-8 text-lg"
            >
              Update Member
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default EditTeamMember; 