// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dateOfJoin: { type: Date, default: Date.now },
    // Add other fields as needed
    preferredPosts: { type: Object, default: {} },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
