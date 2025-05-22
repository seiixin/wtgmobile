// filepath: /c:/Users/Cereno Family/Documents/WalkToGrave-April-16-2025/WalkToGrave/server/models/BoneGrave.js
const mongoose = require('mongoose');

const ChildGraveSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    nickname: { type: String, required: true },
    dateOfBirth: { type: Date, required: true }, // Changed from birthDate
    burial: { type: Date, required: true }, // Changed from burialDate
    phase: { type: String, required: true }, // Changed from blockPhase
    aptNo: { type: String, required: true }, // Changed from apartmentNumber
    image: { type: String }, // Optional field for image
    description: { type: String }
});

module.exports = mongoose.model('ChildGrave', ChildGraveSchema);