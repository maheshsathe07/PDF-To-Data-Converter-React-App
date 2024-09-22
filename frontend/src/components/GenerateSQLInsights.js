import React, { useState } from 'react';
import axios from 'axios';
import './GenerateSQLInsights.css'; // Import the CSS file

const GenerateSQLInsights = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [chartImage, setChartImage] = useState(''); // State to store chart image URL
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await axios.post('http://localhost:5000/generate-sql-insights', {
                query: query,
            });
            setResult(response.data);

            // Generate the image URL with timestamp to avoid caching issues
            const imageUrl = `http://localhost:5000/exports/charts/temp_chart.png?timestamp=${new Date().getTime()}`;
            setChartImage(imageUrl);
        } catch (err) {
            setError('Error generating insights: ' + (err.response ? err.response.data.error : err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Generate SQL Insights</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Enter your SQL query:
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            rows="5"
                            required
                        />
                    </label>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Insights'}
                </button>
            </form>
            {error && <p className="error">{error}</p>}
            {/* {result && (
                <div className="insights">
                    <h3>Insights:</h3>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )} */}

            {/* Conditionally render the chart if available */}
            {chartImage && (
                <div className="chart-container my-3">
                    <h3>Generated Chart</h3>
                    <img src={chartImage} alt="Generated Chart" className="chart-image" />
                </div>
            )}
        </div>
    );
};

export default GenerateSQLInsights;
