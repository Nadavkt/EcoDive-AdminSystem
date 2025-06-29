// Configuration for API endpoints
const config = {
  // Development environment (localhost)
  development: {
    apiBaseUrl: 'http://localhost:5001'
  },
  // Production environment (my deployed server)
  production: {
    // TODO: Replace this with your actual production server URL
    apiBaseUrl: 'https://ecodive-adminsystem-api.onrender.com' 
  }
};

// Get the current environment
const environment = import.meta.env.MODE || 'production';
console.log(environment)

// Export the appropriate configuration
export const apiBaseUrl = config[environment].apiBaseUrl;

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  return `${apiBaseUrl}${endpoint}`;
}; 