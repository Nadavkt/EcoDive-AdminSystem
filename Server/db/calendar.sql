CREATE TABLE IF NOT EXISTS calendar (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    priority VARCHAR(10) CHECK (priority IN ('High', 'Medium', 'Low')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO calendar (title, description, event_date, event_time, priority) VALUES
('Dive Briefing', 'Morning dive briefing for all divers', CURRENT_DATE, '09:00:00', 'High'),
('Equipment Check', 'Regular equipment maintenance', CURRENT_DATE, '14:00:00', 'Medium'),
('Training Session', 'New diver training program', CURRENT_DATE + INTERVAL '1 day', '10:00:00', 'High'),
('Safety Meeting', 'Monthly safety procedures review', CURRENT_DATE + INTERVAL '2 days', '15:00:00', 'High'),
('Equipment Rental', 'Equipment preparation for weekend rentals', CURRENT_DATE + INTERVAL '3 days', '11:00:00', 'Medium'),
('Staff Meeting', 'Weekly staff coordination meeting', CURRENT_DATE + INTERVAL '4 days', '13:00:00', 'Low'),
('Dive Trip Planning', 'Planning next month''s dive trips', CURRENT_DATE + INTERVAL '5 days', '16:00:00', 'Medium'),
('Maintenance Day', 'Regular facility maintenance', CURRENT_DATE + INTERVAL '6 days', '09:00:00', 'Low'); 