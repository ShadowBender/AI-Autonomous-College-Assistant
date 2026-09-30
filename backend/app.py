from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ==========================================
# DATABASE CONFIGURATION
# ==========================================
# Using local SQLite for testing. 
# TODO: Replace with Netlify Postgres URI when ready (e.g., 'postgresql://user:pass@host/db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///college_assistant.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ==========================================
# DATABASE MODELS (Tables)
# ==========================================
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    deadline = db.Column(db.String(50), nullable=False)
    priority = db.Column(db.String(20), default="Medium")
    status = db.Column(db.String(20), default="Pending")

# Create tables if they don't exist
with app.app_context():
    db.create_all()

# ==========================================
# API ROUTES
# ==========================================

# Health Check
@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({"status": "success", "message": "Backend is running and DB is connected!"}), 200

# ------------------------------------------
# MODULE 1: Intelligent Academic Q&A (RAG)
# ------------------------------------------
@app.route('/api/chat', methods=['POST'])
def chat_with_ai():
    data = request.get_json()
    query = data.get('query', '')
    student_id = data.get('student_id', 'unknown')
    
    # TODO (Team Member 3): Pass 'query' to the ML/RAG pipeline here.
    # mock_response, mock_sources = run_rag_pipeline(query)
    
    return jsonify({
        "response": f"This is a placeholder AI response for: '{query}'",
        "sources": ["Page 4 of Computer Networks Syllabus.pdf"]
    }), 200

# ------------------------------------------
# MODULE 2: Autonomous Study Planner
# ------------------------------------------
@app.route('/api/study-plan/generate', methods=['POST'])
def generate_study_plan():
    data = request.get_json()
    subject = data.get('subject', 'General')
    exam_date = data.get('exam_date', 'TBD')
    daily_hours = data.get('daily_hours', 2)
    
    # TODO (Team Member 3): Trigger AI agent to generate dynamic timeline
    
    return jsonify({
        "subject": subject,
        "exam_date": exam_date,
        "daily_hours_allocated": daily_hours,
        "plan": [
            {"day": "Day 1", "task": f"Review {subject} syllabus and gather materials."},
            {"day": "Day 2", "task": f"Study Core Concepts of {subject}."}
        ]
    }), 200

# ------------------------------------------
# MODULE 3: Smart Task & Deadline Tracker
# ------------------------------------------
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    task_list = [{"id": t.id, "title": t.title, "deadline": t.deadline, "priority": t.priority, "status": t.status} for t in tasks]
    return jsonify(task_list), 200

@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    
    # Validate required fields
    if not data or not 'title' in data or not 'deadline' in data:
        return jsonify({"error": "Missing title or deadline"}), 400
        
    new_task = Task(
        title=data['title'],
        deadline=data['deadline'],
        priority=data.get('priority', 'Medium'),
        status=data.get('status', 'Pending')
    )
    db.session.add(new_task)
    db.session.commit()
    
    return jsonify({"message": "Task created successfully", "task_id": new_task.id}), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404
        
    data = request.get_json()
    task.title = data.get('title', task.title)
    task.deadline = data.get('deadline', task.deadline)
    task.priority = data.get('priority', task.priority)
    task.status = data.get('status', task.status)
    
    db.session.commit()
    return jsonify({"message": "Task updated successfully"}), 200

# ------------------------------------------
# MODULE 4: Career & Skill Readiness Advisor
# ------------------------------------------
@app.route('/api/career/recommend', methods=['POST'])
def recommend_skills():
    data = request.get_json()
    domain = data.get('domain', 'Software Engineering')
    
    # TODO (Team Member 3): Connect to AI agent to generate tailored career path
    
    return jsonify({
        "domain_selected": domain,
        "recommended_skills": ["Python", "REST APIs", "SQL", "Git"],
        "practice_question": "Explain the difference between a GET and POST request."
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)