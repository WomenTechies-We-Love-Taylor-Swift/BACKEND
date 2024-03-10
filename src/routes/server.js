// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const Post = mongoose.model('Post', {
    title: { type: String, required: true },
    tags: { type: [String], required: true },
});

app.use(bodyParser.json());


mongoose.connect('mongodb+srv://tiwarianiruddh1231:admin@cluster0.yqwjoao.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// User model
const User = mongoose.model('User', {
    name: { type: String },
    age: { type: Number },
    gender: { type: String },
    dateOfJoin: { type: Date, default: Date.now },
    preferredPosts: { type: Object, default: {} },
});
// User routes
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        console.log(req.bod);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/users/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/users/:userId', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
});

app.delete('/users/:userId', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
});
app.post('/signup', async (req, res) => {
    try {
        const { name, age, gender, address, phoneNumber } = req.body;
        const user = new User({ name, age, gender, address, phoneNumber });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/swipeRight/:userId/:postId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const postId = req.params.postId;

        const user = await User.findById(userId);
        const post = await Post.findById(postId);

        if (post && !user.likedPosts.includes(postId)) {
            user.likedPosts.push(postId);

            await user.save();

            res.status(200).json({ message: 'Swiped right successfully' });
        } else {
            res.status(404).json({ error: 'Post not found or already liked' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/similarPosts/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId).populate('likedPosts');

        if (user) {

            const userTags = user.likedPosts.reduce((tags, post) => {
                return tags.concat(post.tags);
            }, []);

            const similarPosts = await Post.find({ tags: { $in: userTags } });

            res.status(200).json(similarPosts);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/similarPosts/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId).populate('likedPosts');

        if (user) {
            const userTags = user.likedPosts.reduce((tags, post) => {
                return tags.concat(post.tags);
            }, []);

            const similarPosts = await Post.find({ tags: { $in: userTags } });

            const postsWithMatches = similarPosts.map((post) => ({
                post,
                tagMatches: post.tags.filter((tag) => userTags.includes(tag)),
            }));

            res.status(200).json(postsWithMatches);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
