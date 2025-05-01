// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// // import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           {/* <img src={viteLogo} className="logo" alt="Vite logo" /> */}
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

// import React, { useEffect, useState } from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
// import Dashboard from './pages/Dashboard';
// import NotFound from './pages/NotFound';
// import { onAuthStateChanged, User } from 'firebase/auth';
// import { auth } from './firebase/firebase';
// import { SignInButton, SignOutButton } from './components/AuthButtons';

// const App: React.FC = () => {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, setUser);
//     return () => unsubscribe(); // cleanup on unmount
//   }, []);

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-4">Smart Habit Tracker</h1>

//       {user ? (
//         <div>
//           <p className="mb-2">Welcome, {user.displayName}</p>
//           <img src={user.photoURL ?? ''} alt="User" className="w-12 h-12 rounded-full mb-4" />
//           <SignOutButton />
//         </div>
//       ) : (
//         <SignInButton />
//       )}
//     </div>
//   );
// };

// export default App;

// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
// import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";

const App = () => {
  return (
    <>
      <NavBar />
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/settings" element={<Settings />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
