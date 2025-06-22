import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getHabitsForToday } from "./services/getHabitsForToday";
import { markHabitComplete } from "./services/markHabitComplete";
import { format } from "date-fns";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Habits from "./pages/Habits";
import { useNavigate } from "react-router-dom";
import { SignOutButton, SignInButton } from "./components/AuthButtons";
import {
  collection,
  doc,
  getDocs,
} from "firebase/firestore";

const App = () => {
  const [habits, setHabits] = useState<{ id: string; name: string }[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const today = format(new Date(), "yyyy-MM-dd");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || location.pathname !== "/") return;
    (async () => {
      const data = await getHabitsForToday(user.uid);
      setHabits(data as any);
    })();
  }, [user, location]);

  const handleToggle = async (habitId: string) => {
    if (!user) return;
    const updated = [...completed, habitId];
    setCompleted(updated);
    await markHabitComplete(user.uid, today, habitId);
  };

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Smart Track</h1>
        <SignInButton />
      </div>
    );
  }

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
            <button
              onClick={() => navigate("/")}
              className="bg-[#0b7268] px-5 py-3 rounded-md w-full text-left font-semibold flex items-center space-x-3 transition hover:scale-105"
            >
              <span className="text-lg">🏠</span>
              <span>Home</span>
            </button>

            <button
              onClick={() => navigate("/progress")}
              className="px-5 py-3 rounded-md w-full text-left flex items-center space-x-3 transition hover:bg-[#199d8a] hover:scale-105"
            >
              <span className="text-lg">📊</span>
              <span>Progress</span>
            </button>

            <button
              onClick={() => navigate("/habits")}
              className="px-5 py-3 rounded-md w-full text-left flex items-center space-x-3 transition hover:bg-[#199d8a] hover:scale-105"
            >
              <span className="text-lg">📋</span>
              <span>Habits</span>
            </button>

            <button
              onClick={() => navigate("/settings")}
              className="px-5 py-3 rounded-md w-full text-left flex items-center space-x-3 transition hover:bg-[#199d8a] hover:scale-105"
            >
              <span className="text-lg">⚙️</span>
              <span>Settings</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-12">
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* Top nav */}
                <div className="flex justify-between items-center mb-12">
                  <div className="flex space-x-10 text-[#174b91] font-medium tracking-wide">
                    <a href="#" className="hover:underline">Home</a>
                    <a href="#" className="hover:underline">About</a>
                    <a href="#" className="hover:underline">Contact</a>
                  </div>
                  <SignOutButton />
                </div>

                {/* Header section */}
                <div className="max-w-3xl">
                  <h1 className="text-4xl font-bold text-[#123d6a] mb-3 leading-tight">
                    Welcome, {user?.displayName?.split(" ")[0] || "User"}
                  </h1>
                  <p className="text-gray-700 mb-8 leading-tight">
                    Stay on top of your goals. Check off habits as you complete them!
                  </p>
                </div>

                {/* Today's Habits */}
                <ul className="space-y-3">
                  {habits.map((habit) => (
                    <li key={habit.id} className="flex justify-between items-center p-4 border rounded bg-blue-100 hover:bg-blue-200 transition">
                        <>
                          <span>{habit.name}</span>
                        </>
                    </li>
                  ))}
                </ul>
              </>
            }
          />
          <Route path="/progress" element={<div>Progress Page</div>} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/settings" element={<div>Settings Page</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;