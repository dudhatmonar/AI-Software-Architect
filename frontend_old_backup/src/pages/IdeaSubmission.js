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
        setLoading(true);
        setError('');

        try {
            const userId = localStorage.getItem('userId');
            const response = await submitIdea({ user_id: userId, idea_text: ideaText });
            console.log('Idea submitted:', response.data);
            
            // Navigate to MVP Plan page
            navigate(`/mvp-plan/${response.data.idea_id}`);
        } catch (err) {
            setError('Failed to submit idea. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="idea-submission-container">
            <h2>Submit Your Startup Idea</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Describe your startup idea:</label>
                    <textarea
                        value={ideaText}
                        onChange={(e) => setIdeaText(e.target.value)}
                        placeholder="Enter your startup idea here..."
                        rows="10"
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Generating MVP...' : 'Generate MVP Plan'}
                </button>
            </form>
        </div>
    );
};

export default IdeaSubmission;