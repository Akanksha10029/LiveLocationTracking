const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    continent: String,
    country: String,
    state: String,
    state_district: String,
    city: String,
    postcode: String,
    road_type: String,
    locality: String,
    date: { type: Date, default: Date.now }
});
const Location = mongoose.model("Location", locationSchema);
module.exports = Location;


