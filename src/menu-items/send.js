// assets
import { SendOutlined } from '@ant-design/icons';

// icons
const icons = {
  SendOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & kixie ||============================== //

const send = {
  id: 'send',
  title: 'Email/SMS',
  type: 'group',
  children: [
    {
      id: 'send email / sms',
      title: 'Send Email / SMS',
      type: 'item',
      url: '/send',
      icon: icons.SendOutlined
    }
  ]
};

export default send;