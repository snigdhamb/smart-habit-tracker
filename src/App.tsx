import { useEffect, useState } from "react";
import { db, auth } from "./firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Habits from "./pages/Habits";
import Dashboard from "./pages/Progress";
import { useNavigate } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import GenerateHabits from "./pages/GenerateHabits";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { WelcomeMessage } from "./components/WelcomeMessage";
import { NavBar } from "./components/NavBar";
import { keyframes } from '@emotion/react';
import { useSpring, animated } from 'react-spring';

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

/* UI Imports */
import { HiColorSwatch } from "react-icons/hi";
import { Heading, Center, Highlight, Button, ButtonGroup, EmptyState, VStack, Container, Stack, Card, Flex, Text, For, Box} from "@chakra-ui/react";
import SignIn from "./pages/SignIn";
import Sidebar from "./components/SideBar";
import { FaFire } from "react-icons/fa6";

interface Habit {
  id: string;
  name: string;
  complete: boolean;
  createdAt: Date;
  modifiedAt?: Date;
}

const App = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitsLoaded, setHabitsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loginStreak, setLoginStreak] = useState<number>(0);
  const [loginStreakLoaded, setLoginStreakLoaded] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const slideDown = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  `;
  const slideRight = keyframes`
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateY(0); }
  `;
  // const fadeIn = keyframes`
  //   from { opacity: 0; }
  //   to { opacity: 1; }
  // `;

  <Router></Router>;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      let isNewUser = false;
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const lastLogin = userData.lastLogin?.toDate?.() || new Date(userData.lastLogin);
          lastLogin.setHours(0, 0, 0, 0);
          const diff = (today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24);
          let newStreak = userData.loginStreak || 0;
          if (diff === 1) {
            newStreak += 1;
          } else if (diff > 1) {
            newStreak = 1;
            
  // const slideDown = keyframes`
  //   from { opacity: 0; transform: translateY(10px); }
  //   to { opacity: 1; transform: translateY(0); }
  // `;
  // const slideRight = keyframes`
  //   from { opacity: 0; transform: translateX(-10px); }
  //   to { opacity: 1; transform: translateY(0); }
  // `;
  // const fadeIn = keyframes`
  //   from { opacity: 0; }
  //   to { opacity: 1; }
  // `;

          }
          await updateDoc(userDocRef, {
            displayName: currentUser.displayName || "",
            lastLogin: new Date(),
            loginStreak: newStreak,
          });
          setLoginStreak(newStreak);
          setLoginStreakLoaded(true);
        } else {
          isNewUser = true;
          await setDoc(userDocRef, {
            displayName: currentUser.displayName || "",
            lastLogin: new Date(),
            loginStreak: 1,
          });
          setLoginStreak(1);
          setLoginStreakLoaded(true);
        }
      }
      if (isNewUser) {
        navigate("/onboarding");
      }
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || location.pathname !== "/") return;
    const fetchHabits = async () => {
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
      setHabitsLoaded(true);
    };
    fetchHabits();
  }, [user, location]);

  const markComplete = async (id: string) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid, "habits", id), {
      complete: true,
      modifiedAt: new Date(),
    });
    setHabits(prev =>
      prev.map(habit =>
        habit.id === id ? { ...habit, complete: true, modifiedAt: new Date() } : habit
      )
    );
  };

  const markInComplete = async (id: string) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid, "habits", id), {
      complete: false,
      modifiedAt: new Date(),
    });
    setHabits(prev =>
      prev.map(habit =>
        habit.id === id ? { ...habit, complete: false, modifiedAt: new Date() } : habit
      )
    );
  };

  const streakSpring = useSpring({
    from: { number: 0 },
    to: { number: loginStreak },
    reset: true,
    config: { duration: 800 },
    onRest: () => setInitialLoad(false)
  });

  if (!user) {
    return (
      <SignIn />
    );
  }

  return (
    <div className="flex h-screen w-screen font-sans bg-[#fdfcfb]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-12">
          <Routes>
            <Route
              path="/"
              element={
              <>
                <NavBar />
                <Container maxW="3xl">
                  {/* Top nav */}

                  {/* Header section */}
                  <Container mb={10}>
                    <Center mb={10}>
                      <Heading size="3xl" letterSpacing="tight" animation={`${slideDown} 0.4s ease-out`}  opacity={0} animationFillMode="forwards">
                        <Highlight
                          query={user?.displayName?.split(" ")[0] || "User"}
                          styles={{ color: "teal.600" }}
                        >
                          {`Welcome, ${user?.displayName?.split(" ")[0] || "User"}`}
                        </Highlight>
                      </Heading>
                    </Center>
                    {/* <Center mr={10}> */}
                    <Flex align="center" mb={2} animation={`${slideDown} 0.4s ease-out`} opacity={0} animationFillMode="forwards" animationDelay={"0.1s"}>
                      <FaFire color="orange" size="26px" style={{ marginRight: "10px" }} />
                      <Text mb={0} fontSize="xl" fontWeight="bold">
                        Login Streak:{' '}
                        {loginStreakLoaded ? (
                          initialLoad ? (
                            <animated.span>
                              {streakSpring.number.to((n: number) => `${Math.floor(n)} day${Math.floor(n) === 1 ? '' : 's'}`)}
                            </animated.span>
                          ) : (
                            <span>
                              {`${loginStreak} day${loginStreak === 1 ? '' : 's'}`}
                            </span>
                          )
                        ) : (
                          'Counting...'
                        )}
                      </Text>
                    </Flex>
                    {/* </Center> */}
                    <Box minH="60px">
                      {loginStreakLoaded && (
                        <Container
                          animation={`${slideRight} 0.4s ease-out`}
                          opacity={0}
                          animationFillMode="forwards"
                          animationDelay={"0.6s"}
                        >
                          <WelcomeMessage loginStreak={loginStreak} />
                        </Container>
                      )}
                    </Box>
                  </Container>

                  <Heading size="xl"
                    animation={`${slideDown} 0.4s ease-out`}  opacity={0} animationFillMode="forwards" animationDelay={"0.3s"}>
                    My Habits
                  </Heading>

                  {/* Today's Habits */}
                  {!habitsLoaded ? (
                    <></>
                  ) : habits.length === 0 ? (
                    <EmptyState.Root animation={`${slideDown} 0.3s ease-out`}  opacity={0} animationFillMode="forwards" animationDelay={"0.1s"}>
                      <EmptyState.Content>
                        <EmptyState.Indicator>
                          <HiColorSwatch />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                          <EmptyState.Title>Momentum starts with one tap.</EmptyState.Title>
                          <EmptyState.Description>
                            No pressure, just progress--add a habit to kick things off
                          </EmptyState.Description>
                        </VStack>
                        <ButtonGroup>
                          <Button onClick={() => navigate("/habits")} colorPalette={"teal"} variant={"surface"}>
                            Add Habits
                          </Button>
                        </ButtonGroup>
                      </EmptyState.Content>
                    </EmptyState.Root>
                  ) : (
                    <Container mx="auto">
                      {/* {habits.map((habit) => ( */}
                      <For each={habits}>
                        {(habit, index) => (
                        <Stack key={habit.id}>
                          <Card.Root w={"100%"} mt={2}
                            animation={`${slideDown} 0.4s ease-out`}  opacity={0} animationFillMode="forwards" animationDelay={`${0.15 * index + 0.3}s`}>
                            <Card.Body py="2">
                              <Stack direction={"row"}>
                                <Flex justify="space-between" align="center" w="100%" >
                                  <span>{habit.name}</span>
                                  <label className="flex items-center space-x-2 text-red-600">
                                    <input  
                                      type="checkbox"
                                      checked={habit.complete}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          markComplete(habit.id);
                                        } else {
                                          markInComplete(habit.id);
                                        }
                                      }}
                                    />
                                  </label>
                                </Flex>
                              </Stack>
                            </Card.Body>
                          </Card.Root>
                        </Stack>
                      )}
                      </For>
                      {/* ))} */}
                    </Container>
                  )}
                </Container>
              </>
              }
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/generate-habits" element={<GenerateHabits />}/>
            <Route path="/about" element={<About />}/>
            <Route path="/contact" element={<Contact />}/>
          </Routes>
      </div>
    </div>
  );
};

export default App;