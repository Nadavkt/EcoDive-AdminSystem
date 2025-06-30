// Configuration for API endpoints
const config = {
  // localhost
  development: {
    apiBaseUrl: 'http://localhost:5001'
  },
  // Production environment 
  production: {
    
    apiBaseUrl: 'https://ecodive-adminsystem-api.onrender.com' 
  }
};

// Getting the current environment
const environment = import.meta.env.MODE || 'production';
console.log(environment);

// Export the appropriate configuration
export const apiBaseUrl = config[environment].apiBaseUrl;
console.log(apiBaseUrl);

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  return `${apiBaseUrl}${endpoint}`;
}; 