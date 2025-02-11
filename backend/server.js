const express = require('express');
const cors = require('cors'); // Import CORS

const mongoose = require('mongoose');
const Location = require('./Location'); // Import the model

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Use CORS middleware
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/locationDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

const fs = require('fs'); // Import the fs module

// API endpoint to save location
app.post('/api/location', async (req, res) => {
    console.log(`Received location: Latitude: ${req.body.latitude}, Longitude: ${req.body.longitude}, Country: ${req.body.country}, Locality: ${req.body.locality}, Date: ${req.body.date}`);
    
    const { latitude, longitude, country, locality, date } = req.body;
    const locationData = `Latitude: ${latitude}, Longitude: ${longitude}, Country: ${country}, Locality: ${locality}, Date: ${date}, Timestamp: ${new Date().toISOString()}\n`;
    
    // Write the location data to a text file
    fs.appendFile('locations.txt', locationData, (err) => {
        console.log('Writing to file...');

        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).send('Error saving location');
        }
        
        // Send a valid JSON response
        console.log('Location data saved successfully.');
        res.status(201).json({ latitude, longitude, country, locality, date });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
