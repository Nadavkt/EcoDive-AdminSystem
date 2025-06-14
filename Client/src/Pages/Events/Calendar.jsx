import React, { useState, useEffect } from 'react';
import '../../Styles/antDesignOverride.css';
import { Badge, Button, Calendar, Input, List, Select, Typography, message, Popconfirm } from 'antd';
import { CalendarOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AddEvent from './AddEvent';
import EditEvent from './EditEvent';

const { Title } = Typography;
const { Option } = Select;

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [currentMonthEvents, setCurrentMonthEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/calendar');

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to fetch events: ${error.details || error.error}`);
      }

      const allEvents = await response.json();
      setEvents(allEvents);
      filterEventsForMonth(allEvents, selectedDate);
    } catch (error) {
      messageApi.error(`Failed to load calendar events: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterEventsForMonth = (eventsList, date) => {
    const startOfMonth = date.startOf('month');
    const endOfMonth = date.endOf('month');
    
    const filteredEvents = eventsList.filter(event => {
      const eventDate = dayjs(event.start_time);
      return eventDate.isAfter(startOfMonth) && eventDate.isBefore(endOfMonth);
    });
    
    setCurrentMonthEvents(filteredEvents);
  };

  const handleMonthChange = (date) => {
    setSelectedDate(date);
    filterEventsForMonth(events, date);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/calendar/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      messageApi.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      messageApi.error(`Failed to delete event: ${error.message}`);
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setIsEditModalVisible(true);
  };

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setSelectedEvent(null);
  };

  const handleSuccess = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setSelectedEvent(null);
    fetchEvents();
  };

  const getListData = (value) => {
    return currentMonthEvents.filter(event => {
      const eventDate = dayjs(event.start_time);
      return eventDate.isSame(value, 'day');
    }).map(event => ({
      type: event.status,
      content: event.title,
      time: dayjs(event.start_time).format('HH:mm'),
      endTime: dayjs(event.end_time).format('HH:mm'),
      description: event.description,
      location: event.location
    }));
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type === 'confirmed' ? 'success' : 'warning'} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    return info.originNode;
  };

  const handleSearch = (value) => {
    const searchTerm = value.toLowerCase().trim();
    const filteredEvents = events.filter(event => 
      event.title.toLowerCase().includes(searchTerm) ||
      (event.description && event.description.toLowerCase().includes(searchTerm)) ||
      (event.location && event.location.toLowerCase().includes(searchTerm))
    );
    setCurrentMonthEvents(filteredEvents);
  };

  const handleSort = (value) => {
    const sortedEvents = [...currentMonthEvents].sort((a, b) => {
      if (value === 'Date') {
        return dayjs(a.start_time).unix() - dayjs(b.start_time).unix();
      } else if (value === 'Time') {
        return dayjs(a.start_time).format('HH:mm').localeCompare(dayjs(b.start_time).format('HH:mm'));
      }
      return 0;
    });
    setCurrentMonthEvents(sortedEvents);
  };

  return (
    <>
      {contextHolder}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Title style={{color: 'white', fontSize: '50px'}} level={1}>Calendar</Title>
          <Button type="primary" className="mr-10 mb-3" onClick={showAddModal}>
            <CalendarOutlined />
            Add Event
          </Button>
        </div>

        {/* Calendar with Events */}
        <div className="p-4 rounded shadow">
          <Calendar 
            cellRender={cellRender} 
            fullscreen={true}
            loading={loading}
            onPanelChange={handleMonthChange}
          />
        </div>

        {/* Upcoming Events Section */}
        <div className="p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <Typography.Title level={3} className="!mb-0">Upcoming Events</Typography.Title>
            <div className="flex gap-2">
              <Input 
                placeholder="Search by name" 
                className="w-60"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Select 
                defaultValue="Date" 
                className="w-32"
                onChange={handleSort}
              >
                <Option value="Date">Date</Option>
                <Option value="Time">Time</Option>
              </Select>
            </div>
          </div>

          <List
            itemLayout="horizontal"
            dataSource={currentMonthEvents}
            loading={loading}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button 
                    type="text" 
                    icon={<EditOutlined />} 
                    onClick={() => handleEdit(item)}
                    style={{color: 'white'}}
                    className="hover:text-blue-700"
                  />,
                  <Popconfirm
                    title="Delete Event"
                    description="Are you sure you want to delete this event?"
                    onConfirm={() => handleDelete(item.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button 
                      type="text" 
                      icon={<DeleteOutlined />} 
                      style={{color: 'white'}}
                      className="text-s hover:text-red-700"
                    />
                  </Popconfirm>
                ]}
              >
                <List.Item.Meta
                  title={item.title}
                  description={
                    <div>
                      <div>
                        {dayjs(item.start_time).format('MMMM D, YYYY')} at {dayjs(item.start_time).format('HH:mm')} - {dayjs(item.end_time).format('HH:mm')}
                      </div>
                      {item.description && <div className="">{item.description}</div>}
                      {item.location && <div className="">📍 {item.location}</div>}
                      <Badge 
                        text={item.status.charAt(0).toUpperCase() + item.status.slice(1)} 
                      />
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>

        <AddEvent 
          isModalVisible={isAddModalVisible}
          onCancel={handleAddCancel}
          onSuccess={handleSuccess}
        />

        <EditEvent 
          isModalVisible={isEditModalVisible}
          onCancel={handleEditCancel}
          onSuccess={handleSuccess}
          event={selectedEvent}
        />
      </div>
    </>
  );
} 