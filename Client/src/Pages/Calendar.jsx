import React from 'react';
import '../Styles/antDesignOverride.css';
import { Badge, Button, Calendar, Input, List, Select, Typography,  } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography
const { Option } = Select;

const getListData = (value) => {
  let listData = [];
  switch (value.date()) {
    case 8:
      listData = [
        { type: 'warning', content: 'Meeting: Cleaning dive' },
        { type: 'success', content: 'Close the club' },
      ];
      break;
    case 25:
      listData = [
        { type: 'error', content: 'Shark area to close' },
        { type: 'success', content: 'Navigation under the sea tourment' },
      ];
      break;
    default:
  }
  return listData || [];
};

const dateCellRender = (value) => {
  const listData = getListData(value);
  return (
    <ul className="events">
      {listData.map((item) => (
        <li key={item.content}>
          <Badge status={item.type} text={item.content} />
        </li>
      ))}
    </ul>
  );
};

const cellRender = (current, info) => {
  if (info.type === 'date') return dateCellRender(current);
  return info.originNode;
};

export default function CalendarPage() {
  const upcomingEvents = [
    { title: 'Dive briefing', date: 'July 22', time: '10:00', priority: 'High' },
    { title: 'Equipment check', date: 'July 24', time: '14:00', priority: 'Medium' },
    { title: 'Training session', date: 'July 30', time: '09:00', priority: 'Low' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center ">
        <Title style={{color: 'white'}} level={1}>Calendar</Title>
        <Button type="primary" className="mr-10 mb-3">
        <CalendarOutlined />
          Add Event
        </Button>
      </div>
      

      {/* Calendar with Events */}
      <div className="p-4 rounded shadow">
        <Calendar className='' cellRender={cellRender} fullscreen={true} />
      </div>

      {/* Upcoming Events Section */}
      <div className="p-4 rounded shadow ">
        <div className="flex justify-between items-center mb-4">
          <Typography.Title level={4} className="!mb-0 " >Upcoming Events</Typography.Title>
          <div className="flex gap-2">
            <Input placeholder="Search by name" className="w-40" />
            <Select defaultValue="Date" className="w-32">
              <Option value="Date">Date</Option>
              <Option value="Time">Time</Option>
              <Option value="Priority">Priority</Option>
            </Select>
          </div>
        </div>

        <List
          itemLayout="horizontal"
          dataSource={upcomingEvents}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={`${item.date}, ${item.time} – ${item.priority}`}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}