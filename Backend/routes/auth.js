const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Sign Up
router.post("/signup", async (req, res) => {
    console.log("Signup request body:", req.body);
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        console.log("User created:", user.email);
        res.status(201).json({ message: "User created" });
    } catch (err) {
        console.error("Signup error:", err.message);
        res.status(400).json({ error: err.message });
    }
});

// Log In
router.post("/login", async (req, res) => {
    console.log("Login request body:", req.body);
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        console.log("Login successful, token generated");
        res.json({ token, user: { id: user._id, name: user.name } });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Get current user (protected)
router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json(user);
});

module.exports = router;
