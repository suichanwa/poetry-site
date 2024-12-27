import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfileSetup/Profile";
import AccountSettingsPage from "./pages/AccountSettings/AccountSettingsPage";
import BookmarksPage from "./pages/BookmarksPage";
import ProfileSetupPage from "./pages/ProfileSetup/ProfileSetup";
import PoemDetail from "./pages/PoemDetail";
import CommunitiesPage from "./pages/Communities/CommunitiesPage";  // Add this import
import Layout from "@/components/Layout";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import CommunityDetail from "@/pages/Communities/CommunityDetail";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<AccountSettingsPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/setup-profile" element={<ProfileSetupPage />} />
              <Route path="/poem/:id" element={<PoemDetail />} />
              <Route path='/profile/:id' element={<ProfilePage />} />
              <Route path="/communities" element={<CommunitiesPage />} />
              <Route path="/communities/:id" element={<CommunityDetail />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;