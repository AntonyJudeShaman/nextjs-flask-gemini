from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
import os
import google.generativeai as genai
import requests
from dotenv import load_dotenv
import logging

load_dotenv()
gemini_api_key = os.getenv('GEMINI_API_KEY')

app = Flask(__name__)
CORS(app)


genai.configure(api_key=gemini_api_key)
model = genai.GenerativeModel(model_name="gemini-pro")

@app.route('/api/home', methods=['POST','GET'])
def return_home():

    return jsonify({"server_status": "Server is running"})
@app.route('/api/data', methods=['POST','GET'])
def prompt_text():
    data = request.get_json()
    text = data.get('text', '')

    prompt_parts = [
        text
    ]
        
    try:
        response_text = model.generate_content(prompt_parts)
        logging.error(f"Error: {str(e)}")
        return jsonify({"response_text": response_text.text})
    except Exception as e:
        return jsonify({"error": str(e)})
    

@app.route('/api/scrape', methods=['POST'])
def scrape_website():
    data = request.get_json()
    target_url = data.get('url','')
    
    response_data = requests.get(target_url)
    soup = BeautifulSoup(response_data.text, 'html.parser')
    
    scraped_data = ""
    
    for tag in soup.find_all(lambda tag: tag.name not in ['style', 'script']):
        scraped_data += tag.get_text(strip=True) + "\n"
    
    return jsonify({"scraped_data": scraped_data})


if __name__ == '__main__':
    app.run(debug=True, port=8080)
