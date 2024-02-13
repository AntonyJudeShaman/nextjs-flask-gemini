from Class.scraper import WebsiteScraper
from flask import jsonify, request
from Class.chatbot import GeminiChatBot
class ApiRequestHandler:
    def __init__(self):
        self._scraped_data = ""
    
    def respond_to_scraping_request(self):
        data = request.get_json()
        self._target_url = data.get('url', '')
        try:
            scraper = WebsiteScraper()
            self._scraped_data = scraper.get_scrape_data(self._target_url)
            return jsonify({"scraped_data": self._scraped_data})
        except Exception as e:
            return jsonify({"error": "Error handling request."}), 500
    
    def respond_to_ai_request(self):
        try:
            gemini_chat = GeminiChatBot()
            data = request.get_json()
            question = data.get("prompt", "")
            if not question:
                return jsonify({"error": "Question not provided"}), 400
            response = gemini_chat.get_response(question)
            return jsonify({"ai_response": response})
        
        except Exception as e:
            return jsonify({"error": "Error handling request."}), 500
