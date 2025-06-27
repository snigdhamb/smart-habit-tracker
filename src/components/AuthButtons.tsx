// src/components/AuthButtons.tsx
// import React from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../firebase/firebase';
import { Button } from '@chakra-ui/react';

export const SignInButton = () => {
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Sign-in error', err);
    }
  };

  return (
    <Button onClick={handleSignIn} bgColor={'teal.600'}>
      Sign in with Google
    </Button>
  );
};

export const SignOutButton = () => {
  return (
    auth.currentUser && (
      <Button onClick={() => signOut(auth)} bgColor={'gray.300'}>
        Sign out
      </Button>
    )
  );
};
