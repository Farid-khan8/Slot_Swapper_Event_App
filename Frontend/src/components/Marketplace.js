import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Marketplace = () => {
    const [slots, setSlots] = useState([]);
    const [mySlots, setMySlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (token) {
            fetchSlots();
            fetchMySlots();
        }
    }, [token]);

    const fetchSlots = async () => {
        const res = await axios.get("/api/swaps/swappable-slots");
        setSlots(res.data);
    };

    const fetchMySlots = async () => {
        const res = await axios.get("/api/events");
        setMySlots(res.data.filter((e) => e.status === "SWAPPABLE"));
    };

    const requestSwap = async (theirSlotId, mySlotId) => {
        await axios.post("/api/swaps/swap-request", { mySlotId, theirSlotId });
        fetchSlots();
        fetchMySlots();
        setSelectedSlot(null);
    };

    return (
        <div className="container">
            <h2>Marketplace</h2>
            <ul className="list-group">
                {slots.map((slot) => (
                    <li key={slot._id} className="list-group-item">
                        {slot.title} by {slot.userId.name} (
                        {new Date(slot.startTime).toLocaleString()} -{" "}
                        {new Date(slot.endTime).toLocaleString()})
                        <button onClick={() => setSelectedSlot(slot._id)}>
                            Request Swap
                        </button>
                        {selectedSlot === slot._id && (
                            <div>
                                <h5>Choose your slot to offer:</h5>
                                <ul>
                                    {mySlots.map((mySlot) => (
                                        <li key={mySlot._id}>
                                            {mySlot.title} (
                                            {new Date(
                                                mySlot.startTime
                                            ).toLocaleString()}{" "}
                                            -{" "}
                                            {new Date(
                                                mySlot.endTime
                                            ).toLocaleString()}
                                            )
                                            <button
                                                onClick={() =>
                                                    requestSwap(
                                                        slot._id,
                                                        mySlot._id
                                                    )
                                                }
                                            >
                                                Offer This
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => setSelectedSlot(null)}>
                                    Cancel
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Marketplace;
