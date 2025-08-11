// Search data structure for global search functionality
export const searchableItems = [
  // Pages
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Main dashboard with overview and statistics',
    type: 'page',
    path: '/dashboard',
    icon: '📊',
    keywords: ['dashboard', 'main', 'overview', 'stats', 'statistics', 'home']
  },
  {
    id: 'calendar',
    title: 'Calendar',
    description: 'Manage events and schedule',
    type: 'page',
    path: '/calendar',
    icon: '📅',
    keywords: ['calendar', 'events', 'schedule', 'event management']
  },
  {
    id: 'add-event',
    title: 'Add Event',
    description: 'Create new event in calendar',
    type: 'page',
    path: '/calendar?openAddModal=true',
    icon: '➕📅',
    keywords: ['add event', 'create event', 'new event', 'schedule event']
  },
  {
    id: 'team',
    title: 'Team Management',
    description: 'Manage team members and roles',
    type: 'page',
    path: '/team',
    icon: '👥',
    keywords: ['team', 'members', 'management', 'roles', 'add member', 'team member']
  },
  {
    id: 'users',
    title: 'Users',
    description: 'View and manage user accounts',
    type: 'page',
    path: '/users',
    icon: '👤',
    keywords: ['users', 'accounts', 'user management', 'add user']
  },
  {
    id: 'businesses',
    title: 'Dive Clubs',
    description: 'Manage dive clubs and businesses',
    type: 'page',
    path: '/businesses',
    icon: '🏢',
    keywords: ['dive clubs', 'businesses', 'clubs', 'add business', 'dive club management']
  },
  {
    id: 'add-user',
    title: 'Add User',
    description: 'Create new user account',
    type: 'page',
    path: '/add-user',
    icon: '➕👤',
    keywords: ['add user', 'create user', 'new user', 'register user']
  },
  {
    id: 'add-business',
    title: 'Add Dive Club',
    description: 'Add new dive club or business',
    type: 'page',
    path: '/add-business',
    icon: '➕🏢',
    keywords: ['add business', 'add dive club', 'create business', 'new business']
  },
  {
    id: 'add-team-member',
    title: 'Add Team Member',
    description: 'Add new team member',
    type: 'page',
    path: '/add-team-member',
    icon: '➕👥',
    keywords: ['add team member', 'add member', 'create member', 'new member']
  },
  {
    id: 'edit-profile',
    title: 'Edit Profile',
    description: 'Edit your profile information',
    type: 'page',
    path: '/edit-profile',
    icon: '✏️👤',
    keywords: ['edit profile', 'profile', 'settings', 'account settings']
  }
];

// Search function
export const searchItems = (query) => {
  if (!query || query.trim() === '') {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  
  return searchableItems.filter(item => {
    // Search in title
    if (item.title.toLowerCase().includes(searchTerm)) {
      return true;
    }
    
    // Search in description
    if (item.description.toLowerCase().includes(searchTerm)) {
      return true;
    }
    
    // Search in keywords
    if (item.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))) {
      return true;
    }
    
    // Search in type
    if (item.type.toLowerCase().includes(searchTerm)) {
      return true;
    }
    
    return false;
  }).sort((a, b) => {
    // Prioritize exact title matches
    const aTitleMatch = a.title.toLowerCase() === searchTerm;
    const bTitleMatch = b.title.toLowerCase() === searchTerm;
    
    if (aTitleMatch && !bTitleMatch) return -1;
    if (!aTitleMatch && bTitleMatch) return 1;
    
    // Then prioritize title starts with
    const aTitleStarts = a.title.toLowerCase().startsWith(searchTerm);
    const bTitleStarts = b.title.toLowerCase().startsWith(searchTerm);
    
    if (aTitleStarts && !bTitleStarts) return -1;
    if (!aTitleStarts && bTitleStarts) return 1;
    
    return 0;
  });
};
