const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    country: { type: String, required: true },
    locality: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now }
});

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;
