# Quick Notes API

A lightweight, in-memory REST API for managing personal notes with authentication and authorization.

## 🎯 Features

- **Mock Authentication**: Simple token-based auth supporting multiple users
- **CRUD Operations**: Create, read, update, and delete notes
- **Authorization**: Users can only access their own notes
- **Validation**: Input validation with meaningful error messages
- **Logging**: Request/response logging with timing
- **Health Check**: Monitor API status

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Storage**: In-memory (Map-based)
- **ID Generation**: UUID v4

## 📁 Project Structure

```
QuickNotes/
├── src/
│   ├── middleware/
│   │   ├── auth.ts          # Authentication middleware
│   │   └── logger.ts        # Request logging middleware
│   ├── routes/
│   │   ├── auth.ts          # Auth endpoints
│   │   ├── notes.ts         # Notes CRUD endpoints
│   │   └── health.ts        # Health check endpoint
│   ├── services/
│   │   ├── authService.ts   # Auth business logic
│   │   └── notesService.ts  # Notes business logic & validation
│   ├── storage.ts           # In-memory data storage
│   ├── types.ts             # TypeScript interfaces
│   └── server.ts            # Express app setup
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The API will be running at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## 📡 API Endpoints

### 1. Health Check

Check if the API is running.

**Request:**
```bash
curl http://localhost:3000/health
```

**Response: 200 OK**
```json
{
  "status": "ok",
  "timestamp": "2026-01-09T10:00:00.000Z"
}
```

---

### 2. Mock Login

Get an authentication token for a user.

**Request:**
```bash
curl -X POST http://localhost:3000/auth/mock-login \
  -H "Content-Type: application/json" \
  -d '{"userId": "alice"}'
```

**Response: 200 OK**
```json
{
  "token": "fake_a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Validation:**
- `userId` is required and must be a non-empty string

---

### 3. Create Note

Create a new note (requires authentication).

**Request:**
```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Shopping list",
    "body": "Milk, eggs, bread"
  }'
```

**Response: 201 Created**
```json
{
  "id": "note_a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "userId": "alice",
  "title": "Shopping list",
  "body": "Milk, eggs, bread",
  "createdAt": "2026-01-09T10:00:00.000Z"
}
```

**Validation:**
- `title`: required, non-empty after trim, max 80 characters
- `body`: optional, max 500 characters

**Error Examples:**
```bash
# Missing title
{"error": "Title is required"}

# Title too long
{"error": "Title must not exceed 80 characters"}

# Body too long
{"error": "Body must not exceed 500 characters"}
```

---

### 4. List Notes

Get all notes for the authenticated user (newest first).

**Request:**
```bash
curl http://localhost:3000/notes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response: 200 OK**
```json
[
  {
    "id": "note_xyz789",
    "userId": "alice",
    "title": "Shopping list",
    "body": "Milk, eggs, bread",
    "createdAt": "2026-01-09T10:05:00.000Z"
  },
  {
    "id": "note_abc123",
    "userId": "alice",
    "title": "Meeting notes",
    "body": "Discuss Q1 goals",
    "createdAt": "2026-01-09T10:00:00.000Z"
  }
]
```

---

### 5. Update Note

Partially update a note (requires authentication and ownership).

**Request:**
```bash
curl -X PATCH http://localhost:3000/notes/note_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Updated Meeting Notes",
    "body": "Discuss Q1 goals and budget"
  }'
```

**Response: 200 OK**
```json
{
  "id": "note_abc123",
  "userId": "alice",
  "title": "Updated Meeting Notes",
  "body": "Discuss Q1 goals and budget",
  "createdAt": "2026-01-09T10:00:00.000Z",
  "updatedAt": "2026-01-09T10:30:00.000Z"
}
```

**Validation:**
- At least one field (`title` or `body`) must be provided
- Same validation rules as create

**Error Examples:**
```bash
# No fields provided
{"error": "No updatable fields provided"}

# Note not found
{"error": "Note not found"}

# Not the owner
{"error": "You do not have permission to update this note"}
```

---

### 6. Delete Note

Delete a note (requires authentication and ownership).

**Request:**
```bash
curl -X DELETE http://localhost:3000/notes/note_abc123 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response: 204 No Content**
(Empty response body)

**Error Examples:**
```bash
# Note not found - 404
{"error": "Note not found"}

# Not the owner - 403
{"error": "You do not have permission to delete this note"}
```

---

## 🔐 Authentication & Authorization

All note endpoints require authentication via Bearer token:

```
Authorization: Bearer <token>
```

**HTTP Status Codes:**
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Valid token but trying to access another user's note
- `404 Not Found`: Note doesn't exist

## 🧪 Testing Multiple Users

```bash
# User 1: Alice
curl -X POST http://localhost:3000/auth/mock-login \
  -H "Content-Type: application/json" \
  -d '{"userId": "alice"}'
# Save alice's token

# User 2: Bob
curl -X POST http://localhost:3000/auth/mock-login \
  -H "Content-Type: application/json" \
  -d '{"userId": "bob"}'
# Save bob's token

# Alice creates a note
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ALICE_TOKEN" \
  -d '{"title": "Alice note", "body": "Private"}'

# Bob tries to access Alice's note (will get 403)
curl -X PATCH http://localhost:3000/notes/ALICE_NOTE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer BOB_TOKEN" \
  -d '{"title": "Hacked"}'
```

## 📝 Example Workflow

```bash
# 1. Health check
curl http://localhost:3000/health

# 2. Login as user
TOKEN=$(curl -s -X POST http://localhost:3000/auth/mock-login \
  -H "Content-Type: application/json" \
  -d '{"userId": "alice"}' | jq -r '.token')

# 3. Create a note
NOTE_ID=$(curl -s -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "My first note", "body": "Hello world"}' | jq -r '.id')

# 4. List all notes
curl http://localhost:3000/notes \
  -H "Authorization: Bearer $TOKEN"

# 5. Update the note
curl -X PATCH http://localhost:3000/notes/$NOTE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"body": "Updated content"}'

# 6. Delete the note
curl -X DELETE http://localhost:3000/notes/$NOTE_ID \
  -H "Authorization: Bearer $TOKEN"
```

## 🎨 Extra Feature: Logging

All requests are logged with:
- Timestamp
- HTTP method
- Path
- Status code
- Response time

Example output:
```
[2026-01-09T10:00:00.000Z] POST /auth/mock-login 200 - 5ms
[2026-01-09T10:00:05.000Z] POST /notes 201 - 3ms
[2026-01-09T10:00:10.000Z] GET /notes 200 - 2ms
[2026-01-09T10:00:15.000Z] PATCH /notes/note_abc123 200 - 4ms
[2026-01-09T10:00:20.000Z] DELETE /notes/note_abc123 204 - 2ms
```

## ✨ What I'd Improve with More Time

1. **Persistence**: Use SQLite or PostgreSQL instead of in-memory storage
2. **Real JWT**: Implement proper JWT tokens with expiration and refresh tokens
3. **Rate Limiting**: Add per-user rate limiting (e.g., 10 requests/min on POST /notes)
4. **Comprehensive Testing**: Unit tests for services, integration tests for endpoints
5. **Pagination**: Add pagination to GET /notes for large note collections
6. **Search**: Add full-text search capabilities across note titles and bodies
7. **Tags/Categories**: Allow users to organize notes with tags
8. **Soft Delete**: Keep deleted notes in DB with deletedAt timestamp
9. **API Documentation**: Generate OpenAPI/Swagger docs
10. **Error Handling**: More granular error types and better error messages
11. **Input Sanitization**: XSS protection for note content
12. **CORS Configuration**: Proper CORS setup for frontend integration

## 📄 License

MIT

# Quick-Notes
