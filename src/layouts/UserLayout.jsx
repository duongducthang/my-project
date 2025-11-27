// TODO: Implement UserLayout
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <div>
      {/* TODO: Add header, navigation, etc. */}
      <Outlet />
      {/* TODO: Add footer */}
    </div>
  );
};

export default UserLayout;
