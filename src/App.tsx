/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import AccountSettingsPage from "./pages/AccountSettingPage";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProfileSetupPage from './pages/ProfileSetupPage';

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
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<MainPage poems={poems} onAddPoetry={addPoetry} />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<AccountSettingsPage />} />
              <Route path="/profile-setup" element={<ProfileSetupPage />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;