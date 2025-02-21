// src/App.tsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfileSetup/Profile";
import AccountSettingsPage from "./pages/AccountSettings/AccountSettingsPage";
import BookmarksPage from "./pages/BookmarksPage";
import ProfileSetupPage from "./pages/ProfileSetup/ProfileSetup";
import PoemDetail from "./pages/PoemDetail";
import CommunitiesPage from "./pages/Communities/CommunitiesPage";
import CommunityDetail from "./pages/Communities/CommunityDetail";
import CommunityManagePage from "./pages/Communities/CommunityManagePage";
import Layout from "@/components/Layout";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import NotificationsPage from "./pages/NotificationsPage";
import PaymentPage from "./pages/PaymentPage";
import ChatPage from "./pages/ChatPage";
import MangaDetailPage from "./pages/MangaDetailPage";
import LightNovelDetailPage from "./pages/LightNovelDetailPage";
import EditPoem from "./pages/EditPoem";
import BookDetailPage from "./pages/BookDetailPage";
import BookReadPage from "./pages/BookReadPage";
import { PoemCommentsPage } from "./pages/PoemCommentsPage";
import { LoadingState } from "@/components/LoadingState";

// Lazy load PostDetailPage (and any other heavy pages)
const PostDetailPage = lazy(() => import("./pages/PostDetailPage"));

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Layout>
            <Suspense fallback={<LoadingState />}>
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<AccountSettingsPage />} />
                <Route path="/bookmarks" element={<BookmarksPage />} />
                <Route path="/setup-profile" element={<ProfileSetupPage />} />
                <Route path="/poem/:id" element={<PoemDetail />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route path="/communities" element={<CommunitiesPage />} />
                <Route path="/communities/:id" element={<CommunityDetail />} />
                <Route path="/communities/:id/manage" element={<CommunityManagePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/chat/:chatId" element={<ChatPage />} />
                <Route path="/chats" element={<ChatPage />} />
                <Route path="/manga/:id" element={<MangaDetailPage />} />
                <Route path="/lightnovel/:id" element={<LightNovelDetailPage />} />
                <Route path="/book/:id" element={<BookDetailPage />} />
                <Route path="/edit-poem/:id" element={<EditPoem />} />
                <Route path="/book/:id/read" element={<BookReadPage />} />
                <Route path="/poems/:poemId/comments" element={<PoemCommentsPage />} />
                <Route path="/post/:id" element={<PostDetailPage />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;