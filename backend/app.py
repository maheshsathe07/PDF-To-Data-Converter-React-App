import os
from flask import Flask, request, jsonify, send_from_directory
from modules.extract_data import ExtractData
from modules.schema_extract_data import SchemaExtractData  # Ensure correct import
from backend.modules.generate_insights_csv import GenerateVisualInsights
from backend.modules.generate_insights_sql import GenerateSQLInsights
from flask_cors import CORS
import base64
import io
from flask import send_file
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Initialize your custom classes for extracting data, schema, and generating insights
extractor = ExtractData()
schema_extractor = SchemaExtractData()
insights_generator = GenerateVisualInsights()
sql_insights_generator = GenerateSQLInsights()

# Route to extract data from uploaded file
@app.route('/extract-data', methods=['POST'])
def extract_data():
    file = request.files['file']
    result = extractor.extract_information(file)
    return result

# Route to extract schema from uploaded file
@app.route('/extract-schema', methods=['POST'])
def extract_schema():
    file = request.files['file']
    result = schema_extractor.extract_schema(file)
    return jsonify(result)

# Route to generate insights from uploaded CSV file and query
# @app.route('/generate-insights', methods=['POST'])
# def generate_insights():
#     file = request.files['file']
#     query = request.form.get('query')
#     result = insights_generator.generate_insights(file, query)
#     return jsonify(result)

@app.route('/generate-insights', methods=['POST'])
def generate_insights():
    file = request.files['file']
    query = request.form.get('query')
    result = insights_generator.generate_insights(file, query)
    
    if 'image' in result:
        # If the result contains a base64 encoded image, return it directly
        return jsonify({"image": result['image']})
    elif 'error' in result:
        return jsonify({"error": result['error']}), 400
    else:
        return jsonify(result)


# Route to generate SQL insights
@app.route('/generate-sql-insights', methods=['POST'])
def generate_sql_insights():
    data = request.get_json()  # Get JSON data from the request
    query = data.get('query')  # Extract the query from the JSON payload
    if query:
        result = sql_insights_generator.generate_insights(query)
        return jsonify(result)
    return jsonify({"error": "No query provided"}), 400

# Route to serve chart images from the 'exports/charts' directory
@app.route('/exports/charts/<filename>')
def serve_chart(filename):
    charts_directory = os.path.join(app.root_path, 'exports/charts')
    return send_from_directory(charts_directory, filename)

if __name__ == '__main__':
    app.run(debug=True)
