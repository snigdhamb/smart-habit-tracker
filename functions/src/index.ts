import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
admin.initializeApp();

const db = admin.firestore();

export const copyCurrentHabitsToHabits = onSchedule(
  {
    schedule: "55 23 * * *",
    timeZone: "America/New_York", // Adjust if needed
  },
  async (event) => {
    const currentHabitsSnapshot = await db.collection("currentHabits").get();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split("T")[0];

    const batch = db.batch();

    currentHabitsSnapshot.forEach((doc) => {
      const habitData = doc.data();
      const newHabitRef = db.collection("habits").doc();

      batch.set(newHabitRef, {
        ...habitData,
        dateCreated: formattedDate,
        completed: false,
      });
    });

    await batch.commit();
    console.log(`Copied ${currentHabitsSnapshot.size} habits to 'habits' for ${formattedDate}`);
    return;
  }
);