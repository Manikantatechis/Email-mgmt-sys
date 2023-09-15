import { useRoutes } from 'react-router-dom';

// project import
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  // The order matters; make sure to structure the routes correctly
  return useRoutes([MainRoutes, LoginRoutes]);

}
