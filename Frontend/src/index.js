import React from "react";
import { createRoot } from "react-dom/client"; // Correct import for React 18
import { AuthProvider } from "./context/AuthContext";
import App from "./App";

const root = createRoot(document.getElementById("root")); // Create the root
root.render(
    // This should work in React 18
    <AuthProvider>
        <App />
    </AuthProvider>
);
