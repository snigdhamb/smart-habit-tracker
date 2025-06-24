// src/pages/GenerateHabits.tsx
import { useState } from "react";
import { db, auth } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function GenerateHabits() {
  const [goal, setGoal] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const generateHabits = async () => {
    const res = await fetch("/api/generate-habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal }),
    });
    const data = await res.json();
    setSuggestions(data.habits);
  };

  const toggleHabit = async (habit: string) => {
    const user = auth.currentUser;
    if (!user) return;

    if (selected.includes(habit)) {
      setSelected((prev) => prev.filter((h) => h !== habit));
      // Optionally remove from Firestore
    } else {
      setSelected((prev) => [...prev, habit]);
      await addDoc(collection(db, "users", user.uid, "habits"), {
        name: habit,
        complete: false,
        createdAt: new Date(),
      });
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">What's your goal?</h1>
      <input
        className="w-full border p-2 rounded mb-4"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="e.g., Get in shape"
      />
      <button
        onClick={generateHabits}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate Suggestions
      </button>

      <div className="mt-6 flex flex-wrap gap-2">
        {suggestions.map((habit) => (
          <button
            key={habit}
            onClick={() => toggleHabit(habit)}
            className={`px-4 py-2 rounded ${
              selected.includes(habit)
                ? "bg-blue-700 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            {habit}
          </button>
        ))}
      </div>
    </div>
  );
}