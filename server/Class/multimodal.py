from dotenv import load_dotenv
import os
import PIL.Image
import google.generativeai as genai
from IPython.display import display
from IPython.display import Markdown
import textwrap
from flask import request, jsonify  

def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

class GeminiMultiModalChat:
    def __init__(self):
        load_dotenv()
        self.api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=self.api_key)

    def respond_to_multimodal_ai_request(self, input_text, image):
        model = genai.GenerativeModel('gemini-pro-vision')
        if input_text:
            response = model.generate_content([input_text, image])
        else:
            response = model.generate_content(image)
        return response.text

    def run(self):
        
        data = request.get_json()
        input_text = data.get("prompt", "")
        # input_text = "tell about this image"
        user_image = r"C:\Users\Admin\Downloads\sharone_aadhaar.jpg"
        # user_image = data.get("image", None)
        # user_image = user_image[5:]
        image = PIL.Image.open(user_image)

        response = self.respond_to_multimodal_ai_request(input_text, image)

        return {"multimodal_ai_response":response}
        # return response

app = GeminiMultiModalChat()
