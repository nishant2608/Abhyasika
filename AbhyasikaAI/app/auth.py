import jwt
import datetime
import os
import base64
from pymongo import MongoClient
from functools import wraps
from flask import request, jsonify

SECRET_KEY = base64.b64decode(os.getenv("JWT_SECRET_KEY"))

client = MongoClient("mongodb://localhost:27017/")
db = client.demoTopic
users_collection = db.AbhyasikaUser

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        print(request.headers)
        print(request.headers.get('Authorization'))
        print(request.headers['Authorization'])
        if request.headers.get('Authorization'):
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS512"])
            current_user = users_collection.find_one({"username": data["sub"]})
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401
        return f(*args, **kwargs)
    return decorated