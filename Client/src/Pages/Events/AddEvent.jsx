import React from 'react';
import { Modal, Form, Input, DatePicker, TimePicker, Button, message } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;

const AddEvent = ({ isModalVisible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values) => {
    try {
      const startTime = dayjs(values.date).hour(values.startTime.hour()).minute(values.startTime.minute());
      const endTime = dayjs(values.date).hour(values.endTime.hour()).minute(values.endTime.minute());

      const eventData = {
        title: values.title,
        description: values.description,
        start_time: startTime.format('YYYY-MM-DD HH:mm:ss'),
        end_time: endTime.format('YYYY-MM-DD HH:mm:ss'),
        location: values.location,
        status: 'confirmed'
      };

      const response = await fetch('http://localhost:5001/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      messageApi.success('Event created successfully');
      form.resetFields();
      onSuccess();
    } catch (error) {
      messageApi.error(`Failed to create event: ${error.message}`);
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
        title="Add New Event"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="add-event-modal"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4 space-y-6"
          size="large"
        >
          <Form.Item
            name="title"
            label="Event Title"
            rules={[{ required: true, message: 'Please enter event title' }]}
            className="mb-6"
          >
            <Input 
              placeholder="Enter event title" 
              className="h-12 text-lg"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            className="mb-6"
          >
            <TextArea 
              rows={6} 
              placeholder="Enter event description" 
              className="text-base"
            />
          </Form.Item>

          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Please select date' }]}
            className="mb-6"
          >
            <DatePicker 
              className="w-full h-12 text-lg" 
              format="MMMM D, YYYY"
            />
          </Form.Item>

          <div className="flex gap-6 mb-6">
            <Form.Item
              name="startTime"
              label="Start Time"
              rules={[{ required: true, message: 'Please select start time' }]}
              className="flex-1"
            >
              <TimePicker 
                format="HH:mm" 
                className="w-full h-12 text-lg"
              />
            </Form.Item>

            <Form.Item
              name="endTime"
              label="End Time"
              rules={[{ required: true, message: 'Please select end time' }]}
              className="flex-1"
            >
              <TimePicker 
                format="HH:mm" 
                className="w-full h-12 text-lg"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="location"
            label="Location"
            className="mb-6"
          >
            <Input 
              placeholder="Enter event location" 
              className="h-12 text-lg"
            />
          </Form.Item>

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
              Create Event
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default AddEvent; 