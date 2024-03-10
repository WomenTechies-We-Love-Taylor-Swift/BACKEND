// controllers/userController.js
const User = require('../models/userModel');

exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
};
