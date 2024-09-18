import os
from flask import Flask, request, jsonify
from modules.extract_data import ExtractData
from modules.schema_extract_data import SchemaExtractData
from modules.data_inference import GenerateVisualInsights
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

extractor = ExtractData()
schema_extractor = SchemaExtractData()
insights_generator = GenerateVisualInsights()

@app.route('/extract-data', methods=['POST'])
def extract_data():
    file = request.files['file']
    result = extractor.extract_information(file)
    return jsonify(result)

@app.route('/extract-schema', methods=['POST'])
def extract_schema():
    file = request.files['file']
    result = schema_extractor.extract_schema(file)
    return jsonify(result)

@app.route('/generate-insights', methods=['POST'])
def generate_insights():
    file = request.files['file']
    query = request.form.get('query')
    result = insights_generator.generate_insights(file, query)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
