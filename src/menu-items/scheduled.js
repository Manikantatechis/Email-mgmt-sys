// assets
import { MailOutlined } from '@ant-design/icons';

// icons
const icons = {
  MailOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & kixie ||============================== //

const Scheduled = {
  id: 'Scheduled',
  title: 'Scheduled',
  type: 'group',
  children: [
    {
      id: 'gmail',
      title: `Scheduled List`,
      type: 'item',
      url: '/scheduled',
      icon: icons.MailOutlined
    }
    // {
    //   id: 'kixie',
    //   title: 'Kixie',
    //   type: 'item',
    //   url: 'kixie/list',
    //   icon: icons.PhoneOutlined
    // }
  ]
};

export default Scheduled;
