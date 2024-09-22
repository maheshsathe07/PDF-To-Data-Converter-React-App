import React, { useState } from "react";
import axios from "axios";
import './ExtractSchema.css';  // For custom styling

function ExtractSchema() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
      if (response.data.error) {
        setError(response.data);
        setResult(null);
      } else {
        setResult(response.data);
        setError(null);
      }
    } catch (error) {
      console.error("Error extracting schema:", error);
      setError({ error: "An error occurred while extracting the schema." });
      setResult(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const renderError = () => {
    if (!error) return null;

    let parsedError = error.error;
    let parsedOutput = error.output;

    try {
      // Try to parse the JSON in the error message
      const match = parsedError.match(/Failed to parse MySchema from completion (.*?)\. Got:/);
      if (match) {
        const jsonStr = match[1];
        const parsedJson = JSON.parse(jsonStr);
        parsedError = JSON.stringify(parsedJson, null, 2);
      }
    } catch (e) {
      console.error("Failed to parse error JSON:", e);
    }

    try {
      // Try to parse the JSON in the output
      const match = parsedOutput.match(/```json\n([\s\S]*?)\n```/);
      if (match) {
        const jsonStr = match[1];
        const parsedJson = JSON.parse(jsonStr);
        parsedOutput = JSON.stringify(parsedJson, null, 2);
      }
    } catch (e) {
      console.error("Failed to parse output JSON:", e);
    }

    return (
      <div className="error-container">
        <h4>Extracted Data:</h4>
        <pre className="json-output">{parsedOutput}</pre>
        <button className="copy-button" onClick={() => copyToClipboard(parsedOutput)}>
          Copy Output JSON
        </button>
      </div>
    );
  };

  const renderResult = () => {
    if (error) {
      return renderError();
    }
    if (result) {
      return (
        <>
          <h3>Extracted Schema Data</h3>
          <pre className="json-output">{JSON.stringify(result, null, 2)}</pre>
          <button className="copy-button" onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}>
            Copy to Clipboard
          </button>
        </>
      );
    }
    return null;
  };

  return (
    <div className="extract-schema-container">
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

      <div className="result-container">
        {renderResult()}
      </div>
    </div>
  );
}

export default ExtractSchema;
