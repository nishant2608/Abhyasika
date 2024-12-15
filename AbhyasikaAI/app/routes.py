from flask import Blueprint, request, jsonify
from flask_cors import cross_origin,CORS
from .auth import token_required
from .service import process_content, process_quiz
main = Blueprint('main', __name__)

CORS(main,supports_credentials=True, methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

@main.route('/post/content', methods=['POST'])
@cross_origin(origin='*')
@token_required 
def post_content():
    data = request.get_json()
    reponse = process_content(data)
    return reponse, 200

@main.route('/post/quiz', methods=['POST'])
@token_required
def post_quiz():
    data = request.get_json()
    reponse = process_quiz(data)
    return reponse, 200