import requests
from config import Config

def generate_mvp_with_ai(idea_text):
    """
    Generate MVP plan using Gemini AI API
    """
    
    prompt = f"""
    You are an AI Software Architect. Given the following startup idea, generate a detailed MVP (Minimum Viable Product) plan.
    
    Startup Idea: {idea_text}
    
    Please provide:
    1. A list of core features for the MVP (as a JSON array)
    2. Recommended technology stack (as a string)
    3. Development roadmap with phases (as a JSON array)
    4. Database schema suggestion (as a string)
    
    Format your response as JSON with keys: features, tech_stack, roadmap, database_schema
    """
    
    try:
        # Replace with actual Gemini API endpoint
        response = requests.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            headers={
                'Content-Type': 'application/json',
            },
            params={
                'key': Config.GEMINI_API_KEY
            },
            json={
                'contents': [{
                    'parts': [{
                        'text': prompt
                    }]
                }]
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            # Parse the AI response
            ai_text = result['candidates'][0]['content']['parts'][0]['text']
            
            # Extract JSON from response (you may need to parse this better)
            import json
            import re
            
            # Try to find JSON in the response
            json_match = re.search(r'\{.*\}', ai_text, re.DOTALL)
            if json_match:
                mvp_data = json.loads(json_match.group())
                return mvp_data
            else:
                # Fallback: create structured data from text
                return {
                    'features': ['Feature extraction from text needed'],
                    'tech_stack': 'React.js, Node.js, PostgreSQL',
                    'roadmap': ['Phase 1: Planning', 'Phase 2: Development', 'Phase 3: Testing'],
                    'database_schema': 'Schema generation needed'
                }
        else:
            raise Exception(f'AI API Error: {response.status_code}')
            
    except Exception as e:
        print(f'Error generating MVP: {str(e)}')
        # Return default structure if AI fails
        return {
            'features': [
                'User authentication and authorization',
                'Core functionality implementation',
                'Basic UI/UX design',
                'Data storage and retrieval'
            ],
            'tech_stack': 'React.js for frontend, Flask for backend, PostgreSQL for database',
            'roadmap': [
                'Week 1-2: Setup and architecture design',
                'Week 3-4: Core feature development',
                'Week 5-6: Testing and refinement',
                'Week 7-8: Deployment and launch'
            ],
            'database_schema': 'CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE);'
        }