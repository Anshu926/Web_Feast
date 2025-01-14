const mongoose = require('mongoose');

// Define the schema for the 'user' collection
const FeastSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    createdAt: { type: Date, default: Date.now },
    image: { type: String },  // Store the path to the image file
});

// Create and export the model
module.exports = mongoose.model('Chuk', FeastSchema);