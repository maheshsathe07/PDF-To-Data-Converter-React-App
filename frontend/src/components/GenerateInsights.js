import React, { useState } from "react";
import axios from "axios";

function GenerateInsights() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);

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
    } catch (error) {
      console.error("Error generating insights:", error);
    }
  };

  return (
    <div>
      <h2>Generate Insights from CSV</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="text/csv" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="Enter your query"
          value={query}
          onChange={handleQueryChange}
        />
        <button type="submit">Submit</button>
      </form>
      {result && (
        <div>
          <h3>Generated Insights</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default GenerateInsights;
