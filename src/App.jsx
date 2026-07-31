import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductsPage from './pages/ProductsPage';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import Cart from './pages/Cart';
import LoginPage from './pages/Login';
import OffersPage from './pages/Offers';

export default function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path="/products" element={<ProductsPage />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/sales" element={<OffersPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}