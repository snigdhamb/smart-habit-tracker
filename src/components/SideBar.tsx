import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 h-screen bg-teal-500 text-white fixed top-0 left-0 p-6">
      <h2 className="text-2xl font-bold mb-8">Habit Tracker</h2>
      <nav className="flex flex-col space-y-4">
        <button onClick={() => navigate('/')} className="hover:underline text-left">Home</button>
        <button onClick={() => navigate('/dashboard')} className="hover:underline text-left">Dashboard</button>
        <button onClick={() => navigate('/habits')} className="hover:underline text-left">Habits</button>
        <button onClick={() => navigate('/settings')} className="hover:underline text-left">Settings</button>
      </nav>
    </aside>
  );
};

export default Sidebar;