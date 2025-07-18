import React, { useState, useRef } from 'react';
import { db, auth } from "../firebase/firebase";
import {
  doc,
  setDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { NavBar } from '@/components/NavBar';

import { Heading, Container, Center, Input, Button, ProgressCircle, Stack, Wrap, Dialog, Alert, Em} from '@chakra-ui/react';

import { keyframes } from '@emotion/react';


interface Habit {
  id: string;
  name: string;
  complete: boolean;
  createdAt: Date;
  modifiedAt?: Date;
}

const GenerateHabits: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedHabits, setSelectedHabits] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  // const [showDelayAlert, setShowDelayAlert] = useState(false); // obsolete, will remove
  // const [alertVisible, setAlertVisible] = useState(false); // obsolete, will remove
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const user = auth.currentUser;
  const navigate = useNavigate();

  const slideDown = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  `;
  // const fadeOut = keyframes`
  //   from { opacity: 1; }
  //   to { opacity: 0; }
  // `;

  const addHabit = async (name: string) => {
    if (!user || !name.trim()) return;
    const newId = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    const newHabit = {
      name: name.trim(),
      active: true,
      complete: false,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    await setDoc(doc(db, "users", user.uid, "habits", newId), newHabit);
    setHabits((prev) => [...prev, { id: newId, ...newHabit }]);
    console.log(habits);
  };

  const toggleHabit = (suggestion: string) => {
    const trimmed = suggestion.trim();
    setSelectedHabits((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(trimmed)) {
        newSet.delete(trimmed);
      } else {
        newSet.add(trimmed);
      }
      return newSet;
    });
  };

  const handleGenerate = async () => {
    if (!goal.trim()) return;

    setLoading(true);
    setError('');
    setLoadingMessage(null);
    // Clear any previous timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    // Stage loading messages
    timeoutsRef.current.push(setTimeout(() => {
      setLoadingMessage("Building a plan that fits your goals…");
    }, 4000));
    timeoutsRef.current.push(setTimeout(() => {
      setLoadingMessage(null);
    }, 8000));
    timeoutsRef.current.push(setTimeout(() => {
      setLoadingMessage("Fine-tuning your habit blueprint…");
    }, 12000));
    timeoutsRef.current.push(setTimeout(() => {
      setLoadingMessage(null);
    }, 16000));
    timeoutsRef.current.push(setTimeout(() => {
      setLoadingMessage("Just a moment more…");
    }, 20000));
    try {
      const response = await fetch('https://habit-generator.onrender.com/generate-habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goal }),
      });

      if (!response.ok) throw new Error('Failed to fetch habits');

      const data = await response.json();
      setSuggestions(data.habits); // Assumes API returns { habits: [...] }
      // Clear all timeouts and hide loading messages
      timeoutsRef.current.forEach(clearTimeout);
      setLoadingMessage(null);
    } catch (err) {
      console.error('API error:', err);
      setError('Error generating habits. Please try again.');
      timeoutsRef.current.forEach(clearTimeout);
      setLoadingMessage(null);
    } finally {
      setLoading(false);
      timeoutsRef.current.forEach(clearTimeout);
    }
  };

  const handleContinue = async () => {
    if (selectedHabits.size === 0) {
      setShowDialog(true);
      return;
    }
    for (const suggestion of selectedHabits) {
      await addHabit(suggestion);
    }
    navigate("/");
  };

  const confirmContinue = async () => {
    for (const suggestion of selectedHabits) {
      await addHabit(suggestion);
    }
    navigate("/");
  };

  // TEMPORARY: Developer utility to seed mock habits for July 1–6, 2025
  // const seedMockHabits = async () => {
  //   if (!user) return;

  //   const baseHabits = [
  //     "do ten pushups daily",
  //     "drink eight glasses of water",
  //     "go to bed before eleven pm",
  //     "meditate for five minutes",
  //     "walk at least thirty minutes"
  //   ];

  //   const start = new Date("2025-07-01");
  //   for (let day = 0; day < 7; day++) {
  //     const date = new Date(start);
  //     date.setDate(start.getDate() + day);
  //     const numComplete = Math.floor(Math.random() * 3) + 3; // 3 to 5
  //     const selected = baseHabits
  //       .map(habit => ({ habit, sort: Math.random() }))
  //       .sort((a, b) => a.sort - b.sort)
  //       .slice(0, numComplete)
  //       .map(obj => obj.habit);

  //     for (let habitName of baseHabits) {
  //       const id = `${habitName.replace(/\s+/g, "-")}-${date.toISOString().split("T")[0]}-${Date.now()}`;
  //       const complete = selected.includes(habitName);
  //       const habit = {
  //         name: habitName,
  //         active: true,
  //         complete,
  //         createdAt: date,
  //         modifiedAt: date,
  //       };
  //       await setDoc(doc(db, "users", user.uid, "habits", id), habit);
  //     }
  //   }

  //   alert("Mock habits generated from July 1–6, 2025");
  // };

  return (
    <>
      <NavBar />
      
      <Container maxW="6xl">
        
        <Center mb={20}>
          <Heading size={"3xl"} animation={`${slideDown} 0.3s ease-out`}  opacity={0} animationFillMode="forwards">Generate Habits</Heading>
        </Center>

        <Stack direction={"row"} mb={10} animation={`${slideDown} 0.3s ease-out`}  opacity={0} animationFillMode="forwards" animationDelay={"0.2s"}>
          <Input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Enter your vague goal..."
          />
          <Button
            onClick={handleGenerate}
            disabled={!goal.trim()}
            bgColor={"selectiveYellow"}
          >
            {loading ? (
              <ProgressCircle.Root value={null} size="xs">
                <ProgressCircle.Circle>
                  <ProgressCircle.Track />
                  <ProgressCircle.Range stroke={"navy"} />
                </ProgressCircle.Circle>
              </ProgressCircle.Root>
            ) : (
              'Generate Habits'
            )}
          </Button>
        </Stack>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {loadingMessage && (
          <Center mt={4}>
            <Alert.Root
              status="info"
              width="xs"
              animation={`${slideDown} 0.3s ease-out`}
              animationFillMode="forwards"
            >
              <Alert.Indicator />
              <Em>
                <Alert.Title>{loadingMessage}</Alert.Title>
              </Em>
            </Alert.Root>
          </Center>
        )}

        <Wrap gap="4">
          {suggestions.map((suggestion, idx) => {
            const selected = selectedHabits.has(suggestion.trim());
            return (
              <Button
                key={idx}
                onClick={() => toggleHabit(suggestion)}
                bgColor={selected ? 'navy' : 'blueGray'}
                color="white"
                _hover={{ bg: selected ? 'navy' : 'blueGray' }}
                animation={`${slideDown} 0.3s ease-out`}
                animationFillMode="forwards"
                opacity={0}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {suggestion}
              </Button>
            );
          })}
        </Wrap>
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleContinue}
            bgColor={"rust"}
            mt={20}
            animation={`${slideDown} 0.3s ease-out`}  opacity={0} animationFillMode="forwards" animationDelay={"0.4s"}
          >
            Continue
          </Button>
        </div>
        <Dialog.Root open={showDialog} role="alertdialog">
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Confirmation</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p>You haven't selected any habits. Are you sure you want to continue?</p>
              </Dialog.Body>
              <Dialog.Footer>
                <Button bgColor={"rust"} onClick={() => setShowDialog(false)}>No</Button>
                <Button bgColor={"midnightGreen"} onClick={() => { confirmContinue(); setShowDialog(false); }}>
                  Yes
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
        {/* <Center mt={10}>
          <Button onClick={seedMockHabits} bgColor="midnightGreen">
            Generate Mock Habits
          </Button>
        </Center> */}
      </Container>
    </>
  );
};

export default GenerateHabits;