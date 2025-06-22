import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export const getCompletionsForDate = async (uid: string, date: string) => {
  const docRef = doc(db, "users", uid, "habitCompletions", date);
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data().completedHabits : [];
};