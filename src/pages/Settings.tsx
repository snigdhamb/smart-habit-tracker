// src/pages/About.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Heading } from "@chakra-ui/react";
import { NavBar } from "@/components/NavBar";
import Contact from "./Contact";

export default function About() {
  <Router></Router>;
  return (
    <div className="p-12 max-w-xl mx-auto text-center">
      {/* Top nav */}
      <NavBar />
      
      <Heading size={"3xl"}>Settings</Heading>

      <Routes>
        <Route path="/about" element={<About />}/>
        <Route path="/contact" element={<Contact />}/>
      </Routes>
    </div>
  );
}