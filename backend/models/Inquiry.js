const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: false },
  date: { type: Date, required: false },
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
