from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
# from google.cloud import translate_v2 as translate
import os
import google.generativeai as genai
import requests
from dotenv import load_dotenv

load_dotenv()
gemini_api_key = os.getenv('GEMINI_API_KEY')

app = Flask(__name__)
CORS(app)

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r"C:\Users\Admin\Downloads\translation.json"
genai.configure(api_key=gemini_api_key)

@app.route('/api/home', methods=['POST','GET'])
def return_home():

    return jsonify({"hello": "world"})

@app.route('/api/translate', methods=['POST'])
def prompt_text():
    data = request.get_json()
    target = data.get('target', 'ta') 
    text = data.get('text', '')
   
    
    # return jsonify({'translated_text': scraped_data})
    
        
    model = genai.GenerativeModel(model_name="gemini-pro")
    prompt_parts = [
        'tell about tony stark'
    ]
    
    response_text = model.generate_content(prompt_parts)
    print(response_text)

    return jsonify({'translated_text': response_text})

@app.route('/api/scrape', methods=['POST'])
def scrape_website():
    data = request.get_json()
    url = data.get('url','')
    
    response_data = requests.get(url)
    soup = BeautifulSoup(response_data, 'html_parser')
    
    scraped_data = ""
    
    for data in soup.find_all(True):
        if data.name not in ['style, script']:
            scraped_data += data.get_text(strip=True) + "\n"
    
    return scraped_data

if __name__ == '__main__':
    app.run(debug=True, port=8080)
