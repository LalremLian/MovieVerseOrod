import { useState } from 'react';
import RegisterForm from './components/RegisterForm';
import MovieManager from './components/MovieManager';
import './index.css';

function App() {
    const [activeTab, setActiveTab] = useState('register');

    return (
        <div className="app">
            {/* Animated background blobs */}
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>
            <div className="bg-blob blob-3"></div>

            {/* Header */}
            <header className="header">
                <div className="logo">
                    <span className="logo-icon">🎬</span>
                    <h1>MovieVerse</h1>
                </div>
                <p className="tagline">Your personal movie collection</p>
            </header>

            {/* Tab Navigation */}
            <nav className="tabs">
                <button
                    className={`tab ${activeTab === 'register' ? 'active' : ''}`}
                    onClick={() => setActiveTab('register')}
                >
                    <span className="tab-icon">👤</span>
                    Register
                </button>
                <button
                    className={`tab ${activeTab === 'movies' ? 'active' : ''}`}
                    onClick={() => setActiveTab('movies')}
                >
                    <span className="tab-icon">🎥</span>
                    Movies
                </button>
            </nav>

            {/* Content */}
            <main className="main">
                {activeTab === 'register' ? <RegisterForm /> : <MovieManager />}
            </main>

            {/* Footer */}
            <footer className="footer">
                <p>MovieVerse &copy; 2026 — Built with MERN Stack</p>
            </footer>
        </div>
    );
}

export default App;
