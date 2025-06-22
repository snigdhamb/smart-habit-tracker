import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { SignInButton, SignOutButton } from '../components/AuthButtons';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe(); // cleanup on unmount
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Habit Tracker</h1>
        <div className="space-x-6">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>
        {user ? <SignOutButton /> : <SignInButton />}
      </nav>
      <main className="flex justify-center items-center h-[calc(100vh-64px)]">
        {user ? (
          <div className="text-center">
            <p className="mb-2 text-lg">Welcome, {user.displayName}</p>
            <img src={user.photoURL ?? ''} alt="User" className="w-16 h-16 rounded-full mb-4 mx-auto" />
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default App;
