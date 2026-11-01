import React, { useState } from 'react';

const CareerAdvisor = () => {
  const [domain, setDomain] = useState('Full-Stack Web Development');
  const [loading, setLoading] = useState(false);
  const [careerData, setCareerData] = useState(null);
  const [error, setError] = useState('');

  const generateRecommendations = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCareerData(null);

    try {
      const response = await fetch('http://localhost:5000/api/career/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch career recommendations');
      }

      const data = await response.json();
      setCareerData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>AI Career & Skill Readiness Advisor</h1>
      <p style={{ color: '#4b5563', marginBottom: '2rem' }}>
        Generate target skills, required tools, and technical interview questions for your next placement drive.
      </p>

      <form onSubmit={generateRecommendations} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="e.g., Software Architecture, Data Engineering, B2B Lead Gen..."
          style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '1rem' }}
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: loading ? '#93c5fd' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600'
          }}
        >
          {loading ? 'Analyzing...' : 'Generate Roadmap'}
        </button>
      </form>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      {careerData && (
        <div style={{ animation: 'fadeIn 0.5s', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#0f172a' }}>🎯 Recommended Skills for {careerData.domain_selected}</h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#334155', lineHeight: '1.6' }}>
              {careerData.recommended_skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#0f172a' }}>⚙️ Key Tools & Frameworks</h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#334155', lineHeight: '1.6' }}>
              {careerData.key_tools_frameworks.map((tool, index) => (
                <li key={index}>{tool}</li>
              ))}
            </ul>
          </div>

          <div style={{ padding: '1.5rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e40af' }}>💡 Practice Interview Question</h3>
            <p style={{ margin: '0 0 1rem 0', color: '#1e3a8a', fontWeight: '500', fontSize: '1.1rem' }}>
              "{careerData.practice_question}"
            </p>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e40af', fontSize: '0.9rem', textTransform: 'uppercase' }}>How to Answer:</h4>
            <p style={{ margin: 0, color: '#1e3a8a' }}>{careerData.answer_hint}</p>
          </div>

        </div>
      )}
    </div>
  );
};

export default CareerAdvisor;