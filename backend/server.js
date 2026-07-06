const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Property = require('./models/Property');
const Inquiry = require('./models/Inquiry');
const Testimonial = require('./models/Testimonial');
const { upload } = require('./config/cloudinary');
const { protect } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nestlux')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/properties', async (req, res) => {
  try {
    // Add filters mapping from query
    let query = {};
    if (req.query.location) query.location = new RegExp(req.query.location, 'i');
    if (req.query.type) query.type = new RegExp(req.query.type, 'i');
    if (req.query.maxPrice) query.price = { $lte: Number(req.query.maxPrice) };
    if (req.query.beds) query.bedrooms = { $gte: Number(req.query.beds) };

    const properties = await Property.find(query);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/properties', protect, upload.array('images', 5), async (req, res) => {
  try {
    if (req.user.role === 'user') {
      return res.status(403).json({ message: 'Not authorized to add properties' });
    }

    const imageUrls = req.files ? req.files.map(file => file.path) : [];
    
    const newProperty = new Property({
      ...req.body,
      images: imageUrls,
      image: imageUrls[0] || '', // fallback
      agent: req.user._id
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/properties/featured', async (req, res) => {
  try {
    const featuredProperties = await Property.find({ featured: true });
    res.json(featuredProperties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/inquiries', async (req, res) => {
  try {
    const newInquiry = new Inquiry(req.body);
    await newInquiry.save();
    res.status(201).json(newInquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
