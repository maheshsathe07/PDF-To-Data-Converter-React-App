import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ExtractData from "./components/ExtractData";
import ExtractSchema from "./components/ExtractSchema";
import GenerateInsights from "./components/GenerateInsights";

function App() {
  return (
    <Router>
      <div className="App">
        <h1>PDF Data Extraction App</h1>
        <Routes>
          <Route path="/extract-data" element={<ExtractData />} />
          <Route path="/extract-schema" element={<ExtractSchema />} />
          <Route path="/generate-insights" element={<GenerateInsights />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
