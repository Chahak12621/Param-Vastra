import React, { useEffect } from 'react';
import LandingPage from './LandingPage';
import api from './axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home';
import ProductPage from './ProductPage';
import Cart from "./Cart";
import AddressForm from "./AddressForm";
import SignUp from './signup';
import Login from './Login';
import Profile from './Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} /> 
       <Route path="/product/:productId" element={<ProductPage />} />
       <Route path="/cart" element={<Cart />} />
       <Route path="/addressform" element={<AddressForm />} />
       <Route path="/profile" element={<Profile />} />

      </Routes>
    </Router>
  );
}

export default App;

