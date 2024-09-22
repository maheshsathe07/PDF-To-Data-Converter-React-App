import pandas as pd
from pandasai import SmartDataframe
from dotenv import load_dotenv
import os
from sqlalchemy import create_engine
from langchain_groq import ChatGroq

class GenerateSQLInsights:
    def __init__(self):
        # Load environment variables to get the Mixtral API key
        load_dotenv()

        # Database connection string for MySQL using SQLAlchemy
        self.DATABASE_URI = "mysql+pymysql://root:mahesh12@localhost:3306/insightify"

        # Initialize the Mixtral model
        self.llm = ChatGroq(model_name="mixtral-8x7b-32768", api_key=os.getenv("GROQ_API_KEY"))

    def connect_to_db(self):
        try:
            # Connect to MySQL database using SQLAlchemy
            engine = create_engine(self.DATABASE_URI)
            connection = engine.connect()
            return connection
        except Exception as e:
            raise Exception(f"Error connecting to the database: {e}")

    def generate_insights(self, query):
        try:
            # Connect to the database and fetch data
            connection = self.connect_to_db()
            df = pd.read_sql("SELECT * FROM customer", connection)
            connection.close()

            # Convert pandas DataFrame to SmartDataframe for AI insights
            smart_df = SmartDataframe(df, config={"llm": self.llm})

            # Generate insights using the Mixtral model
            result = smart_df.chat(query)
            return result
        except Exception as e:
            return {"error": str(e)}
