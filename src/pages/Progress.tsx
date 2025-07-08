import { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, startOfWeek } from "date-fns";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
import { Heading, Container, Center, Stack, Grid, GridItem, Alert, For, Flex, ProgressCircle, AbsoluteCenter, Box } from "@chakra-ui/react";
import { NavBar } from "@/components/NavBar";
import { keyframes } from '@emotion/react';
import { FaRegCircleCheck, FaRegCircleXmark } from "react-icons/fa6";



ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

interface HabitEntry {
  date: string;
  habitName: string;
  complete: boolean;
}

const Dashboard = () => {
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [filter] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [habitNames, setHabitNames] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const slideDown = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  `;


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
          date: format(new Date(d.createdAt?.toDate?.() || d.createdAt), 'yyyy-MM-dd'),
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

  // Consistency Score and Best/Worst Habit
  const totalEntries = entries.length;
  const completedEntries = entries.filter(e => e.complete).length;
  const consistencyScore = totalEntries === 0 ? 0 : (completedEntries / totalEntries) * 100;

  const habitStats = habitNames.map(name => {
    const habitEntries = entries.filter(e => e.habitName === name);
    const total = habitEntries.length;
    const complete = habitEntries.filter(e => e.complete).length;
    const percent = total === 0 ? 0 : (complete / total) * 100;
    return { name, percent };
  });
  const sortedHabits = [...habitStats].sort((a, b) => b.percent - a.percent);
  const bestHabit = sortedHabits[0]?.name || 'N/A';
  const worstHabit = sortedHabits[sortedHabits.length - 1]?.name || 'N/A';

  // Weekly Completion Chart (Monday–Sunday)
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
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

  const getTileClassName = ({ date }: { date: Date }) => {
    const isoDate = date.toISOString().split("T")[0];
    const data = dateCompletionMap[isoDate];
    if (!data) return "color-empty";
    const ratio = data.complete / data.total;
    // if (ratio === 0) return "color-scale-1";
    if (ratio < 0.20) return "color-scale-1";
    if (ratio < 0.50) return "color-scale-2";
    if (ratio < 0.75) return "color-scale-3";
    return "color-scale-4";
  };

  const habitsForSelectedDate = selectedDate
    ? entries.filter(entry => entry.date === selectedDate.toISOString().split("T")[0])
    : [];

  return (
    <div className="p-8" style={{ height: '100vh', overflowY: 'auto' }}>
      <NavBar />
      <Container pl={20}>
        <Center mb={10}>
          <Heading size={"3xl"} animation={`${slideDown} 0.3s ease-out`}  opacity={0} animationFillMode="forwards" mb={10}>
            Dashboard
          </Heading>
        </Center>

        <Grid templateColumns="repeat(12, 1fr)" rowGap={20} mb={20}>
          <GridItem colSpan={[6, 6]}>
            <Flex align="center" gap={6} justify="flex-start">
              <Heading size="lg" whiteSpace="nowrap" 
                animation={`${slideDown} 0.3s ease-out`}  opacity={0} animationFillMode="forwards" animationDelay={"0.1s"}>
                  Overall Consistency:
              </Heading>
              <ProgressCircle.Root
                size="xl"
                value={consistencyScore}
                colorPalette={
                  consistencyScore > 79 ? "green" :
                  consistencyScore > 59 ? "teal" :
                  consistencyScore > 39 ? "yellow" :
                  "red"
                }
                animation={`${slideDown} 0.3s ease-out`}  opacity={0} animationFillMode="forwards" animationDelay={"0.1s"}
              >
                <ProgressCircle.Circle>
                  <ProgressCircle.Track />
                  <ProgressCircle.Range />
                </ProgressCircle.Circle>
                <AbsoluteCenter>
                  <ProgressCircle.ValueText fontSize="xl" fontWeight="bold" />
                </AbsoluteCenter>
              </ProgressCircle.Root>
            </Flex>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <Container
              bg="gray.50" p={6} borderRadius="lg" boxShadow="md"
              animation={`${slideDown} 0.3s ease-out`} opacity={0}
              animationFillMode="forwards" animationDelay={"0.2s"}
            >
              <Heading size="md" mb={4}>Habit Performance</Heading>
              <Stack gap={3}>
                <Flex align="center" gap={3}>
                  <FaRegCircleCheck color="green" />
                  <strong>Best:</strong> {bestHabit}
                </Flex>
                <Flex align="center" gap={3}>
                  <FaRegCircleXmark color="red" />
                  <strong>Worst:</strong> {worstHabit}
                </Flex>
              </Stack>
            </Container>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <Heading size="lg" mb={2}
              animation={`${slideDown} 0.3s ease-out`}  opacity={0} animationFillMode="forwards" animationDelay={"0.2s"}>
              Calendar View
            </Heading>
            <Container animation={`${slideDown} 0.3s ease-out`}  opacity={0} animationFillMode="forwards" animationDelay={"0.3s"}>
              <Calendar
                value={currentMonth}
                onChange={(value) => {
                  if (value instanceof Date) {
                    setSelectedDate(value);
                    setCurrentMonth(value);
                  }
                }}
                tileClassName={getTileClassName}
              />
            </Container>
            <Box mt={4} animation={`${slideDown} 0.3s ease-out`}  opacity={0} animationFillMode="forwards" animationDelay={"0.4s"}>
              {selectedDate ? (
                <Stack>
                  <Heading size="md">
                    {selectedDate.toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}:
                  </Heading>
                  <Stack key={selectedDate?.toISOString()}>
                    <For each={habitsForSelectedDate}>
                      {(entry, index) => (
                        <Flex
                          key={entry.habitName}
                          gap={8}
                          align="center"
                          animation={`${slideDown} 0.3s ease-out`}
                          animationFillMode="forwards"
                          animationDelay={`${0.1 * index}s`}
                          opacity={0}
                        >
                          {entry.complete ? <FaRegCircleCheck color="green" /> : <FaRegCircleXmark color="red" />}
                          {entry.habitName}
                        </Flex>
                      )}
                    </For>
                  </Stack>
                </Stack>
              ) : (
                <Alert.Root w={"80%"}>
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>Snapshot</Alert.Title>
                    <Alert.Description>Select a date on the calendar to see your habit completion for that day</Alert.Description>
                  </Alert.Content>
                </Alert.Root>
              )}
            </Box>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <Heading size="lg" mb={2} animation={`${slideDown} 0.3s ease-out`}  opacity={0} animationFillMode="forwards" animationDelay={"0.3s"}>
              This Week's Completion Rate
            </Heading>
            <Box width="100%" height="400px" animation={`${slideDown} 0.3s ease-out`}  opacity={0} animationFillMode="forwards" animationDelay={"0.4s"}>
              <Line data={weeklyChartData} options={chartOptions} />
            </Box>
          </GridItem>
        </Grid>


        
        <style>{`
          .color-empty { background: ; }
          .color-scale-1 { background: rgb(253, 148, 138); }
          .color-scale-2 { background: rgb(250, 153, 117); }
          .color-scale-3 { background: rgb(123, 212, 126); }
          .color-scale-4 { background: rgb(75, 166, 108); }
          .react-calendar__tile:hover {
            background-color: #cce4ff !important;
          }
        `}</style>
      </Container>
      
    </div>
  );
};

export default Dashboard;