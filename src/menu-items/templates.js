// assets
import { FileAddOutlined, ReadOutlined } from '@ant-design/icons';

// icons
const icons = {
  FileAddOutlined,
  ReadOutlined
};

// ==============================|| MENU ITEMS - Templates ||============================== //

const Templates = {
  id: 'Templates',
  title: 'Templates',
  type: 'group',
  children: [
    {
      id: 'kixie-template',
      title: 'Kixie / Email - Template',
      type: 'item',
      url: '/template',
      icon: icons.ReadOutlined
      }
    // },
    // {
    //   id: 'email-template',
    //   title: ' Template',
    //   type: 'item',
    //   url: '/template/email',
    //   icon: icons.ReadOutlined
    // }
  ]
};

export default Templates;
