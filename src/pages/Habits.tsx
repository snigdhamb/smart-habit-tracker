import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  setDoc,
} from "firebase/firestore";

const Habits = () => {
  const [habitName, setHabitName] = useState("");
  const [habits, setHabits] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const fetchHabits = async () => {
      const snapshot = await getDocs(collection(db, "users", user.uid, "habits"));
      setHabits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchHabits();
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
    const snapshot = await getDocs(collection(db, "users", user.uid, "habits"));
    setHabits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const updateHabit = async (id: string) => {
    if (!user || !editText.trim()) return;
    await updateDoc(doc(db, "users", user.uid, "habits", id), {
      name: editText.trim(),
      modifiedAt: new Date(),
    });
    setEditingId(null);
    setEditText("");
    const snapshot = await getDocs(collection(db, "users", user.uid, "habits"));
    setHabits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const deleteHabit = async (id: string) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid, "habits", id), {
      active: false,
      modifiedAt: new Date(),
    });
    const snapshot = await getDocs(collection(db, "users", user.uid, "habits"));
    setHabits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">Your Habits</h2>

      <div className="mb-4 flex gap-3">
        <input
          type="text"
          placeholder="Enter new habit"
          className="border rounded p-2 w-64"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
        />
        <button onClick={addHabit} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Habit
        </button>
      </div>

      <ul className="space-y-3">
        {habits.map((habit) => (
          <li key={habit.id} className={`flex justify-between items-center p-4 border rounded ${!habit.active ? "opacity-50" : ""}`}>
            {editingId === habit.id ? (
              <div className="flex gap-2 w-full">
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="border rounded p-1 w-full"
                />
                <button onClick={() => updateHabit(habit.id)} className="bg-green-600 text-white px-2 py-1 rounded">
                  Save
                </button>
              </div>
            ) : (
              <>
                <span>{habit.name}</span>
                <div className="space-x-3">
                  <button onClick={() => { setEditingId(habit.id); setEditText(habit.name); }} className="text-blue-600 hover:underline">
                    Edit
                  </button>
                  {habit.active && (
                    <button onClick={() => deleteHabit(habit.id)} className="text-red-600 hover:underline">
                      Remove
                    </button>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Habits;
