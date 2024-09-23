import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";  // Importing custom styles

function Home() {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Welcome to Insightify</h1>
        <p>Your one-stop solution for extracting data, schemas, and generating insights from PDFs and CSV files.</p>
        <Link to="/generate-insights" className="cta-button">
          Get Started
        </Link>
      </header>

      <section className="features-section">
        <h2>Our Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Extract Data</h3>
            <p>Upload your PDFs and extract valuable structured data effortlessly.</p>
            <Link to="/extract-data" className="feature-link">Try Now</Link>
          </div>
          <div className="feature-card">
            <h3>Extract Schema</h3>
            <p>Understand your data by extracting schemas from PDFs in just a few clicks.</p>
            <Link to="/extract-schema" className="feature-link">Try Now</Link>
          </div>
          <div className="feature-card">
            <h3>Generate Insights</h3>
            <p>Upload CSV files, input your queries, and get insights in the form of charts.</p>
            <Link to="/generate-insights" className="feature-link">Try Now</Link>
          </div>
          <div className="feature-card">
            <h3>Generate SQL Insights</h3>
            <p>Generate Insights on SQL Database. Also generate dataframes, plots and short answers.</p>
            <Link to="/generate-sql-insights" className="feature-link">Try Now</Link>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>About Us</h2>
        <p>At Insightify, we are passionate about transforming data into meaningful insights. Our goal is to make data extraction, schema understanding, and insight generation simple and accessible for everyone. Whether you're a data scientist, researcher, or just curious, our platform empowers you to work smarter and make informed decisions.</p>
        <p>We believe in leveraging technology to help businesses and individuals unlock the true potential of their data. Join us on this journey of turning raw information into actionable insights!</p>
      </section>
    </div>
  );
}

export default Home;
