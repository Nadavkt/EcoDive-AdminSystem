import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, TimePicker, Button, message, Switch } from 'antd';
import dayjs from 'dayjs';
import { buildApiUrl } from '../../config';

const { TextArea } = Input;

const AddEvent = ({ isModalVisible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isAllDay, setIsAllDay] = useState(false);

  const handleSubmit = async (values) => {
    try {
      let startTime, endTime;
      
      if (isAllDay) {
        // For all-day events, set start to 00:00 and end to 23:59
        startTime = dayjs(values.dateStart).startOf('day');
        endTime = dayjs(values.dateEnd).endOf('day');
      } else {
        // For regular events, use the selected times
        startTime = dayjs(values.dateStart).hour(values.startTime.hour()).minute(values.startTime.minute());
        endTime = dayjs(values.dateEnd).hour(values.endTime.hour()).minute(values.endTime.minute());
      }

      const eventData = {
        title: values.title,
        description: values.description,
        start_time: startTime.format('YYYY-MM-DD HH:mm:ss'),
        end_time: endTime.format('YYYY-MM-DD HH:mm:ss'),
        location: values.location,
        status: 'confirmed'
      };

      const response = await fetch(buildApiUrl('/api/calendar'), {
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
      <style>
        {`
          .add-event-label .ant-form-item-label > label {
            color: black !important;
          }
        `}
      </style>
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
            className="mb-6 add-event-label"
          >
            <Input 
              placeholder="Enter event title" 
              className="h-12 text-lg"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            className="mb-6 add-event-label"
          >
            <TextArea 
              rows={6} 
              placeholder="Enter event description" 
              className="text-base"
            />
          </Form.Item>

          <div className="flex gap-6 mb-6">
            <Form.Item
              name="dateStart"
              label="Date Start"
              rules={[{ required: true, message: 'Please select start date' }]}
              className="flex-1 add-event-label"
            >
              <DatePicker 
                className="w-full h-12 text-lg" 
                format="MMMM D, YYYY"
              />
            </Form.Item>

            <Form.Item
              name="dateEnd"
              label="Date End"
              rules={[{ required: true, message: 'Please select end date' }]}
              className="flex-1 add-event-label"
            >
              <DatePicker 
                className="w-full h-12 text-lg" 
                format="MMMM D, YYYY"
              />
            </Form.Item>
          </div>

          {!isAllDay && (
            <div className="flex gap-6 mb-2">
              <Form.Item
                name="startTime"
                label="Start Time"
                rules={[{ required: true, message: 'Please select start time' }]}
                className="flex-1 add-event-label"
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
                className="flex-1 add-event-label"
              >
                <TimePicker 
                  format="HH:mm" 
                  className="w-full h-12 text-lg"
                />
              </Form.Item>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6 ml-4">
            <span className="text-base font-medium text-black">All Day Event</span>
            <Switch 
              checked={isAllDay}
              onChange={(checked) => {
                setIsAllDay(checked);
                if (checked) {
                  // Clear time fields when switching to all-day
                  form.setFieldsValue({ startTime: null, endTime: null });
                }
              }}
              className="text-lg"
            />
          </div>

          <Form.Item
            name="location"
            label="Location"
            className="mb-6 add-event-label"
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