from scraper import WebsiteScraper
from flask import jsonify, request
class ApiRequestHandler:
    def __init__(self):
        self._scraped_data = ""
    
    def respond_to_scraping_request(self):
        data = request.get_json()
        self._target_url = data.get('url', '')
        try:
            scraper = WebsiteScraper()
            self._scraped_data = scraper.scrape(self._target_url)
            return jsonify({"scraped_data": self._scraped_data})
        except Exception as e:
            return jsonify({"error": "Error handling request."}), 500
    
    def respond_to_ai_request(self):
        try:
            if self._scraped_data == "":
                return jsonify({"error": "No data to process."}), 500
            return jsonify({"ai_response": self._scraped_data}),
        except Exception as e:
            return jsonify({"error": "Error handling request."}), 500
