// project import
import pages from './pages';
import dashboard from './dashboard';
import addCredentials from './credentials';
import send from './send';
import Templates from './templates';
import Scheduled from './scheduled';
// import support from './support';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, pages, addCredentials, Templates,Scheduled, send]
};

export default menuItems;
