import logging
from flask import Flask, jsonify
from flask_cors import CORS
from handlers.request_handler import ApiRequestHandler
from Class.multimodal import GeminiMultiModalChat

app = Flask(__name__)
CORS(app)

@app.route('/api/home', methods=['POST', 'GET'])
def check_server_status():
    return jsonify({"server_status": "Server is running"})

@app.route('/api/scrape', methods=['POST'])
def scrape_website():
    try:
        api_request = ApiRequestHandler()
        return api_request.respond_to_scraping_request()
    
    except Exception as e:
        logging.error(f"Scraping API call error: {e}")
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/ai/getdetails", methods=["POST"])
def ask_question():
    api_request = ApiRequestHandler()
    return api_request.respond_to_ai_request()

@app.route("/api/ai/multimodal", methods=["POST"])
def multi_modal_question():
    req = GeminiMultiModalChat()
    return req.run()

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    app.run(debug=True, port=8080)
