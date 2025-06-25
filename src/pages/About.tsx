// src/pages/About.tsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { SignOutButton } from "../components/AuthButtons";
import Contact from "./Contact";

export default function About() {
  <Router></Router>;
  return (
    <div className="p-12 max-w-xl mx-auto text-center">
      {/* Top nav */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex space-x-10 text-[#174b91] font-medium tracking-wide">
          <Link to={'/'}>Home</Link>
          {/* <a href="#" className="hover:underline">Home</a> */}
          <Link to={'/about'}>About</Link>
          <Link to={'/contact'}>Contact</Link>
        </div>
        <SignOutButton />
      </div>
      
      <h1 className="text-3xl font-bold mb-6">About</h1>

      <Routes>
        <Route path="/about" element={<About />}/>
        <Route path="/contact" element={<Contact />}/>
      </Routes>
    </div>
  );
}