// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import PasswordResetRequest from './components/Auth/PasswordResetRequest';
import ResetPassword from './components/Auth/ResetPassword';
import AccessRecordsTable from './components/Records/AccessRecordsTable';
import AdminPanel from './components/Admin/AdminPanel';
import TableUsers from './components/Users/TableUsers';

function App() {
  return (
    <Router>
      <div className="container">
        <NavBar />
        <Routes>
          <Route path="/" element={<AccessRecordsTable />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin-users" element={<TableUsers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
