import { db } from "../firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const markHabitComplete = async (
  uid: string,
  date: string, // e.g. "2025-06-21"
  habitId: string
) => {
  const dateDocRef = doc(db, "users", uid, "habitCompletions", date);
  const existing = await getDoc(dateDocRef);

  const prev = existing.exists() ? existing.data().completedHabits : [];

  await setDoc(dateDocRef, {
    completedHabits: [...new Set([...prev, habitId])],
  });
};