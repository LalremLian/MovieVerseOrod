const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Movie title is required'],
            trim: true,
        },
        year: {
            type: Number,
            required: [true, 'Release year is required'],
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [10, 'Rating cannot exceed 10'],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
