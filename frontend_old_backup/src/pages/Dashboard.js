import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            // Fetch user data if needed
            setUser({ name: 'User' }); // Replace with actual user data
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <h2>Welcome to AI Software Architect Dashboard</h2>
            <p>Hello, {user?.name}!</p>
            <div className="dashboard-actions">
                <button onClick={() => navigate('/submit-idea')}>Submit New Idea</button>
                <button onClick={() => navigate('/my-ideas')}>View My Ideas</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default Dashboard;