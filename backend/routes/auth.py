from flask import Blueprint, request, jsonify
import bcrypt
import jwt  # This should work now
from datetime import datetime, timedelta
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import db, User
from config import Config

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        if not name or not email or not password:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if user exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'Email already exists'}), 400
        
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create new user
        new_user = User(
            name=name, 
            email=email, 
            password=hashed_password.decode('utf-8')
        )
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully', 
            'userId': new_user.id
        }), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        print(f"Login attempt for email: {email}")  # Debug log
        
        if not email or not password:
            return jsonify({'error': 'Missing credentials'}), 400
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        if not user:
            print(f"User not found: {email}")  # Debug log
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            print(f"Invalid password for user: {email}")  # Debug log
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Generate JWT token using jwt.encode (not JWT.encode)
        token = jwt.encode({
            'userId': user.id,
            'email': user.email,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, Config.SECRET_KEY, algorithm='HS256')
        
        print(f"Login successful for: {email}")  # Debug log
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'userId': user.id,
            'name': user.name
        }), 200
    
    except Exception as e:
        print(f"Login error: {str(e)}")  # Debug log
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/test', methods=['GET'])
def test():
    return jsonify({'message': 'Auth routes working!'})