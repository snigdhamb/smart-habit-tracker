import { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import CalendarHeatmap from 'react-calendar-heatmap';
import "react-calendar-heatmap/dist/styles.css";
import { addMonths, subMonths, startOfMonth, endOfMonth, format, startOfWeek, endOfWeek } from "date-fns";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
import { Heading, Container, Center, Stack } from "@chakra-ui/react";
import { NavBar } from "@/components/NavBar";
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

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

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  // Weekly Completion Chart (Monday–Sunday)
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekStartDate = startOfWeek(new Date(), { weekStartsOn: 1 });

  const weeklyData = Array(7).fill(null).map((_, idx) => {
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + idx);
    const isoDate = date.toISOString().split("T")[0];
    const entriesForDate = entries.filter(entry => entry.date === isoDate && (!filter || entry.habitName === filter));
    const total = entriesForDate.length;
    const complete = entriesForDate.filter(e => e.complete).length;
    return {
      label: weekDays[idx],
      percent: total === 0 ? 0 : (complete / total) * 100,
    };
  });

  const weeklyChartData = {
    labels: weeklyData.map(d => d.label),
    datasets: [
      {
        label: 'Completion %',
        data: weeklyData.map(d => d.percent),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: function (value: number | string) {
            return `${value}%`;
          },
        },
      },
    },
  };

  // Heatmap Stuff 
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
      <NavBar />
      <Container pl={20}>
        <Center mb={10}>
          <Heading size={"3xl"}>Progress</Heading>
        </Center>
        {/* Weekly Completion Line Chart */}
        <Stack>
            <Heading size={"xl"}>This Week's Completion Rate</Heading>
          <Container style={{ height: '250px', width: '500px'}}>
            <Line data={weeklyChartData} options={chartOptions} />
          </Container>
        </Stack>
        <style>{`
          .color-empty { fill: #eee; }
          .color-scale-1 { fill:rgb(255, 169, 175); }
          .color-scale-2 { fill:rgb(255, 186, 112); }
          .color-scale-3 { fill:rgb(200, 236, 132); }
          .color-scale-4 { fill:rgb(100, 194, 134); }
          .color-scale-5 { fill:rgb(47, 128, 77); }
        `}</style>

        {/* Heatmap */}
        <div className="flex justify-center">
          <Heading size={"xl"}>Daily Activity</Heading>
        </div>
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
      </Container>
    </div>
  );
};

export default Dashboard;