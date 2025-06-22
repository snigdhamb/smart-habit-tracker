import { db } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getHabitsForToday = async (uid: string) => {
  const q = query(
    collection(db, "users", uid, "habits"),
    where("active", "==", true)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};