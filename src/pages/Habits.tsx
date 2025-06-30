import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { NavBar } from "@/components/NavBar";

//ui
import { Center, Container, Heading, Button, Input, Stack, EmptyState, VStack, IconButton, Flex, Text, HStack, Editable, Card } from "@chakra-ui/react";

// icons
import { ImFilesEmpty } from "react-icons/im";
import { FaRegTrashCan } from "react-icons/fa6";
import { AiTwotoneEdit } from "react-icons/ai";
import { LuCheck, LuX } from "react-icons/lu";

interface Habit {
  id: string;
  name: string;
  complete: boolean;
  createdAt: Date;
  modifiedAt?: Date;
}

const Habits = () => {
  const [habitName, setHabitName] = useState("");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchHabits = async () => {
      // const snapshot = await getDocs(collection(db, "users", user.uid, "habits"));
      // setHabits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      const snapshot = await getDocs(collection(db, "users", user.uid, "habits"));
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const tomorrow = new Date(todayDate);
      tomorrow.setDate(todayDate.getDate() + 1);
      const filtered = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            complete: data.complete,
            createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
            modifiedAt: data.modifiedAt?.toDate?.() || new Date(data.modifiedAt ?? Date.now()),
          };
        })
        .filter(habit => {
          const habitDate = habit.createdAt?.toDate?.() || new Date(habit.createdAt);
          return (
            habitDate.getFullYear() === todayDate.getFullYear() &&
            habitDate.getMonth() === todayDate.getMonth() &&
            habitDate.getDate() === todayDate.getDate()
          );
        });
      setHabits(filtered);
    };
    fetchHabits();
  }, [user]);

  const addHabit = async () => {
    if (!user || !habitName.trim()) return;
    const newId = habitName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    const newHabit = {
      name: habitName.trim(),
      active: true,
      complete: false,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    await setDoc(doc(db, "users", user.uid, "habits", newId), newHabit);
    setHabitName("");
    setHabits((prev) => [...prev, { id: newId, ...newHabit }]);
  };

  const cancelUpdate = async () => {
    if (!user || !editText.trim()) return;
    setEditingId(null);
    setEditText("");
  }

  const updateHabit = async (id: string) => {
    if (!user || !editText.trim()) return;
    await updateDoc(doc(db, "users", user.uid, "habits", id), {
      name: editText.trim(),
      modifiedAt: new Date(),
    });
    setEditingId(null);
    setEditText("");
    const snapshot = await getDocs(collection(db, "users", user.uid, "habits"));
    const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const tomorrow = new Date(todayDate);
      tomorrow.setDate(todayDate.getDate() + 1);
      const filtered = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            complete: data.complete,
            createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
            modifiedAt: data.modifiedAt?.toDate?.() || new Date(data.modifiedAt ?? Date.now()),
          };
        })
        .filter(habit => {
          const habitDate = habit.createdAt?.toDate?.() || new Date(habit.createdAt);
          return (
            habitDate.getFullYear() === todayDate.getFullYear() &&
            habitDate.getMonth() === todayDate.getMonth() &&
            habitDate.getDate() === todayDate.getDate()
          );
        });
      setHabits(filtered);
  };

  const deleteHabit = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "habits", id));
      console.log(`Deleted habit with ID: ${id}`);
      // Optionally refresh snapshot to ensure consistency
      const snapshot = await getDocs(collection(db, "users", user.uid, "habits"));
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const tomorrow = new Date(todayDate);
      tomorrow.setDate(todayDate.getDate() + 1);
      const filtered = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            complete: data.complete,
            createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
            modifiedAt: data.modifiedAt?.toDate?.() || new Date(data.modifiedAt ?? Date.now()),
          };
        })
        .filter(habit => {
          const habitDate = habit.createdAt?.toDate?.() || new Date(habit.createdAt);
          return (
            habitDate.getFullYear() === todayDate.getFullYear() &&
            habitDate.getMonth() === todayDate.getMonth() &&
            habitDate.getDate() === todayDate.getDate()
          );
        });
      setHabits(filtered);
      // setHabits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  return (
    <>
      <NavBar />
      <Container pl={20}>
        <div className="p-10">
          <Center mb={20}>
            <Heading size={"3xl"}>Habits</Heading>
          </Center>

          {habits.length === 0 ? (
            <Container maxW="2xl">
              <Center><Stack direction={"row"} mt={10} mb={10}>
                <Input
                  w={400}
                  placeholder="Enter new habit"
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                />
                <Button onClick={addHabit} bgColor={"navy"}>
                  Add Habit
                </Button>
              </Stack></Center>
              <EmptyState.Root mt={50}>
                <EmptyState.Content>
                  <EmptyState.Indicator>
                    <ImFilesEmpty />
                  </EmptyState.Indicator>
                  <VStack textAlign="center">
                    <EmptyState.Title>You're not currently tracking any habits</EmptyState.Title>
                    <EmptyState.Description>
                      Add some above or utilize our habit generator to support your goals
                    </EmptyState.Description>
                  </VStack>
                    <Button
                      onClick={() => navigate("/generate-habits")}
                      bgColor={"selectiveYellow"}
                      size={"xs"}
                      fontSize={15}
                    >
                      Generate Habits
                    </Button>
                </EmptyState.Content>
              </EmptyState.Root>
            </Container>
          ) : (
            <Container maxW="2xl"  >
              <Center><Stack direction={"row"} mt={10} mb={10}>
                <Input
                  w={400}
                  placeholder="Enter new habit"
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                />
                <Button onClick={addHabit} bgColor={"navy"}>
                  Add Habit
                </Button>
              </Stack></Center>

                <Container mx="auto">
                {habits.map((habit) => (
                  <Stack key={habit.id}>
                    {editingId === habit.id ? (
                      <div className="flex gap-2 w-full">
                        <Input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="border rounded p-1 w-full"
                        />
                        <IconButton onClick={() => updateHabit(habit.id)} size={"xs"} color={"midnightGreen"}>
                          <LuCheck />
                        </IconButton>
                        <IconButton onClick={() => cancelUpdate()} size={"xs"} color={"midnightGreen"}>
                          <LuX />
                        </IconButton>
                      </div>
                    ) : (
                      <Card.Root w={"100%"} mt={2}>
                        <Card.Body py="2">
                          <Stack direction={"row"}>
                            <Flex justify="space-between" align="center" w="100%">
                              <Text>{habit.name}</Text>
                              <HStack>
                                <IconButton onClick={() => { setEditingId(habit.id); setEditText(habit.name); }} color="navy" size="sm" aria-label="Edit habit">
                                  <AiTwotoneEdit />
                                </IconButton>
                                <IconButton size="sm" onClick={() => deleteHabit(habit.id)} color="rust" aria-label="Delete habit">
                                  <FaRegTrashCan />
                                </IconButton>
                              </HStack>
                            </Flex>
                          </Stack>
                        </Card.Body>
                      </Card.Root>
                    )}
                  </Stack>
                ))}
                </Container>

                <Center>
                  <Button
                    onClick={() => navigate("/generate-habits")}
                    bgColor={"selectiveYellow"}
                    size={"sm"}
                    fontSize={15}
                    mt={20}
                  >
                    Generate habits that align with your goals
                  </Button>
                </Center>
              {/* </ul> */}
            </Container>
          )}
          
        </div>
      </Container>
    </>
  );
};

export default Habits;
