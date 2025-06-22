import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-teal-500 text-white fixed top-0 left-0 p-6">
      <h2 className="text-2xl font-bold mb-8">Habit Tracker</h2>
      <nav className="flex flex-col space-y-4">
        <NavLink to="/" className="hover:underline">Home</NavLink>
        <NavLink to="/dashboard" className="hover:underline">Progress</NavLink>
        <NavLink to="/habits" className="hover:underline">Habits</NavLink>
        <NavLink to="/settings" className="hover:underline">Settings</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;