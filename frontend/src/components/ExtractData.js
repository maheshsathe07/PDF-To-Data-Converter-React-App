import React, { useState } from "react";
import axios from "axios";
import "./ExtractData.css"; // Custom CSS for styling

function ExtractData() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [copySuccess, setCopySuccess] = useState("");

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
        `${process.env.REACT_APP_FLASK_API_URL}/extract-data`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResult(response.data);
      setCopySuccess(""); // Reset copy success message
    } catch (error) {
      console.error("Error extracting data:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopySuccess("Copied to clipboard!");
  };

  return (
    <div className="extract-data-container">
      <h2>Extract Data from PDF</h2>
      <form onSubmit={handleSubmit} className="extract-form">
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
          <h3>Extracted Data</h3>
          <pre className="json-output">{JSON.stringify(result, null, 2)}</pre>
          <button className="copy-button" onClick={copyToClipboard}>
            Copy to Clipboard
          </button>
          {copySuccess && <span className="copy-success">{copySuccess}</span>}
        </div>
      )}
    </div>
  );
}

export default ExtractData;
