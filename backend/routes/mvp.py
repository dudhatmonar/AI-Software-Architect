from flask import Blueprint

mvp_bp = Blueprint('mvp', __name__)

# Additional MVP-related routes can be added here
# For now, MVP generation is handled in ideas.py

@mvp_bp.route('/test', methods=['GET'])
def test():
    return {'message': 'MVP routes working'}