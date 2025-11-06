import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Marketplace from "./components/Marketplace";
import Notifications from "./components/Notifications";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
    const { token, logout } = useContext(AuthContext);

    return (
        <BrowserRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
            {" "}
            {/* Added future flags */}
            <div>
                {token && (
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="container">
                            <span className="navbar-brand">SlotSwapper</span>
                            <div className="navbar-nav">
                                <a className="nav-link" href="/dashboard">
                                    Dashboard
                                </a>
                                <a className="nav-link" href="/marketplace">
                                    Marketplace
                                </a>
                                <a className="nav-link" href="/notifications">
                                    Notifications
                                </a>
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={logout}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </nav>
                )}
                <Routes>
                    <Route path="/auth" element={<Auth />} />
                    {token ? (
                        <>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route
                                path="/marketplace"
                                element={<Marketplace />}
                            />
                            <Route
                                path="/notifications"
                                element={<Notifications />}
                            />
                            <Route
                                path="*"
                                element={<Navigate to="/dashboard" />}
                            />
                        </>
                    ) : (
                        <Route path="*" element={<Navigate to="/auth" />} />
                    )}
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;
