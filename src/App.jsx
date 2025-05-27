import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ItemsProvider } from './context/ItemsContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ItemDetailPage from './pages/ItemDetailPage';
import SearchPage from './pages/SearchPage';
import NewItemPage from './pages/NewItemPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './styles/Navbar.css';

function App() {
  return (
    <AuthProvider>
      <ItemsProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/item/:id" element={<ItemDetailPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/item/new" element={<NewItemPage />} />
                <Route path="/lost" element={<SearchPage />} />
                <Route path="/found" element={<SearchPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute isAdminRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ItemsProvider>
    </AuthProvider>
  );
}

export default App;