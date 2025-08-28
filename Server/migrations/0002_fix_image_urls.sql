-- Migration to fix image URLs from localhost to production
-- Update all image URLs from localhost to production server

-- Update team member profile images
UPDATE team_members 
SET profile_image = REPLACE(profile_image, 'http://localhost:5001', 'https://ecodive-adminsystem-api.onrender.com')
WHERE profile_image LIKE '%localhost:5001%';

-- Update user profile images  
UPDATE users 
SET profile_image = REPLACE(profile_image, 'http://localhost:5001', 'https://ecodive-adminsystem-api.onrender.com')
WHERE profile_image LIKE '%localhost:5001%';

-- Update user license images
UPDATE users 
SET license_front = REPLACE(license_front, 'http://localhost:5001', 'https://ecodive-adminsystem-api.onrender.com')
WHERE license_front LIKE '%localhost:5001%';

UPDATE users 
SET license_back = REPLACE(license_back, 'http://localhost:5001', 'https://ecodive-adminsystem-api.onrender.com')
WHERE license_back LIKE '%localhost:5001%';
