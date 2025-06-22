import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { SignInButton } from '../components/AuthButtons';

const SignIn: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe(); // cleanup on unmount
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Smart Track</h1>
      <SignInButton />
    </div>
  );
};

export default SignIn;