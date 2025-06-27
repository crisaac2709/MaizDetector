import requests
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")
API_URL = 'https://openrouter.ai/api/v1/chat/completions'

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "HTTP-Referer": "https://localhost",  
    "X-Title": "MaizDetectorIA",  
}

def responder_deepseek(prompt):
    data = {
        "model": "deepseek/deepseek-chat:free",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 700,
        "temperature": 0.7,
    }

    try:
        response = requests.post(API_URL, json=data, headers=headers)
        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content']
        else:
            return f"Error {response.status_code}: {response.text}"
    except Exception as e:
        return f"⚠️ Error técnico: {e}"
