const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  quote: { type: String, required: true },
  avatar: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
