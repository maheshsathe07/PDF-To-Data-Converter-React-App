# import os
# from flask import Flask, request, jsonify
# from modules.extract_data import ExtractData
# from modules.schema_extract_data import SchemaExtractData
# from modules.data_inference import GenerateVisualInsights
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app) 

# extractor = ExtractData()
# schema_extractor = SchemaExtractData()
# insights_generator = GenerateVisualInsights()

# @app.route('/extract-data', methods=['POST'])
# def extract_data():
#     file = request.files['file']
#     result = extractor.extract_information(file)
#     return jsonify(result)

# @app.route('/extract-schema', methods=['POST'])
# def extract_schema():
#     file = request.files['file']
#     result = schema_extractor.extract_schema(file)
#     return jsonify(result)

# @app.route('/generate-insights', methods=['POST'])
# def generate_insights():
#     file = request.files['file']
#     query = request.form.get('query')
#     result = insights_generator.generate_insights(file, query)
#     return jsonify(result)

# if __name__ == '__main__':
#     app.run(debug=True)





import os
from flask import Flask, request, jsonify, send_from_directory
from modules.extract_data import ExtractData
from modules.schema_extract_data import SchemaExtractData
from modules.data_inference import GenerateVisualInsights
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Initialize your custom classes for extracting data, schema, and generating insights
extractor = ExtractData()
schema_extractor = SchemaExtractData()
insights_generator = GenerateVisualInsights()

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
@app.route('/generate-insights', methods=['POST'])
def generate_insights():
    file = request.files['file']
    query = request.form.get('query')
    result = insights_generator.generate_insights(file, query)
    return jsonify(result)

# Route to serve chart images from the 'exports/charts' directory
@app.route('/exports/charts/<filename>')
def serve_chart(filename):
    charts_directory = os.path.join(app.root_path, 'exports/charts')
    return send_from_directory(charts_directory, filename)

if __name__ == '__main__':
    app.run(debug=True)
