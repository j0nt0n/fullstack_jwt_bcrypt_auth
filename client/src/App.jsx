import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import Register from './auth/Register';
import Login from './auth/Login';
import ChangePassword from './auth/ChangePassword';
import RegUserInfo from './auth/RegUserInfo';
import Dashboard from './pages/Dashboard';
import UserInfo from './pages/UserInfo';  // Импортируем компонент UserInfo
import { useAuth } from './contexts/AuthContext';

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route 
          path='/' 
          element={!isAuthenticated ? <Register /> : <Navigate to='/dashboard' />}
        />
        <Route
          path='/login'
          element={!isAuthenticated ? <Login /> : <Navigate to='/dashboard' />}
        />
        <Route 
          path='/reginfo' 
          element={isAuthenticated ? <RegUserInfo /> : <Login />}
        />
        <Route 
          path='/changepassword' 
          element={isAuthenticated ? <ChangePassword /> : <Login />}
        />
        <Route 
          path='/dashboard' 
          element={isAuthenticated ? <Dashboard /> : <Login />}
        />
        <Route 
          path='/userinfo' 
          element={isAuthenticated ? <UserInfo /> : <Login />} // Новый маршрут для UserInfo
        />
      </Routes>
    </Router>
  );
};

export default App;
