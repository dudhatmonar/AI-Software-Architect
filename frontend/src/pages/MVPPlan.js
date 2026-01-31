import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMVPPlan, exportPDF } from '../api/api';

const MVPPlan = () => {
    const { ideaId } = useParams();
    const navigate = useNavigate();
    const [mvpPlan, setMvpPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [exportingPDF, setExportingPDF] = useState(false);

    useEffect(() => {
        fetchMVPPlan();
    }, [ideaId]);

    const fetchMVPPlan = async () => {
        try {
            const response = await getMVPPlan(ideaId);
            setMvpPlan(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load MVP plan.');
            setLoading(false);
            console.error(err);
        }
    };

    const handleExportPDF = async () => {
        setExportingPDF(true);
        try {
            const response = await exportPDF(ideaId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `mvp-plan-${ideaId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Failed to export PDF:', err);
            alert('Failed to export PDF. Please try again.');
        } finally {
            setExportingPDF(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-large"></div>
                <h3>Loading your MVP Plan...</h3>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h3>Error</h3>
                <p className="error">{error}</p>
                <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="mvp-plan-container">
            <div className="mvp-header">
                <h1>Your MVP Plan</h1>
                <div className="action-buttons">
                    <button onClick={handleExportPDF} disabled={exportingPDF} className="export-btn">
                        {exportingPDF ? 'Exporting...' : '📄 Export as PDF'}
                    </button>
                    <button onClick={() => navigate('/dashboard')} className="back-btn">
                        ← Dashboard
                    </button>
                </div>
            </div>

            {mvpPlan && (
                <div className="mvp-content">
                    <section className="mvp-section">
                        <h2>💡 Original Idea</h2>
                        <div className="content-box">
                            <p>{mvpPlan.idea_text}</p>
                        </div>
                    </section>

                    <section className="mvp-section">
                        <h2>✨ Core Features</h2>
                        <div className="content-box">
                            <ul className="feature-list">
                                {mvpPlan.features.map((feature, index) => (
                                    <li key={index}>
                                        <span className="feature-number">{index + 1}</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    <section className="mvp-section">
                        <h2>🛠️ Technology Stack</h2>
                        <div className="content-box">
                            <p>{mvpPlan.tech_stack}</p>
                        </div>
                    </section>

                    <section className="mvp-section">
                        <h2>🗺️ Development Roadmap</h2>
                        <div className="content-box">
                            <ol className="roadmap-list">
                                {mvpPlan.roadmap.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    </section>

                    {mvpPlan.database_schema && (
                        <section className="mvp-section">
                            <h2>🗄️ Database Schema</h2>
                            <div className="content-box">
                                <pre className="schema-code">{mvpPlan.database_schema}</pre>
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
};

export default MVPPlan;