import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ItemsProvider } from './context/ItemsContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';

const HomePage = React.lazy(() => import('./pages/HomePage'));
const ItemDetailPage = React.lazy(() => import('./pages/ItemDetailPage'));
const SearchPage = React.lazy(() => import('./pages/SearchPage'));
const NewItemPage = React.lazy(() => import('./pages/NewItemPage'));
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const ProtectedRoute = React.lazy(() => import('./components/auth/ProtectedRoute'));

function App() {
  return (
    <AuthProvider>
      <ItemsProvider>
        <Router>
          <div className="app">
            <Navbar />
            <Toaster position="top-right" />
            <main className="main">
              <Suspense fallback={<LoadingSpinner />}>
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
                    path="/admin"
                    element={
                      <ProtectedRoute isAdminRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </ItemsProvider>
    </AuthProvider>
  );
}

export default App;