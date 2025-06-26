import React, { useState } from 'react';
import { db, auth } from "../firebase/firebase";
import {
  doc,
  setDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

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
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const user = auth.currentUser;
  const navigate = useNavigate();

  const addHabit = async (name: string) => {
    if (!user || !name.trim()) return;
    const newId = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    const newHabit = {
      name: name.trim(),
      active: true,
      complete: false,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    await setDoc(doc(db, "users", user.uid, "habits", newId), newHabit);
    setHabits((prev) => [...prev, { id: newId, ...newHabit }]);
  };

  const toggleHabit = (suggestion: string) => {
    const trimmed = suggestion.trim();
    setSelectedHabits((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(trimmed)) {
        newSet.delete(trimmed);
      } else {
        newSet.add(trimmed);
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

  const handleContinue = async () => {
    if (selectedHabits.size === 0) {
      setShowConfirmation(true);
      return;
    }
    for (const suggestion of selectedHabits) {
      await addHabit(suggestion);
    }
    navigate("/");
  };

  const confirmContinue = async () => {
    for (const suggestion of selectedHabits) {
      await addHabit(suggestion);
    }
    navigate("/");
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
        disabled={loading || !goal.trim()}
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
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleContinue}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Continue
        </button>
      </div>
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <p className="mb-4 text-lg">You haven't selected any habits. Are you sure you want to continue?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowConfirmation(false)}
              >
                No
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={confirmContinue}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateHabits;