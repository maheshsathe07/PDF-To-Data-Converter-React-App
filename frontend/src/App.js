import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ExtractData from "./components/ExtractData";
import ExtractSchema from "./components/ExtractSchema";
import GenerateInsights from "./components/GenerateInsights";
import GenerateSQLInsights from "./components/GenerateSQLInsights";
import Navbar from "./components/Navbar";
import Home from "./components/Home";  // Import the new Home component

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />  {/* New Home page route */}
          <Route path="/extract-data" element={<ExtractData />} />
          <Route path="/extract-schema" element={<ExtractSchema />} />
          <Route path="/generate-insights" element={<GenerateInsights />} />
          <Route path="/generate-sql-insights" element={<GenerateSQLInsights />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
