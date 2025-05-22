const BoneGrave = require('../models/BoneGrave');
const AdultGrave = require('../models/AdultGrave');
const ChildGrave = require('../models/ChildGrave');

exports.searchGraves = async (req, res) => {
    const { query } = req.query;
    try {
        const queryParts = query.split(' ');
        const firstNameQuery = queryParts[0] || '';
        const lastNameQuery = queryParts[1] || '';

        // Use regex for more flexible search
        const filter = {
            firstName: { $regex: firstNameQuery, $options: 'i' },
            lastName: { $regex: lastNameQuery, $options: 'i' }
        };

        const selectFields = 'firstName lastName nickname dateOfBirth burial phase aptNo image description';

        const boneGraves = await BoneGrave.find(filter).select(selectFields);
        const adultGraves = await AdultGrave.find(filter).select(selectFields);
        const childGraves = await ChildGrave.find(filter).select(selectFields);

        const results = [...boneGraves, ...adultGraves, ...childGraves];
        console.log('Controller Search Results:', results);
        res.json(results);
    } catch (error) {
        console.error('Controller Error:', error);
        res.status(500).json({ message: 'Error fetching graves' });
    }
};