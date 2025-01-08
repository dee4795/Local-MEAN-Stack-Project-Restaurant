const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// No need for body-parser module as of Express 4.16.0
const Restaurant = require('./models/restaurant.model');
const User = require('./models/user.model');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Use built-in middleware for JSON

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/restaurantDB', {
    
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Error connecting to MongoDB:', error);
});

// Restaurant Routes
app.post('/api/restaurants', async (req, res) => {
    try {
        const restaurant = new Restaurant(req.body);
        await restaurant.save();
        res.status(201).json(restaurant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/restaurants', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/restaurants/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id, 
            req.body,
            { new: true }
        );
        res.json(restaurant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/restaurants/:id', async (req, res) => {
    try {
        await Restaurant.findByIdAndDelete(req.params.id);
        res.json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Authentication Routes
app.post('/api/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
            password: req.body.password
        });
        
        if (user) {
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
