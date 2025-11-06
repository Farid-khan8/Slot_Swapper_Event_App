import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import EventForm from "./EventForm";

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (token) fetchEvents();
    }, [token]);

    console.log("Axios headers:", axios.defaults.headers.common); // Debugging line

    const fetchEvents = async () => {
        try {
            const res = await axios.get("/api/events");
            setEvents(res.data);
        } catch (err) {
            if (err.response?.status === 403) {
                alert("Session expired. Please log in again.");
                logout(); // Call logout from AuthContext
            } else {
                console.error(err);
            }
        }
    };

    const updateStatus = async (id, status) => {
        await axios.put(`/api/events/${id}`, { status });
        fetchEvents();
    };

    return (
        <div className="container">
            <h2>My Calendar</h2>
            <EventForm onAdd={fetchEvents} />
            <ul className="list-group">
                {events.map((event) => (
                    <li key={event._id} className="list-group-item">
                        {event.title} (
                        {new Date(event.startTime).toLocaleString()} -{" "}
                        {new Date(event.endTime).toLocaleString()}) -{" "}
                        {event.status}
                        {event.status === "BUSY" && (
                            <button
                                onClick={() =>
                                    updateStatus(event._id, "SWAPPABLE")
                                }
                            >
                                Make Swappable
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
