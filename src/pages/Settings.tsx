// src/pages/About.tsx
import { BrowserRouter as Routes, Route } from "react-router-dom"; // import Router
import { Heading, Text, Container, Center } from "@chakra-ui/react";
// import { useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import Contact from "./Contact";
import About from "./About";
// import { doc, getDoc } from "firebase/firestore";
// import { db, auth } from "@/firebase/firebase";
import { keyframes } from '@emotion/react';

export default function Settings() {
  // const [displayName, setDisplayName] = useState("");

  const slideDown = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  `;

  // useEffect(() => {
  //   const user = auth.currentUser;
  //   if (user) {
  //     const userRef = doc(db, "users", user.uid);
  //     (async () => {
  //       const snap = await getDoc(userRef);
  //       if (snap.exists()) {
  //         setDisplayName(snap.data().displayName || "");
  //       }
  //     })();
  //   }
  // }, []);

  return (
    <>
      <NavBar />
      <Center>
        <Heading size={"3xl"}  animation={`${slideDown} 0.4s ease-out`}  opacity={0} animationFillMode="forwards">Settings</Heading>
      </Center>
        {/* Top nav */}
      <Container pl={20}>
        <Text></Text>
      </Container>

        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
    </>
  );
}