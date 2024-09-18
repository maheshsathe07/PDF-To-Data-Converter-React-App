from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import base64
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
import os
from PyPDF2 import PdfReader

class InvoiceItem(BaseModel):
    item_desc: str = Field("None", description="Description of the item")
    item_qty: int = Field(0, description="Quantity of the item")
    item_net_price: float = Field(0.0, description="Net price of the item")
    item_net_worth: float = Field(0.0, description="Net worth of the item (item_qty * item_net_price)")
    item_vat: float = Field(0.0, description="VAT applied to the item")
    item_gross_worth: float = Field(0.0, description="Gross worth of the item (item_net_worth + item_vat)")

class SchemaExtractData:
    def __init__(self):
        # Configure Keys
        load_dotenv()
        
        # Initialize language model
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        self.llm = ChatGoogleGenerativeAI(model="gemini-pro")

    class MySchema(BaseModel):
        invoice_number: str = Field("None", description="Invoice number")
        invoice_date: str = Field("None", description="Invoice date")
        seller: str = Field("None", description="Seller information")
        client: str = Field("None", description="Client information")
        seller_tax_id: str = Field("None", description="Seller tax identification number")
        client_tax_id: str = Field("None", description="Client tax identification number")
        items: List[InvoiceItem] = Field([], description="List of invoice items")
        total_net_worth: float = Field(0.0, description="Total net worth of all items")
        total_vat: float = Field(0.0, description="Total VAT of all items")
        total_gross_worth: float = Field(0.0, description="Total gross worth of all items")

    def pdf_to_text(self, pdf_file):
        reader = PdfReader(pdf_file)
        raw_text = ""
        for page in reader.pages:
            raw_text += page.extract_text()
        return raw_text

    def extract_schema(self, pdf_file):
        raw_text = self.pdf_to_text(pdf_file)
        pydantic_parser = PydanticOutputParser(pydantic_object=self.MySchema)
        
        prompt_template = """
        You are an expert in invoice management consulting. 
        Take the raw text of the invoice details provided below and analyze them to generate insights.
        
        Invoice Details:
        {raw_text}

        {format_instructions}
        """
        prompt = ChatPromptTemplate.from_template(template=prompt_template)
        format_instructions = pydantic_parser.get_format_instructions()
        messages = prompt.format_messages(raw_text=raw_text, format_instructions=format_instructions)

        output = self.llm.invoke(messages)
        try:
            response = pydantic_parser.parse(output.content)
            return response.json()
        except Exception as e:
            return {"error": str(e), "output": output.content}
