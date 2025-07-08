// src/pages/About.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Text, Heading, Container, Center, Stack, Em, For } from "@chakra-ui/react";
import { Prose } from "@/components/ui/prose";
import { NavBar } from "@/components/NavBar";
import Contact from "./Contact";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { keyframes } from '@emotion/react';

const html = String.raw

const p1 = html`
  <p>
    Having ADHD means the idea of routine has always felt…slippery.
    Some days, I’m all in—productive, organized, crossing everything off my list.
    Other days, I blink and the day is over, and I’ve forgotten to eat lunch or take my vitamins.
  </p>
`
const p2 = html`
  <p>
    For a while, I kept a super detailed planner.
    Notion and Google Calendar were my everything—color-coded blocks, weekly reviews, mood tracking.
    But even with all that structure, something was still missing.
  </p>
`
const p3 = html`
  <p>
    The tiny habits.
    The repetitive ones.
    The ones you’re supposed to do every single day, forever.
  </p>
`
const p4 = html`
  <p>
    Things like washing my face. Stretching. Making my bed.
    They sound simple, but they’d slip through the cracks because I didn’t feel like writing them down again and again.
    And un-checking the same box in Notion each morning? Exhausting.
  </p>
`
const p5 = html`
  <p>
    I knew I needed a better way.
    Something that didn’t feel like a chore.
    Something that helped me see my progress—even in the mundane.
  </p>
`
const p6 = html`
  <p>
    So I made this.
  </p>
`
const p7 = html`
  <p>
    A space to track the small stuff.
    A place to gamify self-discipline.
    A tool to make habit-building less overwhelming—and maybe even a little fun.
  </p>
`
const p8 = html`
  <p>
    Because self-care isn’t just face masks and movies (though those are great too).
    It’s brushing your teeth when you’re tired.
    It’s texting someone back.
    It’s choosing to show up for your future self—one tiny decision at a time.
  </p>
`
const p9 = html`
  <p>
    This app helps me do that.
    And if you’re anything like me, maybe it’ll help you too.
  </p>
`
const p10 = html`
  <p>
    With love,
    Snigdha
  </p>

`

const paragraphs  = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10]

const About = () => {
  const [user, setUser] = useState<User | null>(null);
  const slideDown = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  `;
  useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          setUser(currentUser);
      });
      return () => unsubscribe();
    }, []);
  
  <Router></Router>;
  
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8f9fa" }}>
      {/* Top nav */}
      <div style={{ flexShrink: 0 }}>
        <NavBar />
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div className="p-12 max-w-xl mx-auto">
          <Center>
            <Heading mb={10} size={"3xl"} animation={`${slideDown} 0.4s ease-out`}  opacity={0} animationFillMode="forwards">
              About
            </Heading>
          </Center>
          <Center>
            <Stack mb={40}>
              <Heading size={"md"} animation={`${slideDown} 0.6s ease-out`}  opacity={0} animationFillMode="forwards" animationDelay={"0.2s"}>
                <Em>Dear {user?.displayName?.split(" ")[0] || "User"},</Em>
              </Heading>
              <Container maxW={"750px"} animation={`${slideDown} 0.6s ease-out`}  opacity={0} animationFillMode="forwards" animationDelay={"0.4s"}>
                <For each={paragraphs}>
                  {(p, index) => (
                    <Prose dangerouslySetInnerHTML={{ __html: p }} size={"lg"} animation={`${slideDown} 0.4s ease-out`}  opacity={0} animationFillMode="forwards" animationDelay={`${0.1 * index + 0.3}s`}/>
                  )}
                </For>
              </Container>
            </Stack>
          </Center>
        </div>
      </div>

      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
};

export default About;