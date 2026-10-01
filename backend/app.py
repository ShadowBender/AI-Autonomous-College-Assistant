import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from groq import Groq

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Groq Client (pulls GROQ_API_KEY from .env)
ai_client = Groq()

# ==========================================
# DATABASE CONFIGURATION
# ==========================================
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///college_assistant.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ==========================================
# DATABASE MODELS
# ==========================================
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    deadline = db.Column(db.String(50), nullable=False)
    priority = db.Column(db.String(20), default="Medium")
    status = db.Column(db.String(20), default="Pending")

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
# MODULE 1: Task-Aware Intelligent Academic Q&A
# ------------------------------------------
@app.route('/api/chat', methods=['POST'])
def chat_with_ai():
    data = request.get_json() or {}
    query = data.get('query', '')
    
    if not query:
        return jsonify({"error": "Query is required"}), 400

    try:
        # Fetch pending tasks directly from SQLite
        pending_tasks = Task.query.filter_by(status="Pending").all()
        if pending_tasks:
            task_list_str = "\n".join([f"- {t.title} (Deadline: {t.deadline}, Priority: {t.priority})" for t in pending_tasks])
        else:
            task_list_str = "No pending tasks found."

        # Dynamically inject database context into the AI system prompt
        system_prompt = (
            "You are a helpful AI Autonomous College Assistant. Give concise, academic answers.\n\n"
            f"CURRENT PENDING STUDENT TASKS:\n{task_list_str}\n\n"
            "If the student asks about their tasks, schedule, upcoming deadlines, or priorities, "
            "use the pending task details above to provide accurate answers."
        )

        chat_completion = ai_client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query}
            ],
            model="openai/gpt-oss-20b",
        )
        
        return jsonify({
            "response": chat_completion.choices[0].message.content,
            "sources": ["Groq Base Model", "SQLite Database (Task Tracker)"]
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------------------------------
# MODULE 2: Autonomous Study Planner (Dynamic AI)
# ------------------------------------------
@app.route('/api/study-plan/generate', methods=['POST'])
def generate_study_plan():
    data = request.get_json() or {}
    subject = data.get('subject', 'General Computer Science')
    exam_date = data.get('exam_date', 'In 1 week')
    daily_hours = data.get('daily_hours', 2)
    total_days = data.get('total_days', 5)

    try:
        prompt = f"""
        Create a practical day-by-day study plan for the subject '{subject}'.
        Exam target: {exam_date}.
        Study time available: {daily_hours} hours per day.
        Plan duration: {total_days} days.

        Return strictly valid JSON matching this schema:
        {{
            "subject": "{subject}",
            "exam_date": "{exam_date}",
            "daily_hours_allocated": {daily_hours},
            "plan": [
                {{"day": "Day 1", "task": "Specific topic and action item"}},
                {{"day": "Day 2", "task": "Specific topic and action item"}}
            ]
        }}
        """

        completion = ai_client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an academic study planner. Output valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            model="openai/gpt-oss-20b",
            response_format={"type": "json_object"}
        )

        plan_data = json.loads(completion.choices[0].message.content)
        return jsonify(plan_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
    data = request.get_json() or {}
    
    if 'title' not in data or 'deadline' not in data:
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
        
    data = request.get_json() or {}
    task.title = data.get('title', task.title)
    task.deadline = data.get('deadline', task.deadline)
    task.priority = data.get('priority', task.priority)
    task.status = data.get('status', task.status)
    
    db.session.commit()
    return jsonify({"message": "Task updated successfully"}), 200

# ------------------------------------------
# MODULE 4: Career & Skill Readiness Advisor (Dynamic AI)
# ------------------------------------------
@app.route('/api/career/recommend', methods=['POST'])
def recommend_skills():
    data = request.get_json() or {}
    domain = data.get('domain', 'Full-Stack Web Development')

    try:
        prompt = f"""
        Provide target technical skills, key tools, and an interview practice question for the engineering domain: '{domain}'.

        Return strictly valid JSON matching this schema:
        {{
            "domain_selected": "{domain}",
            "recommended_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
            "key_tools_frameworks": ["Tool 1", "Tool 2"],
            "practice_question": "A technical interview question for this domain",
            "answer_hint": "Brief overview of what a good response includes"
        }}
        """

        completion = ai_client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a tech career mentor and interview coach. Output valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            model="openai/gpt-oss-20b",
            response_format={"type": "json_object"}
        )

        career_data = json.loads(completion.choices[0].message.content)
        return jsonify(career_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Server Entry Point
if __name__ == '__main__':
    app.run(debug=True, port=5000)