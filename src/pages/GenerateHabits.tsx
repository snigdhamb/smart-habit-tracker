import React, { useState } from 'react';
import { db, auth } from "../firebase/firebase";
import {
  doc,
  setDoc,
} from "firebase/firestore";

interface Habit {
  id: string;
  name: string;
  complete: boolean;
  createdAt: Date;
  modifiedAt?: Date;
}

const GenerateHabits: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedHabits, setSelectedHabits] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [habitName, setHabitName] = useState("");
  const [habits, setHabits] = useState<Habit[]>([]);

  const user = auth.currentUser;

  const addHabit = async () => {
    if (!user || !habitName.trim()) return;
    const newId = habitName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    const newHabit = {
      name: habitName.trim(),
      active: true,
      complete: false,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    await setDoc(doc(db, "users", user.uid, "habits", newId), newHabit);
    setHabitName("");
    setHabits((prev) => [...prev, { id: newId, ...newHabit }]);
  };

  const toggleHabit = (suggestion: string) => {
    const trimmed = suggestion.trim();
    setSelectedHabits((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(trimmed)) {
        newSet.delete(trimmed);
        console.log(newSet);
      } else {
        newSet.add(trimmed);
        console.log(newSet);
      }
      return newSet;
    });
  };

  const handleGenerate = async () => {
    if (!goal.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://habit-generator.onrender.com/generate-habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goal }),
      });

      if (!response.ok) throw new Error('Failed to fetch habits');

      const data = await response.json();
      console.log(data);
      setSuggestions(data.habits); // Assumes API returns { habits: [...] }
    } catch (err) {
        console.error('API error:', err);
        setError('Error generating habits. Please try again.');
      } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Generate Habits</h1>
      <textarea
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
        rows={3}
        placeholder="Enter your vague goal..."
      />
      <button
        onClick={handleGenerate}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Habits'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.map((suggestion, idx) => {
          const selected = selectedHabits.has(suggestion.trim());
          return (
            <button
              key={idx}
              onClick={() => toggleHabit(suggestion)}
              className={`px-4 py-2 rounded border text-white ${selected ? 'bg-[#0b7268]' : 'bg-white text-black'}`}
            >
              {suggestion}
            </button>
            
          );
        })}
      </div>
    </div>
  );
};

export default GenerateHabits;