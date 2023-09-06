// assets
import { LoginOutlined, ProfileOutlined, OrderedListOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  OrderedListOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'authentication',
  title: 'Authentication',
  type: 'group',
  children: [
    {
      id: 'login1',
      title: 'Login',
      type: 'item',
      url: '/login',
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
