import { useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function RegisterForm() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: `✅ ${data.message}` });
                setForm({ name: '', email: '', password: '' });
            } else {
                setMessage({ type: 'error', text: `❌ ${data.message}` });
            }
        } catch (err) {
            setMessage({ type: 'error', text: '❌ Network error — is the server running?' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card fade-in">
            <div className="card-header">
                <div className="card-icon">👤</div>
                <h2>Create Account</h2>
                <p className="card-subtitle">Join MovieVerse today</p>
            </div>

            {message && (
                <div className={`toast ${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                        <span className="spinner"></span>
                    ) : (
                        'Register'
                    )}
                </button>
            </form>
        </div>
    );
}
