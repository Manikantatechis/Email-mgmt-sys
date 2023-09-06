// assets
import { MailOutlined } from '@ant-design/icons';

// icons
const icons = {
  MailOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & kixie ||============================== //

const Credentials = {
  id: 'credentials',
  title: 'Credentials',
  type: 'group',
  children: [
    {
      id: 'gmail',
      title: `Gmail / Kixie`,
      type: 'item',
      url: '/credentials',
      icon: icons.MailOutlined
    }
    // {
    //   id: 'kixie',
    //   title: 'Kixie',
    //   type: 'item',
    //   url: 'kixie/list',
    //   icon: icons.PhoneOutlined
    // }
    ,
  ]
};

export default Credentials;
