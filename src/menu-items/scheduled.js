// assets
import { ScheduleOutlined } from '@ant-design/icons'


// ==============================|| MENU ITEMS - SAMPLE PAGE & kixie ||============================== //

const Scheduled = {
  id: 'Scheduled',
  title: 'Scheduled',
  type: 'group',
  children: [
    {
      id: 'scheduled',
      title: `Scheduled List`,
      type: 'item',
      url: '/scheduled',
      icon: ScheduleOutlined
    }
  ]
};

export default Scheduled;
