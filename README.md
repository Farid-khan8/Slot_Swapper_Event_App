# 🎯 Slot Swapper

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Framework-Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-black?logo=jsonwebtokens)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success)](#)

---

### 🔗 **Live Demo (optional)**

> _(Add link here if you deploy the app — e.g., Vercel/Render/Netlify)_

---

## 🧠 About the Project

**Slot Swapper** is a full-stack web application designed to manage and swap time slots efficiently.  
It’s a peer-to-peer time-slot scheduling platform that enables users to manage calendars, mark events as _swappable_, and exchange time slots securely.

Users can:

-   Manage personal calendars
-   Browse other users’ swappable slots
-   Request and accept/reject swaps
-   Receive real-time updates with authentication

---

## 🚀 Features

-   🔐 **User Authentication:** Secure sign-up/login with JWT-based sessions
-   📅 **Calendar Management:** Create, view, update personal events (Busy/Swappable)
-   🔄 **Marketplace:** Discover other users’ available slots
-   🔔 **Notifications:** Accept/reject swap requests
-   ⚡ **Swap Logic:** Server-side validation with status synchronization
-   📱 **Responsive UI:** Built with React & Bootstrap for smooth UX

---

## 🧱 Tech Stack

| Category           | Technologies                               |
| ------------------ | ------------------------------------------ |
| **Frontend**       | React 18, React Router 6, Axios, Bootstrap |
| **Backend**        | Node.js, Express.js                        |
| **Database**       | MongoDB (local or Atlas via Mongoose)      |
| **Authentication** | JWT (JSON Web Tokens)                      |
| **Utilities**      | bcryptjs, CORS                             |

---

## 🧩 Design Choices

-   **JWT Authentication:** Stateless sessions with 1-hour expiry
-   **MongoDB Schema:**
    -   Collections: _Users_, _Events_, _SwapRequests_
    -   Event Statuses: `BUSY`, `SWAPPABLE`, `SWAP_PENDING`
    -   Swap Statuses: `PENDING`, `ACCEPTED`, `REJECTED`
-   **State Management:** React Context API for simplicity
-   **Swap Logic:** Validates swappable status before request creation
-   **UI/UX:** Lightweight list-based interface using Bootstrap
-   **Security:** Password hashing, protected routes, and CORS
-   **Error Handling:** Validation + console logging (production ready)

---

## ⚙️ Setup Instructions

### 🧾 Pr

2️⃣ Set Up the Backend

cd backend
npm install

Create a .env file inside backend/ with the following content:
PORT=
MONGO_URI=
JWT_SECRET=
For MongoDB Atlas, replace the URI with your connection string.

Run the backend server:
npm start

3️⃣ Set Up the Frontend

Open a new terminal:
cd frontend
npm install
npm start

4️⃣ Test the Setup

• Open http://localhost:3000￼ in your browser
• Sign up, log in, and create events
• Use another browser/incognito to create another user and test swapping

🧩 Troubleshooting
• Port Conflicts: If ports 5000/5001 are busy (e.g., by AirPlay), change them in server.js and package.json.
• MongoDB Issues: Ensure MongoDB is running; check logs in backend terminal.
• CORS Errors: Restart both frontend and backend if persistent.
• npm Errors: Run npm cache clean --force and retry installation

🧠 API Endpoints

All protected endpoints require a Bearer token in the header:
Authorization: Bearer <token>

Endpoint
Method
Description
Example Request
Example Response
/api/auth/signup
POST
Register a new user
{ "name": "John", "email": "john@example.com", "password": "pass" }
{ "message": "User created" }
/api/auth/login
POST
Log in and get JWT
{ "email": "john@example.com", "password": "pass" }
{ "token": "<jwt>", "user": { "id": "...", "name": "John" } }
/api/auth/me
GET
Get current user (protected)
—
{ "\_id": "...", "name": "John" }
/api/events
GET
Get user’s events
—
[ { "title": "...", "status": "BUSY" } ]
/api/events
POST
Create new event
{ "title": "Meeting", "startTime": "...", "endTime": "..." }
Created event object
/api/events/:id
PUT
Update event status
{ "status": "SWAPPABLE" }
Updated event object
/api/events/:id
DELETE
Delete event
—
{ "message": "Event deleted" }
/api/swaps/swappable-slots
GET
Get others’ swappable slots
—
Array of slots
/api/swaps/swap-request
POST
Request a swap
{ "mySlotId": "...", "theirSlotId": "..." }
Swap request object
/api/swaps/swap-response/:requestId
POST
Respond to swap
{ "accepted": true }
{ "message": "Accepted" }
/api/swaps/requests
GET
Get user’s swap requests
—
{ "incoming": [...], "outgoing": [...] }

🧗 Challenges Faced
• Port Conflicts: macOS AirPlay using port 5000 — fixed by updating proxy and port.
• MongoDB Queries: Required precise use of populate and match for swap requests.
• Frontend-Backend Sync: Ensured state updates without full reloads.
• React Upgrades: Adjusted syntax for React 18 & Router 6 (createRoot, Routes).
• Error Debugging: Solved proxy mismatch issues causing 403 errors.
• UI Simplicity: List views chosen over full calendars for lightweight UX.

🧑‍💻 Usage
• Sign Up / Login: Create an account to access features.
• Manage Calendar: Add and mark events as swappable.
• Browse Marketplace: View and request swaps from others.
• Notifications: Accept or reject incoming swap requests.
