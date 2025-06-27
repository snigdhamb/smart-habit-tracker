import { useEffect, useState } from "react";
import { db, auth } from "./firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Habits from "./pages/Habits";
import Dashboard from "./pages/Dashboard";
import { useNavigate } from "react-router-dom";
import { SignInButton } from "./components/AuthButtons";
import Onboarding from "./pages/Onboarding";
import GenerateHabits from "./pages/GenerateHabits";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { WelcomeMessage } from "./components/WelcomeMessage";
import { NavBar } from "./components/NavBar";

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
import { Heading, Center, Highlight, Button, ButtonGroup, EmptyState, VStack, Stack} from "@chakra-ui/react";
import SignIn from "./pages/SignIn";

interface Habit {
  id: string;
  name: string;
  complete: boolean;
  createdAt: Date;
  modifiedAt?: Date;
}

const App = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loginStreak, setLoginStreak] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();

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
          }
          await updateDoc(userDocRef, {
            lastLogin: new Date(),
            loginStreak: newStreak,
          });
          setLoginStreak(newStreak);
        } else {
          isNewUser = true;
          await setDoc(userDocRef, {
            lastLogin: new Date(),
            loginStreak: 1,
          });
          setLoginStreak(1);
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
    };
    fetchHabits();
  }, [user, location]);

  const markComplete = async (id: string) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid, "habits", id), {
      complete: true,
      modifiedAt: new Date(),
    });
    const snapshot = await getDocs(collection(db, "users", user.uid, "habits"));
    setHabits(snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        complete: data.complete,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
        modifiedAt: data.modifiedAt?.toDate?.() || new Date(data.modifiedAt ?? Date.now()),
      };
    }));
  };

  const markInComplete = async (id: string) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid, "habits", id), {
      complete: false,
      modifiedAt: new Date(),
    });
    const snapshot = await getDocs(collection(db, "users", user.uid, "habits"));
    setHabits(snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        complete: data.complete,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
        modifiedAt: data.modifiedAt?.toDate?.() || new Date(data.modifiedAt ?? Date.now()),
      };
    }));
  };

  if (!user) {
    return (
      <SignIn />
    );
  }

  return (
    <div className="flex min-h-screen font-sans bg-[#fdfcfb]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2ab9a3] text-white p-8 flex flex-col justify-between rounded-r-3xl">
        <div>
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#2ab9a3] font-bold text-base">✓</span>
            </div>
          </div>
            <nav className="space-y-5">
              <Stack>
                <Button onClick={() => navigate("/")} bgColor={"teal"}>
                  <span>Home</span>
                </Button>

                <Button onClick={() => navigate("/dashboard")} colorPalette={"teal"} variant={"outline"}>
                  <span>Progress</span>
                </Button>

                <Button onClick={() => navigate("/habits")} colorPalette={"teal"} variant={"outline"}>
                  <span>Habits</span>
                </Button>

                <Button onClick={() => navigate("/settings")} colorPalette={"teal"} variant={"outline"}>
                  <span>Settings</span>
                </Button>
              </Stack>
            </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-12">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {/* Top nav */}
                  <NavBar username={user?.displayName?.split(" ")[0] || "User"}/>

                  {/* Header section */}
                  <div className="max-w-3xl">
                    {/* <h1 className="text-4xl font-bold text-[#123d6a] mb-3 leading-tight"> */}
                    <Center>
                      <Heading size="3xl" letterSpacing="tight">
                        <Highlight
                          query={user?.displayName?.split(" ")[0] || "User"}
                          styles={{ color: "teal.600" }}
                        >
                          {`Welcome, ${user?.displayName?.split(" ")[0] || "User"}`}
                        </Highlight>
                      </Heading>
                    </Center>
                    {/* </h1> */}
                    <p className="text-green-700 font-semibold mb-2">🔥 Login Streak: {loginStreak} day{loginStreak === 1 ? "" : "s"}</p>
                    <WelcomeMessage loginStreak={loginStreak}/>
                  </div>

                  <Heading size="xl">My Habits</Heading>

                  {/* Today's Habits */}
                  {habits.length === 0 ? (
                    <EmptyState.Root>
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
                          <Button onClick={() => navigate("/habits")} colorPalette={"teal"} variant={"surface"}>Add Habits</Button>
                        </ButtonGroup>
                      </EmptyState.Content>
                    </EmptyState.Root>
                  ) : (
                    <ul className="space-y-3">
                      {habits.map((habit) => (
                        <li key={habit.id} className="flex justify-between items-center p-4 border rounded bg-blue-100 hover:bg-blue-200 transition">
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
                            {/* <span>Complete</span> */}
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
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