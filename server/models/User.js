const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    nationality: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    province: { type: String },
    city: { type: String },
    district: { type: String },
    password: { type: String, required: true },
    profileImage: { type: String, default: "" } // ✅ Added profileImage field
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
