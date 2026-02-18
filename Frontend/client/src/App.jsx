import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import SkeletonLoader from "./components/SkeletonLoader";
import Home from "./pages/Home";
import AddNote from "./pages/Addnote";
import Dashboard from "./pages/Dashboard";
import AskAI from "./pages/Askai";
import "./index.css";
import "./pages/Pages.css";
import "./pages/Home.css";
import "./pages/Dashboard.css";

// Wrapper component for animated routes
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddNote />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ask" element={<AskAI />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
