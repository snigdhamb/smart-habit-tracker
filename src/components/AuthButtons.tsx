// src/components/AuthButtons.tsx
// import React from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../firebase/firebase';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // assuming you exported db from firebase.ts

export const SignInButton = () => {
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // const info = getAdditionalUserInfo(result);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        navigate('/onboarding');
      } else {
        navigate('/');
      }
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
      <Button onClick={() => signOut(auth)} bgColor={"rust"}>
        Sign out
      </Button>
    )
  );
};
