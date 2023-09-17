// assets
import { LoginOutlined, ProfileOutlined, OrderedListOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  OrderedListOutlined
};

// Final pages object
const pages = {
  id: 'authentication',
  title: 'Authentication',
  type: 'group',
  children: [
    {
      id: 'logout',
      title: 'Logout',
      type: 'item',
      url: '/logout',
      icon: icons.LoginOutlined
      // target: true
    },
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
  ]
};

export default pages;
