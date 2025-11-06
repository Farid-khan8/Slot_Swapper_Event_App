import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Notifications = () => {
    const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (token) fetchRequests();
    }, [token]);

    const fetchRequests = async () => {
        const res = await axios.get("/api/swaps/requests");
        setRequests(res.data);
    };

    const respond = async (requestId, accepted) => {
        await axios.post(`/api/swaps/swap-response/${requestId}`, { accepted });
        fetchRequests();
    };

    return (
        <div className="container">
            <h2>Notifications</h2>
            <h3>Incoming Requests</h3>
            <ul className="list-group">
                {requests.incoming.map((req) => (
                    <li key={req._id} className="list-group-item">
                        Swap request for your {req.targetSlotId.title} with{" "}
                        {req.requesterSlotId.title} (Status: {req.status})
                        {req.status === "PENDING" && (
                            <>
                                <button onClick={() => respond(req._id, true)}>
                                    Accept
                                </button>
                                <button onClick={() => respond(req._id, false)}>
                                    Reject
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            <h3>Outgoing Requests</h3>
            <ul className="list-group">
                {requests.outgoing.map((req) => (
                    <li key={req._id} className="list-group-item">
                        You offered {req.requesterSlotId.title} for{" "}
                        {req.targetSlotId.title} (Status: {req.status})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;
