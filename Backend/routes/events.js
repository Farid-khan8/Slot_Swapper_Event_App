const express = require("express");
const Event = require("../models/Event");
const auth = require("../middleware/auth");

const router = express.Router();

// Get user's events
router.get("/", auth, async (req, res) => {
    const events = await Event.find({ userId: req.user.id });
    res.json(events);
});

// Create event
router.post("/", auth, async (req, res) => {
    const { title, startTime, endTime } = req.body;
    const event = new Event({ title, startTime, endTime, userId: req.user.id });
    await event.save();
    res.status(201).json(event);
});

// Update event (e.g., status)
router.put("/:id", auth, async (req, res) => {
    const { status } = req.body;
    const event = await Event.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { status },
        { new: true }
    );
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
});

// Delete event
router.delete("/:id", auth, async (req, res) => {
    await Event.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Event deleted" });
});

module.exports = router;
