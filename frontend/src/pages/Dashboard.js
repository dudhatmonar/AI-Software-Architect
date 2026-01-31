import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const name = localStorage.getItem('userName');
        
        if (!token) {
            navigate('/login');
        } else {
            setUserName(name || 'User');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome to AI Software Architect</h1>
                <p className="welcome-text">Hello, <strong>{userName}</strong>! 👋</p>
            </div>

            <div className="dashboard-content">
                <div className="dashboard-card">
                    <div className="card-icon">💡</div>
                    <h3>Submit New Idea</h3>
                    <p>Transform your startup idea into a detailed MVP plan using AI</p>
                    <button onClick={() => navigate('/submit-idea')} className="primary-btn">
                        Get Started
                    </button>
                </div>

                <div className="dashboard-card">
                    <div className="card-icon">📊</div>
                    <h3>My Projects</h3>
                    <p>View and manage all your generated MVP plans</p>
                    <button className="secondary-btn" disabled>
                        Coming Soon
                    </button>
                </div>

                <div className="dashboard-card">
                    <div className="card-icon">👥</div>
                    <h3>Collaborate</h3>
                    <p>Work with your team on MVP development</p>
                    <button className="secondary-btn" disabled>
                        Coming Soon
                    </button>
                </div>
            </div>

            <div className="dashboard-actions">
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;