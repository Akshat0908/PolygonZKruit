require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { verifyUserSkills, fetchJobListing } = require('./verijobUtils');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get('/api/job/:id', async (req, res) => {
    try {
        const jobUrl = `https://example.com/job-listing/${req.params.id}`;
        const networkType = req.query.networkType || 'mainnet';
        const jobListing = await fetchJobListing(jobUrl, networkType);
        res.json({ jobListing });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/verify-skills', async (req, res) => {
    try {
        const { skills, userId, networkType } = req.body;
        const verifiedSkills = await verifyUserSkills(skills, userId, networkType);
        res.json({ verifiedSkills });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));