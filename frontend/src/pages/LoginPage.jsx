import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('student@sistec.ac.in');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('userId', data.user_id);
        window.location.href = '/'; // Force reload to trigger role routing
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Server unreachable.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '2rem', border: '1px solid #eaeaea', borderRadius: '8px' }}>
      <h2>Sign In</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: '0.5rem' }}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ padding: '0.5rem' }} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={{ padding: '0.5rem' }} />
        <button type="submit" style={{ padding: '0.5rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Login</button>
      </form>
    </div>
  );
}