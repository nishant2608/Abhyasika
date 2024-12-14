from flask import Blueprint, request, jsonify
from .service import process_content, process_quiz
main = Blueprint('main', __name__)

@main.route('/post/content', methods=['POST'])
def post_content():
    data = request.get_json()
    reponse = process_content(data)
    return reponse, 200

@main.route('/post/quiz', methods=['POST'])
def post_quiz():
    data = request.get_json()
    reponse = process_quiz(data)
    return reponse, 200