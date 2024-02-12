import logging
from flask import Flask, jsonify
from flask_cors import CORS
from scraper import WebsiteScraper
from request_handler import ApiRequestHandler


app = Flask(__name__)
CORS(app)

api_request = ApiRequestHandler()

@app.route('/api/home', methods=['POST', 'GET'])
def return_home():
    return jsonify({"server_status": "Server is running"})

@app.route('/api/scrape', methods=['POST'])
def scrape_website():
    try:
        return api_request.respond_to_scraping_request()
    
    except Exception as e:
        logging.error(f"Scraping API call error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    app.run(debug=True, port=8080)