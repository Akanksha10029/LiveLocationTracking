const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Location = require('./Location');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/locationDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// API endpoint to save location
app.post('/api/location', async (req, res) => {
    console.log("Received Data:", req.body);

    const { latitude, longitude, country, locality, date } = req.body;

    try {
        // Save to MongoDB
        const newLocation = new Location({ latitude, longitude, country, locality, date });
        await newLocation.save();

        // Append to locations.txt
        const locationData = `Latitude: ${latitude}, Longitude: ${longitude}, Country: ${country}, Locality: ${locality}, Date: ${date}, Timestamp: ${new Date().toISOString()}\n`;

        fs.appendFile('locations.txt', locationData, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                return res.status(500).send('Error saving location');
            }
            console.log('Location saved to MongoDB and locations.txt');
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
