// src/components/AuthButtons.tsx
// import React from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../firebase/firebase';

export const SignInButton = () => {
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Sign-in error', err);
    }
  };

  return (
    <button onClick={handleSignIn} className="bg-blue-600 text-white px-4 py-2 rounded">
      Sign in with Google
    </button>
  );
};

export const SignOutButton = () => {
  return (
    auth.currentUser && (
      <button onClick={() => signOut(auth)} className="bg-gray-600 text-white px-4 py-2 rounded">
        Sign out
      </button>
    )
  );
};
