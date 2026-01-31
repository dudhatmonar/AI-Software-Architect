import React, { useState } from 'react';
import { submitIdea } from '../api/api';
import { useNavigate } from 'react-router-dom';

const IdeaSubmission = () => {
    const [ideaText, setIdeaText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (ideaText.trim().length < 50) {
            setError('Please provide more details about your idea (at least 50 characters)');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const userId = localStorage.getItem('userId');
            const response = await submitIdea({ user_id: userId, idea_text: ideaText });
            console.log('Idea submitted:', response.data);
            
            // Navigate to MVP Plan page
            navigate(`/mvp-plan/${response.data.idea_id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit idea. Please try again.');
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <div className="idea-submission-container">
            <div className="submission-box">
                <h2>Submit Your Startup Idea</h2>
                <p className="subtitle">Describe your idea in detail, and our AI will generate a complete MVP plan</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Describe your startup idea:</label>
                        <textarea
                            value={ideaText}
                            onChange={(e) => setIdeaText(e.target.value)}
                            placeholder="Example: I want to build a mobile app that connects local farmers directly with consumers, eliminating middlemen. The app will allow farmers to list their products, and consumers can order fresh produce for home delivery..."
                            rows="12"
                            required
                        />
                        <small className="char-count">
                            {ideaText.length} characters (minimum 50 required)
                        </small>
                    </div>
                    
                    {error && <p className="error">{error}</p>}
                    
                    <button type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Generating MVP Plan...
                            </>
                        ) : (
                            'Generate MVP Plan'
                        )}
                    </button>
                </form>
                
                <button 
                    onClick={() => navigate('/dashboard')} 
                    className="back-btn"
                    disabled={loading}
                >
                    ← Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default IdeaSubmission;