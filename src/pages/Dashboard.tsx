import { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import CalendarHeatmap from 'react-calendar-heatmap';
import "react-calendar-heatmap/dist/styles.css";
import { addMonths, subMonths, startOfMonth, endOfMonth, format } from "date-fns";

interface HabitEntry {
  date: string;
  habitName: string;
  complete: boolean;
}

const Dashboard = () => {
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [habitNames, setHabitNames] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "users", userId, "habits"));
      const data: HabitEntry[] = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          date: new Date(d.createdAt?.toDate?.() || d.createdAt).toISOString().split("T")[0],
          habitName: d.name,
          complete: d.complete,
        };
      });
      setEntries(data);
      const names = Array.from(new Set(data.map(entry => entry.habitName)));
      setHabitNames(names);
    };

    fetchData();
  }, [userId]);

  const dateCompletionMap = entries.reduce((acc, entry) => {
    if (filter && !entry.habitName.toLowerCase().includes(filter.toLowerCase())) return acc;
    if (!acc[entry.date]) acc[entry.date] = { total: 0, complete: 0 };
    acc[entry.date].total += 1;
    if (entry.complete) acc[entry.date].complete += 1;
    return acc;
  }, {} as Record<string, { total: number; complete: number }>);

  const heatmapValues = Object.keys(dateCompletionMap)
    .filter((date) => {
      const d = new Date(date);
      return d >= startOfMonth(currentMonth) && d <= endOfMonth(currentMonth);
    })
    .map((date) => ({
      date,
      count: dateCompletionMap[date].complete / dateCompletionMap[date].total,
    }));

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <select
        className="border p-2 mb-4"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="">All Habits</option>
        {habitNames.map((name, idx) => (
          <option key={idx} value={name}>
            {name}
          </option>
        ))}
      </select>
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>← Prev</button>
        <span className="font-semibold">{format(currentMonth, "MMMM yyyy")}</span>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>Next →</button>
      </div>
      <CalendarHeatmap
        startDate={startOfMonth(currentMonth)}
        endDate={endOfMonth(currentMonth)}
        values={heatmapValues}
        classForValue={(value) => {
          if (!value) return "color-empty";
          const ratio = value.count || 0;
          if (ratio === 0) return "color-scale-1";
          if (ratio < 0.25) return "color-scale-2";
          if (ratio < 0.50) return "color-scale-3";
          if (ratio < 0.75) return "color-scale-4";
          return "color-scale-5";
        }}
        tooltipDataAttrs={(value) => ({
          "data-tip": `${value.date}: ${((value.count || 0) * 100).toFixed(0)}% complete`,
        })}
        // showWeekdayLabels
      />
      <style>{`
        .color-empty { fill: #eee; }
        .color-scale-1 { fill:rgb(249, 142, 121); }
        .color-scale-2 { fill:rgb(123, 199, 151); }
        .color-scale-3 { fill:rgb(79, 166, 111); }
        .color-scale-4 { fill:rgb(39, 130, 72); }
        .color-scale-5 { fill:rgb(9, 88, 38); }
      `}</style>
    </div>
  );
};

export default Dashboard;