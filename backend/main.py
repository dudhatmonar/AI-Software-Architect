from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
CORS(app)
db.init_app(app)

# Import and register blueprints AFTER app initialization
with app.app_context():
    from routes.auth import auth_bp
    from routes.ideas import ideas_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(ideas_bp, url_prefix='/api')

@app.route('/')
def index():
    return jsonify({
        'message': 'AI Software Architect API is running!',
        'status': 'success',
        'endpoints': {
            'auth': '/api/register, /api/login',
            'ideas': '/api/submit-idea, /api/mvp-plan/<id>, /api/export-pdf/<id>'
        }
    })

@app.route('/health')
def health():
    return jsonify({'status': 'healthy'})

# Create tables
with app.app_context():
    try:
        db.create_all()
        print("✓ Database tables created successfully!")
    except Exception as e:
        print(f"✗ Error creating tables: {e}")

if __name__ == '__main__':
    print("Starting AI Software Architect API...")
    print("API running on: http://localhost:5000")
    app.run(debug=True, port=5000, host='127.0.0.1')