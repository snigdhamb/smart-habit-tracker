import React, { useState } from 'react';
import { db, auth } from "../firebase/firebase";
import {
  doc,
  setDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { NavBar } from '@/components/NavBar';

import { Heading, Container, Center, Input, Button, ProgressCircle, Stack, Wrap, Dialog } from '@chakra-ui/react';

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

  const user = auth.currentUser;
  const navigate = useNavigate();

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
      console.log(data);
      setSuggestions(data.habits); // Assumes API returns { habits: [...] }
    } catch (err) {
        console.error('API error:', err);
        setError('Error generating habits. Please try again.');
      } finally {
      setLoading(false);
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

  return (
    <>
      <NavBar />
      
      <Container maxW="6xl">
        
        <Center mb={20}>
          <Heading size={"3xl"}>Generate Habits</Heading>
        </Center>

        <Stack direction={"row"} mb={10}>
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
      </Container>
    </>
  );
};

export default GenerateHabits;