from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from io import BytesIO

def generate_mvp_pdf(mvp_data, idea_text):
    """
    Generate PDF for MVP plan
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    story.append(Paragraph("AI Software Architect - MVP Plan", styles['Title']))
    story.append(Spacer(1, 12))
    
    # Idea
    story.append(Paragraph("Startup Idea:", styles['Heading2']))
    story.append(Paragraph(idea_text, styles['Normal']))
    story.append(Spacer(1, 12))
    
    # Features
    story.append(Paragraph("Core Features:", styles['Heading2']))
    for feature in mvp_data['features']:
        story.append(Paragraph(f"• {feature}", styles['Normal']))
    story.append(Spacer(1, 12))
    
    # Tech Stack
    story.append(Paragraph("Technology Stack:", styles['Heading2']))
    story.append(Paragraph(mvp_data['tech_stack'], styles['Normal']))
    story.append(Spacer(1, 12))
    
    # Roadmap
    story.append(Paragraph("Development Roadmap:", styles['Heading2']))
    for step in mvp_data['roadmap']:
        story.append(Paragraph(f"• {step}", styles['Normal']))
    story.append(Spacer(1, 12))
    
    # Database Schema
    if mvp_data.get('database_schema'):
        story.append(Paragraph("Database Schema:", styles['Heading2']))
        story.append(Paragraph(mvp_data['database_schema'], styles['Code']))
    
    doc.build(story)
    buffer.seek(0)
    return buffer