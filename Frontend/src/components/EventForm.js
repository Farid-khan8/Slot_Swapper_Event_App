import React, { useState } from "react";
import axios from "axios";

const EventForm = ({ onAdd }) => {
    const [form, setForm] = useState({ title: "", startTime: "", endTime: "" });
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (new Date(form.endTime) <= new Date(form.startTime)) {
            setError("End time must be after start time.");
            return;
        }
        try {
            await axios.post("/api/events", form);
            onAdd();
            setForm({ title: "", startTime: "", endTime: "" });
            setError("");
        } catch (err) {
            setError("Failed to create event.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
                <label className="form-label">Event Title</label>
                <input
                    type="text"
                    className="form-control"
                    value={form.title}
                    onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                    }
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Start Time</label>
                <input
                    type="datetime-local"
                    className="form-control"
                    value={form.startTime}
                    onChange={(e) =>
                        setForm({ ...form, startTime: e.target.value })
                    }
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">End Time</label>
                <input
                    type="datetime-local"
                    className="form-control"
                    value={form.endTime}
                    onChange={(e) =>
                        setForm({ ...form, endTime: e.target.value })
                    }
                    required
                />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary">
                Add Event
            </button>
        </form>
    );
};

export default EventForm;
