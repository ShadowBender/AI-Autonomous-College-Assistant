import React, { useState } from 'react';

const StudyPlanner = () => {
  const [formData, setFormData] = useState({
    subject: 'Software Architectures (CS701)',
    exam_date: 'In 2 weeks',
    daily_hours: 2,
    total_days: 7
  });
  
  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generatePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPlanData(null);

    try {
      const response = await fetch('http://localhost:5000/api/study-plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to generate study plan');

      const data = await response.json();
      setPlanData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ color: '#1e3a8a', marginBottom: '0.5rem' }}>Autonomous Study Planner</h1>
      <p style={{ color: '#4b5563', marginBottom: '2rem' }}>
        Generate an AI-optimized, day-by-day preparation strategy for your RGPV semester exams.
      </p>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Input Form Section */}
        <div style={{ flex: '1 1 300px', backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <form onSubmit={generatePlan} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Subject / Course</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Exam Target (e.g., Nov 15 or 'In 2 weeks')</label>
              <input
                type="text"
                name="exam_date"
                value={formData.exam_date}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Daily Hours</label>
                <input
                  type="number"
                  name="daily_hours"
                  value={formData.daily_hours}
                  onChange={handleChange}
                  min="1"
                  max="12"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Total Days</label>
                <input
                  type="number"
                  name="total_days"
                  value={formData.total_days}
                  onChange={handleChange}
                  min="1"
                  max="30"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                marginTop: '1rem',
                padding: '0.8rem',
                backgroundColor: loading ? '#93c5fd' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600'
              }}
            >
              {loading ? 'Crunching Syllabus...' : 'Generate AI Study Plan'}
            </button>
          </form>

          {error && <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '6px' }}>{error}</div>}
        </div>

        {/* Generated Plan Section */}
        <div style={{ flex: '2 1 400px' }}>
          {!planData && !loading && (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1', borderRadius: '8px', color: '#64748b', padding: '2rem', textAlign: 'center' }}>
              Your generated day-by-day roadmap will appear here.
            </div>
          )}

          {planData && (
            <div style={{ animation: 'fadeIn 0.5s', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e40af' }}>Plan Overview</h3>
                <p style={{ margin: 0, color: '#1e3a8a' }}>
                  <strong>{planData.subject}</strong> • {planData.total_days} Days • {planData.daily_hours_allocated} Hrs/Day
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {planData.plan.map((dayPlan, index) => (
                  <div key={index} style={{ padding: '1rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', borderLeft: '4px solid #2563eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.05rem' }}>{dayPlan.day}</h4>
                    <p style={{ margin: 0, color: '#4b5563', lineHeight: '1.5' }}>{dayPlan.task}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;