require('dotenv').config();
// console.log('OpenCage Key from .env:', process.env.OPENCAGE_API_KEY); // for debugging
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Location = require('./Location');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/locationDB')

    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

app.get('/api/get-opencage-key', (req, res) => {
    if (!process.env.OPENCAGE_API_KEY) {
        console.error("OpenCage API Key is missing in .env file!");
        return res.status(500).json({ error: "OpenCage API Key not found" });
    }
    res.json({ apiKey: process.env.OPENCAGE_API_KEY });
});

app.get('/api/google-maps-key', (req, res) => {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
        console.error("Google Maps API Key is missing in .env file!");
        return res.status(500).json({ error: "Google Maps API Key not found" });
    }
    res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

app.post('/api/location', async (req, res) => {
    console.log("Received Data:", req.body);

    const { latitude, longitude, country, locality, date } = req.body;

    try {
        const newLocation = new Location({ latitude, longitude, country, locality, date });
        await newLocation.save();

        fs.appendFile('locations.txt', `Latitude: ${latitude}, Longitude: ${longitude}, Country: ${country}, Locality: ${locality}, Date: ${date}\n`, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                return res.status(500).send('Error saving location');
            }
            console.log('Location saved successfully');
            res.status(201).json({ latitude, longitude, country, locality, date });
        });

    } catch (error) {
        console.error('MongoDB Save Error:', error);
        res.status(500).json({ error: 'Error saving location in database' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
