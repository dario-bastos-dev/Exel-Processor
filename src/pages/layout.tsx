import Sidebar from '@/templates/sidebar';
import { Outlet } from '@tanstack/react-router';

const Layout = () => {
  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  );
};

export default Layout;
