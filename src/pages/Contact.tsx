// src/pages/Contact.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./About";
import { Heading } from "@chakra-ui/react";
import { NavBar } from "@/components/NavBar";

export default function Contact() {
//   const navigate = useNavigate();
  <Router></Router>;
  return (
    <div className="p-12 max-w-xl mx-auto text-center">
      {/* Top nav */}
      <NavBar />

      <Heading size={"3xl"}>Contact</Heading>

      <Routes>
        <Route path="/about" element={<About />}/>
        <Route path="/contact" element={<Contact />}/>
      </Routes>
    </div>
  );
}