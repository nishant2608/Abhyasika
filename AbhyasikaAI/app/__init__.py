from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

def create_app():
    app = Flask(__name__)
    
    CORS(app,supports_credentials=True, methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    load_dotenv()
    from .routes import main
    app.register_blueprint(main)
    return app