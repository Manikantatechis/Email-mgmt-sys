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
      id: 'email-template',
      title: ' Gmail Templates',
      type: 'item',
      url: '/templates/gmail',
      icon: icons.ReadOutlined
    },
    {
      id: 'kixie-template',
      title: 'Kixie Templates',
      type: 'item',
      url: '/templates/kixie',
      icon: icons.ReadOutlined
    }
  ]
};

export default Templates;
