const NavBar = () => {
  return (
    <header className="ml-64 bg-blue-800 text-white p-4 flex justify-between items-center">
      <div className="text-lg font-semibold">Smart Habit Tracker</div>
      <button className="bg-green-500 px-4 py-2 rounded">Log Out</button>
    </header>
  );
};

export default NavBar;