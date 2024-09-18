
import React, { useState } from "react";
import axios from "axios";
import './GenerateInsights.css'; 

function GenerateInsights() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [chartImage, setChartImage] = useState(""); // New state for image URL

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !query) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("query", query);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_FLASK_API_URL}/generate-insights`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResult(response.data);

      // Fetch the chart image
      const imageUrl = `${process.env.REACT_APP_FLASK_API_URL}/exports/charts/temp_chart.png`;
      console.log(imageUrl)
      setChartImage(imageUrl);
    } catch (error) {
      console.error("Error generating insights:", error);
    }
  };

  return (
    <div className="generate-insights-container">
      <h2>Generate Insights from CSV</h2>
      <form onSubmit={handleSubmit} className="insights-form">
        <input 
          type="file" 
          accept="text/csv" 
          onChange={handleFileChange} 
          className="file-input"
        />
        <input 
          type="text" 
          placeholder="Enter your query" 
          value={query} 
          onChange={handleQueryChange} 
          className="query-input"
        />
        <button type="submit" className="submit-button">Submit</button>
      </form>

      {result && (
        <div className="result-container">
          <h3>Generated Insights</h3>
          <pre className="json-output">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {chartImage && (
        <div className="chart-container">
          <h3>Generated Chart</h3>
          <img src={chartImage} alt="Generated Chart" className="chart-image"/>
        </div>
      )}
    </div>
  );
}

export default GenerateInsights;
