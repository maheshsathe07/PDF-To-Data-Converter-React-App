import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ExtractData from "./components/ExtractData";
import ExtractSchema from "./components/ExtractSchema";
import GenerateInsights from "./components/GenerateInsights";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>
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
