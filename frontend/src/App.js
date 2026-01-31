import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import IdeaSubmission from './pages/IdeaSubmission';
import MVPPlan from './pages/MVPPlan';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/submit-idea" element={<IdeaSubmission />} />
          <Route path="/mvp-plan/:ideaId" element={<MVPPlan />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;