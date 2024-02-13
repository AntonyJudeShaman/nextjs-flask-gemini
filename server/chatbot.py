from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from flask_cors import CORS
import google.generativeai as genai

load_dotenv()

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class GeminiChatBot:
    def __init__(self):
        self.model = genai.GenerativeModel("gemini-pro")
        self.chat = self.model.start_chat(history=[])

    def get_response(self, question):
        response = self.chat.send_message(question, stream=True)
        return ' '.join(chunk.text for chunk in response)
