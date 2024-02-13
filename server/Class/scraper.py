# scraper.py
from bs4 import BeautifulSoup
import requests
import logging

class WebsiteScraper:
    def get_scrape_data(self, target_url):
        self._target_url = target_url
        try:
            response_data = requests.get(self._target_url)
            soup = BeautifulSoup(response_data.text, 'html.parser')

            scraped_data = ""
            for tag in soup.find_all(lambda tag: tag.name not in ['style', 'script']):
                scraped_data += tag.get_text(strip=True) + "\n"

            return scraped_data
        except Exception as e:
            logging.error(f"Scraping error: {e}")
            raise
