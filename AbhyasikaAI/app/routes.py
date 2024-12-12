from flask import Blueprint, request, jsonify
from .service import process_data
main = Blueprint('main', __name__)

@main.route('/post', methods=['POST'])
def post_method():
    data = request.get_json()
    reponse = process_data(data)
    return reponse, 200