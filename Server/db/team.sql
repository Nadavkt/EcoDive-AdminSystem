CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Viewer',
    profile_image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a test admin user (password: Admin123!)
INSERT INTO team_members (first_name, last_name, email, password, role)
VALUES (
    'Admin',
    'User',
    'admin@ecodive.com',
    '$2b$10$3euPcmQFCiblsZeEu5s7p.9BU9F8jQzQzQzQzQzQzQzQzQzQzQzQ',  -- This is a placeholder, we'll update it with a real hash
    'Admin'
); 