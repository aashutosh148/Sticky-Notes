# Sticky Notes Backend

This is the backend part of the application, built with Node.js, Express, and MongoDB.

## Features

- RESTful API for note management
- User authentication with JWT
- MongoDB database integration

## Getting Started

1. Navigate to the backend directory:
  ```bash
   cd backend
   ```

1. Install dependencies:
  ```bash
   npm install
   ```

1. Set up environment variables:
   Create a .env file in the backend directory with the following:

```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
```

2. Start the server:
```bash
   npm run dev
```
   The server will start on `http://localhost:5000`.

## Project Structure

- controllers/: Request handlers
- middleware/: Custom middleware (e.g., authentication)
- models/: Mongoose models
- routes/: API routes
- app.js: Main server file

## API Endpoints

- POST /api/users/register : Register a new user
- POST /api/users/login : Log in a user
- GET /api/notes : Get all notes for the authenticated user
- POST /api/notes : Create a new note
- DELETE /api/notes/:id : Delete a note

## Dependencies

- Express.js
- Mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
