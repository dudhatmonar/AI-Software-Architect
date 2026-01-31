import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMVPPlan, exportPDF } from '../api/api';

const MVPPlan = () => {
    const { ideaId } = useParams();
    const [mvpPlan, setMvpPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMVPPlan();
    }, [ideaId]);

    const fetchMVPPlan = async () => {
        try {
            const response = await getMVPPlan(ideaId);
            setMvpPlan(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load MVP plan.');
            setLoading(false);
            console.error(err);
        }
    };

    const handleExportPDF = async () => {
        try {
            const response = await exportPDF(ideaId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `mvp-plan-${ideaId}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error('Failed to export PDF:', err);
        }
    };

    if (loading) return <div>Loading MVP Plan...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="mvp-plan-container">
            <h2>Your MVP Plan</h2>
            {mvpPlan && (
                <div>
                    <section>
                        <h3>Features</h3>
                        <ul>
                            {mvpPlan.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                    </section>
                    <section>
                        <h3>Technology Stack</h3>
                        <p>{mvpPlan.tech_stack}</p>
                    </section>
                    <section>
                        <h3>Development Roadmap</h3>
                        <ol>
                            {mvpPlan.roadmap.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ol>
                    </section>
                    <section>
                        <h3>Database Schema</h3>
                        <pre>{mvpPlan.database_schema}</pre>
                    </section>
                    <button onClick={handleExportPDF}>Export as PDF</button>
                </div>
            )}
        </div>
    );
};

export default MVPPlan;