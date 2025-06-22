import React, { useEffect, useState } from "react";
import { auth } from "./firebase/firebase";
import { getHabitsForToday } from "./services/getHabitsForToday";
import { markHabitComplete } from "./services/markHabitComplete";
import { format } from "date-fns";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HabitsPage from "./components/HabitsPage";

const App = () => {
  const [habits, setHabits] = useState<{ id: string; name: string }[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);

  const user = auth.currentUser;
  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const data = await getHabitsForToday(user.uid);
      setHabits(data as any);
    })();
  }, [user]);

  const handleToggle = async (habitId: string) => {
    if (!user) return;
    const updated = [...completed, habitId];
    setCompleted(updated);
    await markHabitComplete(user.uid, today, habitId);
  };

  return (
    <div className="flex min-h-screen font-sans bg-[#fdfcfb]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2ab9a3] text-white p-8 flex flex-col justify-between rounded-r-3xl">
        <div>
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#2ab9a3] font-bold text-base">✓</span>
            </div>
            <span className="text-2xl font-semibold">Habit Tracker</span>
          </div>
          <nav className="space-y-5">
            <button className="bg-[#0b7268] px-5 py-3 rounded-md w-full text-left font-semibold flex items-center space-x-3 transition hover:scale-105">
              <span className="text-lg">🏠</span>
              <span>Home</span>
            </button>
            <button className="px-5 py-3 rounded-md w-full text-left flex items-center space-x-3 transition hover:bg-[#199d8a] hover:scale-105">
              <span className="text-lg">📊</span>
              <span>Progress</span>
            </button>
            <button className="px-5 py-3 rounded-md w-full text-left flex items-center space-x-3 transition hover:bg-[#199d8a] hover:scale-105">
              <span className="text-lg">⚙️</span>
              <span>Settings</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-12">
        {/* Top nav */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex space-x-10 text-[#174b91] font-medium tracking-wide">
            <a href="#" className="hover:underline">Home</a>
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
          <button className="bg-[#2ab9a3] text-white px-6 py-3 rounded-md font-semibold tracking-wide hover:brightness-110 transition">
            Log Out
          </button>
        </div>

        {/* Header section */}
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold text-[#123d6a] mb-3 leading-tight">Track Your Habits</h1>
          <p className="text-gray-700 mb-8 leading-tight">
            Stay on top of your goals. Check off habits as you complete them!
          </p>
        </div>

        {/* Today's Habits */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-[#10443c] mb-5">Today’s Habits</h2>
          <ul className="space-y-3 text-lg font-semibold">
            {habits.map((habit) => (
              <li key={habit.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  onChange={() => handleToggle(habit.id)}
                  checked={completed.includes(habit.id)}
                  className="w-5 h-5 accent-[#2ab9a3]"
                />
                <span className="text-[#174b91]">{habit.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;