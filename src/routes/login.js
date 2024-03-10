const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' }); 
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET); 
        res.json({ token }); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
