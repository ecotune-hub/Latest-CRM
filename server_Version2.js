const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crm_map', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const contactSchema = new mongoose.Schema({
  name: String,
  address: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
});
const Contact = mongoose.model('Contact', contactSchema);

// Geocode an address using Mapbox
async function geocodeAddress(address) {
  const mapboxToken = process.env.MAPBOX_TOKEN;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}`;
  const res = await axios.get(url);
  if (
    res.data &&
    res.data.features &&
    res.data.features.length > 0 &&
    res.data.features[0].center
  ) {
    return {
      lng: res.data.features[0].center[0],
      lat: res.data.features[0].center[1],
    };
  }
  throw new Error('Geocoding failed');
}

// Get all contacts
app.get('/api/contacts', async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

// Add a new contact (auto-geocode the address)
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, address } = req.body;
    const coordinates = await geocodeAddress(address);
    const contact = new Contact({ name, address, coordinates });
    await contact.save();
    res.json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route planning (returns a GeoJSON route)
app.post('/api/route', async (req, res) => {
  try {
    const { contacts } = req.body; // array of contact IDs
    const contactDocs = await Contact.find({ _id: { $in: contacts } });
    if (contactDocs.length < 2) return res.status(400).json({ error: 'Select at least two contacts' });

    const coords = contactDocs.map(c => `${c.coordinates.lng},${c.coordinates.lat}`).join(';');
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&access_token=${process.env.MAPBOX_TOKEN}`;
    const routeRes = await axios.get(url);
    const routeGeoJson = routeRes.data.routes[0].geometry;

    res.json({ routeGeoJson });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
