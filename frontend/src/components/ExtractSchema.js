import React, { useState } from "react";
import axios from "axios";
import './ExtractSchema.css';  // For custom styling

function ExtractSchema() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_FLASK_API_URL}/extract-schema`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResult(response.data);
    } catch (error) {
      console.error("Error extracting schema:", error);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      alert("Copied to clipboard!");
    }
  };

  return (
    <div className="extract-schema-container my-3">
      <h2>Extract Schema from PDF</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleFileChange} 
          className="file-input"
        />
        <button type="submit" className="submit-button">Submit</button>
      </form>

      {result && (
        <div className="result-container">
          <h3>Extracted Schema Data</h3>
          <pre className="json-output">{JSON.stringify(result, null, 2)}</pre>
          <button className="copy-button" onClick={copyToClipboard}>Copy to Clipboard</button>
        </div>
      )}
    </div>
  );
}

export default ExtractSchema;
