import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function MovieManager() {
    const [movies, setMovies] = useState([]);
    const [form, setForm] = useState({ title: '', year: '', rating: '' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Fetch movies on load
    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const res = await fetch(`${API_URL}/movies`);
            const data = await res.json();
            setMovies(data);
        } catch (err) {
            setMessage({ type: 'error', text: '❌ Failed to load movies' });
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const payload = {
            title: form.title,
            year: Number(form.year),
            rating: Number(form.rating),
        };

        try {
            const url = editingId
                ? `${API_URL}/movies/${editingId}`
                : `${API_URL}/movies`;

            const res = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: `✅ ${data.message}` });
                setForm({ title: '', year: '', rating: '' });
                setEditingId(null);
                fetchMovies();
            } else {
                setMessage({ type: 'error', text: `❌ ${data.message}` });
            }
        } catch (err) {
            setMessage({ type: 'error', text: '❌ Network error — is the server running?' });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (movie) => {
        setForm({ title: movie.title, year: movie.year, rating: movie.rating });
        setEditingId(movie._id);
        setMessage(null);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this movie?')) return;

        try {
            const res = await fetch(`${API_URL}/movies/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: `✅ ${data.message}` });
                fetchMovies();
            } else {
                setMessage({ type: 'error', text: `❌ ${data.message}` });
            }
        } catch (err) {
            setMessage({ type: 'error', text: '❌ Network error' });
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm({ title: '', year: '', rating: '' });
        setMessage(null);
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 10; i++) {
            stars.push(
                <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="movie-section fade-in">
            {/* Add / Edit Form */}
            <div className="card">
                <div className="card-header">
                    <div className="card-icon">🎬</div>
                    <h2>{editingId ? 'Edit Movie' : 'Add Movie'}</h2>
                    <p className="card-subtitle">
                        {editingId ? 'Update movie details' : 'Add a new movie to your collection'}
                    </p>
                </div>

                {message && (
                    <div className={`toast ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Movie Title</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="e.g. Inception"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="year">Year</label>
                            <input
                                id="year"
                                name="year"
                                type="number"
                                placeholder="e.g. 2010"
                                value={form.year}
                                onChange={handleChange}
                                required
                                min="1888"
                                max="2030"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="rating">Rating (1–10)</label>
                            <input
                                id="rating"
                                name="rating"
                                type="number"
                                placeholder="e.g. 9"
                                value={form.rating}
                                onChange={handleChange}
                                required
                                min="1"
                                max="10"
                            />
                        </div>
                    </div>

                    <div className="btn-row">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <span className="spinner"></span>
                            ) : editingId ? (
                                'Update Movie'
                            ) : (
                                'Add Movie'
                            )}
                        </button>
                        {editingId && (
                            <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Movie List */}
            <div className="movie-list">
                <h2 className="section-title">
                    🎥 Your Collection
                    <span className="badge">{movies.length}</span>
                </h2>

                {movies.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">🍿</span>
                        <p>No movies yet. Add your first one above!</p>
                    </div>
                ) : (
                    <div className="movie-grid">
                        {movies.map((movie) => (
                            <div key={movie._id} className="movie-card">
                                <div className="movie-card-top">
                                    <h3 className="movie-title">{movie.title}</h3>
                                    <span className="movie-year">{movie.year}</span>
                                </div>
                                <div className="movie-rating">{renderStars(movie.rating)}</div>
                                <div className="movie-actions">
                                    <button
                                        className="btn btn-sm btn-edit"
                                        onClick={() => handleEdit(movie)}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-delete"
                                        onClick={() => handleDelete(movie._id)}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
