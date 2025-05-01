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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Smart Habit Tracker</h1>

      {user ? (
        <div>
          <p className="mb-2">Welcome, {user.displayName}</p>
          <img src={user.photoURL ?? ''} alt="User" className="w-12 h-12 rounded-full mb-4" />
          <SignOutButton />
        </div>
      ) : (
        <SignInButton />
      )}
    </div>
  );
};

export default App;
