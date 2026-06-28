const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, required: true }, // e.g., 'House', 'Villa', 'Apartment'
  status: { type: String, required: true }, // e.g., 'For Sale', 'For Rent'
  location: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  sqft: { type: Number, required: true },
  images: [{ type: String }],
  amenities: [{ type: String }],
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
