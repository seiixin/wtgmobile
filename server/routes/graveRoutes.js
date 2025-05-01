const express = require('express');
const router = express.Router();
const BoneGrave = require('../models/BoneGrave');
const AdultGrave = require('../models/AdultGrave');
const ChildGrave = require('../models/ChildGrave');

// Search graves by firstname or lastname
router.get('/search', async (req, res) => {
    const { query } = req.query;
    try {
        const queryParts = query.split(' ');
        const firstNameQuery = queryParts[0] || '';
        const lastNameQuery = queryParts[1] || '';

        const boneGraves = await BoneGrave.find({
            firstName: firstNameQuery,
            lastName: lastNameQuery,
        }).select('firstName lastName dateOfBirth burial phase aptNo image description');

        const adultGraves = await AdultGrave.find({
            firstName: firstNameQuery,
            lastName: lastNameQuery,
        }).select('firstName lastName dateOfBirth burial phase aptNo image description');

        const childGraves = await ChildGrave.find({
            firstName: firstNameQuery,
            lastName: lastNameQuery,
        }).select('firstName lastName dateOfBirth burial phase aptNo image description');

        const results = [...boneGraves, ...adultGraves, ...childGraves];
        console.log('Search Results:', results); // Log the results
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching graves' });
    }
});

module.exports = router;