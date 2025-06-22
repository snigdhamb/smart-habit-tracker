import { db } from "../firebase/firebase";
import { doc, setDoc, collection } from "firebase/firestore";

export const addHabit = async (uid: string, name: string) => {
  const habitsRef = collection(db, "users", uid, "habits");
  const habitId = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
  await setDoc(doc(habitsRef, habitId), {
    name,
    active: true,
    createdAt: new Date(),
    modifiedAt: new Date(),
  });
};