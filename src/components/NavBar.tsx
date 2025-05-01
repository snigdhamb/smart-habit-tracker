// src/components/NavBar.tsx
import { Link, NavLink } from "react-router-dom";

const NavBar = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-white bg-blue-600 px-3 py-2 rounded"
      : "text-blue-600 hover:bg-blue-100 px-3 py-2 rounded";

  return (
    <nav className="flex items-center justify-between p-4 shadow-md bg-white">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        HabitTracker
      </Link>
      <div className="space-x-4">
        <NavLink to="/" className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        {/* <NavLink to="/settings" className={linkClass}>
          Settings
        </NavLink> */}
      </div>
    </nav>
  );
};

export default NavBar;
