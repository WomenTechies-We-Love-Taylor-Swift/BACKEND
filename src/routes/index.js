
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

const mongoURI = 'mongodb+srv://tiwarianiruddh1231:admin@cluster0.yqwjoao.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

// Define a mongoose model for your user data
const User = mongoose.model('User', {
    username: String,
    email: String,

});

app.use(express.json());

// API route to add user data
app.post('/api/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/api/users/disp', async (req, res) => {
    try {
        const users = await User.find({}, 'username email');
        res.json(users);
        console.log(users);
    } catch (err) {
        console.error('Error getting users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.put('/api/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        res.json(updatedUser);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


