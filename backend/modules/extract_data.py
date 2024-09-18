import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
import os
import base64
from PyPDF2 import PdfReader

class ExtractData:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        self.model = ChatGoogleGenerativeAI(model="gemini-pro")

        # Define LangChain pipeline
        prompt_template = """
            You are an expert in information extraction from raw text.
            You are tasked to extract all the information from the given text of:

            NOTE: Use only the raw text provided for the information extraction.

            Provide the output response in JSON format only.

            <text>
            {raw_text}
            </text>
        """
        self.prompt = ChatPromptTemplate.from_template(prompt_template)
        self.output_parser = StrOutputParser()
        self.chain = self.prompt | self.model | self.output_parser

    def pdf_to_text(self, pdf_file):
        # Use PdfReader to read the PDF file
        reader = PdfReader(pdf_file)
        # Extract text from each page
        raw_text = ""
        for page in reader.pages:
            raw_text += page.extract_text()
        return raw_text

    def extract_information(self, pdf_file):
        raw_text = self.pdf_to_text(pdf_file)
        result = self.chain.invoke({"raw_text": raw_text})
        print(result)
        return result
