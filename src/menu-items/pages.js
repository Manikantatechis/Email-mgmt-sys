// assets
import { LoginOutlined, ProfileOutlined, OrderedListOutlined } from '@ant-design/icons';


// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  OrderedListOutlined
};

// Initialize an empty children array
const children = [];

// Check if userData exists (i.e., user is logged in)
const userData = localStorage.getItem('userData');
const parsedUserData = userData ? JSON.parse(userData) : null;
const role = localStorage.getItem('userRole');


// Add logout/login option depending on whether user is logged in
if (parsedUserData) {
  children.push({
    id: 'logout',
    title: 'Logout',
    type: 'item',
    url: '/logout',
    icon: icons.LoginOutlined
    // target: true
  });
} else {
  children.push({
    id: 'login1',
    title: 'Login',
    type: 'item',
    url: '/login',
    icon: icons.LoginOutlined
    // target: true
  });
}

// Check role and add Add User and List User if role is Manager or Director
if (parsedUserData && (role === 'manager' || role=== 'director')) {
  children.push(
    {
      id: 'register1',
      title: 'Add User',
      type: 'item',
      url: '/register',
      icon: icons.ProfileOutlined
      // target: true
    },
    {
      id: 'list1',
      title: 'List User',
      type: 'item',
      url: '/users',
      icon: icons.OrderedListOutlined
      // target: true
    }
  );
}

// Final pages object
const pages = {
  id: 'authentication',
  title: 'Authentication',
  type: 'group',
  children
};

export default pages;
