# SecretMsg

## Introduction
SecretMsg is a fullstack web application that allows users to receive anonymous secret messages via a unique link. Users can register, get a personal link, and share it with friends. Anyone with the link can send a message, which is delivered securely and self-destructs after being read or after 24 hours. The project aims to provide a fun and private way to receive honest feedback or confessions.

## Project Type
Fullstack

## Deployed App
Frontend: https://deployed-site.frontend.example  
Backend: https://deployed-site.backend.example  
Database: MongoDB Atlas (cloud-hosted)

## Directory Structure
SecretMsg/  
├─ Backend/  
│  ├─ .gitignore  
│  ├─ src/  
│  │  ├─ .env  
│  │  ├─ app.js  
│  │  ├─ package.json  
│  │  ├─ configs/  
│  │  │  ├─ cronjob.js  
│  │  │  └─ db.js  
│  │  ├─ controllers/  
│  │  │  ├─ msg.controller.js  
│  │  │  └─ user.controller.js  
│  │  ├─ middlewares/  
│  │  │  └─ auth.middleware.js  
│  │  ├─ models/  
│  │  │  ├─ allusers.model.js  
│  │  │  ├─ msg.model.js  
│  │  │  └─ user.model.js  
│  │  └─ routes/  
│  │     ├─ auth.router.js  
│  │     └─ msg.router.js  
├─ Frontend/  
│  ├─ src/  
│  │  ├─ baseurl.js  
│  │  ├─ index.html  
│  │  ├─ Index/  
│  │  │  ├─ index.css  
│  │  │  └─ index.js  
│  │  └─ sendmessage/  
│  │     ├─ msg.css  
│  │     ├─ msg.html  
│  │     └─ msg.js  
└─ README.md


## Features

- User registration with unique username and password
- Generates a unique receiving link for each user
- Anonymous message sending via the link (no login required)
- Messages are visible only to the recipient and expire after 24 hours
- Auto-deletion of user accounts and messages after 24 hours
- Responsive, modern UI with mobile support
- Social sharing options for the receiving link
- Real-time username validation during registration (Socket.io)
- Secure password hashing (argon2)
- JWT-based authentication for message retrieval

## Design Decisions or Assumptions

- User accounts and their messages are automatically deleted after 24 hours for privacy.
- Messages are not stored permanently; orphaned messages are cleaned up via a cron job.
- No sender information is stored to ensure anonymity.
- Used Socket.io for real-time username validation during registration.
- MongoDB Atlas is used for cloud database hosting.
- Frontend and backend are decoupled and can be deployed separately.

## Installation & Getting started

**Backend:**
```bash
cd SecretMsg/Backend/src
npm install
# Create a .env file with your MongoDB URI and JWT secret
npm start
```

**Frontend:**
```bash
cd SecretMsg/Frontend/src
# Serve index.html and sendmessage/msg.html using any static server or open in browser
```

**MongoDB Schema:**
- User: `{ name, username, password, createdAt }` (auto-expires after 24h)
- Msg: `{ to: ObjectId(User), text }`
- allUser: `{ name }` (permanent record of registered names)

## Usage

1. Register with your name, username, and password.
2. Copy your unique receiving link and share it.
3. Anyone can send you a secret message using your link.
4. Login to view received messages (messages expire after 24 hours).

**Example:**
```bash
# Register
POST /register
{ "name": "Alice", "username": "alice123", "password": "pass" }

# Send Message (no auth required)
POST /sendMessage?id=<userId>
{ "message": "Hello!" }

# Get Messages (requires JWT)
GET /getMessages
Authorization: Bearer <token>
```

## Credentials

- Register a new account to get access.
- No default/test accounts provided (auto-deletes after 24h).

## APIs Used

- No external APIs required (except for social sharing links).
- Uses MongoDB Atlas for database.

## API Endpoints

| Endpoint                | Method | Auth      | Description                              |
|-------------------------|--------|-----------|------------------------------------------|
| /register               | POST   | No        | Register a new user                      |
| /login                  | POST   | No        | Login and get JWT token                  |
| /verify                 | GET    | Yes (JWT) | Verify session/token                     |
| /sendMessage?id=USER_ID | POST   | No        | Send anonymous message to user           |
| /getMessages            | GET    | Yes (JWT) | Get all messages for logged-in user      |
| /reciverValidate?id=ID  | GET    | No        | Validate receiving link and get metadata |

**Example Request/Response:**

- `POST /register`
  - Request: `{ "name": "Alice", "username": "alice123", "password": "pass" }`
  - Response: `{ id, message, token, name, time }`

- `POST /sendMessage?id=USER_ID`
  - Request: `{ "message": "Hello!" }`
  - Response: `{ message: "success" }`

- `GET /getMessages`
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ message: [ { text: "..." }, ... ] }`

## Technology Stack

- **Node.js**: Backend runtime
- **Express.js**: REST API framework
- **MongoDB**: Database (with TTL for auto-deletion)
- **Mongoose**: ODM for MongoDB
- **argon2**: Password hashing
- **jsonwebtoken**: JWT authentication
- **Socket.io**: Real-time username validation
- **node-cron**: Scheduled cleanup of orphaned messages
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Deployed on**: [Add deployment details here]

``
