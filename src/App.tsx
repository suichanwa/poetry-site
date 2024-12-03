import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Layout } from "@/components/Layout";
import { useState } from "react";

function App() {
  const [poems, setPoems] = useState([
    {
      id: 1,
      title: "The Beauty of Dawn",
      content: "The sun rises, painting skies in hues of gold...",
      author: "Emily",
    },
    {
      id: 2,
      title: "Silent Whispers",
      content: "In the quiet of the night, dreams come alive...",
      author: "Liam",
    },
  ]);

  const addPoetry = (title: string, content: string, author: string) => {
    const newPoem = {
      id: poems.length + 1,
      title,
      content,
      author,
    };
    setPoems([...poems, newPoem]);
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage poems={poems} onAddPoetry={addPoetry} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;