

import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  setDoc,
} from "firebase/firestore";

const HabitsPage = () => {
  const [habitName, setHabitName] = useState("");
  const [habits, setHabits] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const user = auth.currentUser;

  const fetchHabits = async () => {
    if (!user) return;
    const snapshot = await getDocs(collection(db, "users", user.uid, "habits"));
    setHabits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchHabits();
    // eslint-disable-next-line
  }, [user]);

  const addHabit = async () => {
    if (!user || !habitName.trim()) return;
    const newId = habitName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    await setDoc(doc(db, "users", user.uid, "habits", newId), {
      name: habitName.trim(),
      active: true,
      createdAt: new Date(),
      modifiedAt: new Date(),
    });
    setHabitName("");
    fetchHabits();
  };

  const updateHabit = async (id: string) => {
    if (!user || !editText.trim()) return;
    await updateDoc(doc(db, "users", user.uid, "habits", id), {
      name: editText.trim(),
      modifiedAt: new Date(),
    });
    setEditingId(null);
    setEditText("");
    fetchHabits();
  };

  const deleteHabit = async (id: string) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid, "habits", id), {
      active: false,
      modifiedAt: new Date(),
    });
    fetchHabits();
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6 text-[#174b91]">Manage Habits</h2>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="New habit name"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={addHabit}
          className="bg-[#2ab9a3] text-white px-4 py-2 rounded hover:brightness-110 transition"
        >
          Add Habit
        </button>
      </div>

      <ul className="space-y-4">
        {habits.map((habit) => (
          <li
            key={habit.id}
            className={`border p-4 rounded flex justify-between items-center ${
              habit.active ? "" : "opacity-50"
            }`}
          >
            {editingId === habit.id ? (
              <div className="flex gap-2 w-full">
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="border p-1 rounded w-full"
                />
                <button
                  onClick={() => updateHabit(habit.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex justify-between w-full">
                <span>{habit.name}</span>
                <div className="space-x-3">
                  <button
                    onClick={() => {
                      setEditingId(habit.id);
                      setEditText(habit.name);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  {habit.active && (
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HabitsPage;