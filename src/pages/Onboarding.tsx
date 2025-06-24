// src/pages/Onboarding.tsx
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="p-12 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to Smart Track 🎯</h1>
      <p className="mb-8 text-gray-700">Let’s help you start building habits aligned with your goals.</p>
      <button
        className="bg-blue-600 text-white px-6 py-3 rounded w-full mb-4"
        onClick={() => navigate("/goal-input")}
      >
        Input your goal & pick from suggestions
      </button>
      <button
        className="bg-gray-300 text-gray-900 px-6 py-3 rounded w-full"
        onClick={() => navigate("/habits")}
      >
        Enter your own habits
      </button>
    </div>
  );
}