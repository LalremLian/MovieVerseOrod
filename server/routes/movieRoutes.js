const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// POST /api/movies — Add a new movie
router.post('/', async (req, res) => {
    try {
        const { title, year, rating } = req.body;
        const movie = await Movie.create({ title, year, rating });
        res.status(201).json({ message: 'Movie added successfully', movie });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/movies — List all movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/movies/:id — Update a movie
router.put('/:id', async (req, res) => {
    try {
        const { title, year, rating } = req.body;
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            { title, year, rating },
            { new: true, runValidators: true }
        );

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.json({ message: 'Movie updated successfully', movie });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/movies/:id — Delete a movie
router.delete('/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
