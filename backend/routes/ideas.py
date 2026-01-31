from flask import Blueprint, request, jsonify, send_file
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import db, Idea, MVPPlan, User
from utils.ai_integration import generate_mvp_with_ai
from utils.pdf_generator import generate_mvp_pdf

# Create Blueprint
ideas_bp = Blueprint('ideas', __name__)

@ideas_bp.route('/submit-idea', methods=['POST'])
def submit_idea():
    try:
        data = request.json
        user_id = data.get('user_id')
        idea_text = data.get('idea_text')
        
        if not user_id or not idea_text:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Verify user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Save idea
        new_idea = Idea(user_id=user_id, idea_text=idea_text)
        db.session.add(new_idea)
        db.session.commit()
        
        # Generate MVP using AI
        mvp_data = generate_mvp_with_ai(idea_text)
        
        # Save MVP plan
        mvp_plan = MVPPlan(
            idea_id=new_idea.id,
            features=mvp_data['features'],
            tech_stack=mvp_data['tech_stack'],
            roadmap=mvp_data['roadmap'],
            database_schema=mvp_data.get('database_schema', '')
        )
        db.session.add(mvp_plan)
        db.session.commit()
        
        return jsonify({
            'message': 'Idea submitted and MVP generated',
            'idea_id': new_idea.id,
            'mvp_plan_id': mvp_plan.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to generate MVP: {str(e)}'}), 500

@ideas_bp.route('/mvp-plan/<int:idea_id>', methods=['GET'])
def get_mvp_plan(idea_id):
    try:
        idea = Idea.query.get(idea_id)
        
        if not idea:
            return jsonify({'error': 'Idea not found'}), 404
        
        if not idea.mvp_plan:
            return jsonify({'error': 'MVP plan not generated yet'}), 404
        
        return jsonify({
            'idea_text': idea.idea_text,
            'features': idea.mvp_plan.features,
            'tech_stack': idea.mvp_plan.tech_stack,
            'roadmap': idea.mvp_plan.roadmap,
            'database_schema': idea.mvp_plan.database_schema
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ideas_bp.route('/export-pdf/<int:idea_id>', methods=['GET'])
def export_pdf(idea_id):
    try:
        idea = Idea.query.get(idea_id)
        
        if not idea or not idea.mvp_plan:
            return jsonify({'error': 'Idea or MVP plan not found'}), 404
        
        mvp_data = {
            'features': idea.mvp_plan.features,
            'tech_stack': idea.mvp_plan.tech_stack,
            'roadmap': idea.mvp_plan.roadmap,
            'database_schema': idea.mvp_plan.database_schema
        }
        
        pdf_buffer = generate_mvp_pdf(mvp_data, idea.idea_text)
        
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'mvp-plan-{idea_id}.pdf'
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ideas_bp.route('/test', methods=['GET'])
def test():
    return jsonify({'message': 'Ideas routes working!'})