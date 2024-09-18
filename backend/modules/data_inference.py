from dotenv import load_dotenv
import os
import pandas as pd
from langchain_groq import ChatGroq
from pandasai import SmartDataframe

class GenerateVisualInsights:
    def __init__(self):
        load_dotenv()
        self.api_key = os.getenv("GROQ_API_KEY")
        self.llm = ChatGroq(model_name="mixtral-8x7b-32768", api_key=self.api_key)

    def chat_with_csv(self, df, prompt):
        try:
            result = df.chat(prompt)
            return result
        except Exception as e:
            return {"error": str(e)}

    def generate_insights(self, csv_file, query):
        try:
            # Load the CSV file into a DataFrame
            data = pd.read_csv(csv_file)
            
            # Ensure that the DataFrame index is unique
            if data.index.duplicated().any():
                data = data.loc[~data.index.duplicated(keep='first')]

            # Create a SmartDataframe instance with the cleaned data
            smart_df = SmartDataframe(data, config={"llm": self.llm})
            
            # Generate insights
            result = self.chat_with_csv(smart_df, query)
            
            return result
        
        except Exception as e:
            return {"error": str(e)}
