# GigFlow API Documentation

**Base URL:** `https://gigflow-leads-dashboard-dtul.onrender.com/api`  
**Local URL:** `http://localhost:5000/api`  
**Auth:** Bearer token via `Authorization: Bearer <token>` header (required on all `/leads` routes)

---

## Health Check

### `GET /health`

Check if the API is running.

**Auth required:** No

**Response `200`**
```json
{
  "status": "ok",
  "message": "GigFlow API running"
}
```

---

## Auth

### `POST /auth/register`

Register a new user.

**Auth required:** No

**Request Body**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "sales"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | Yes | |
| `email` | string | Yes | Must be unique |
| `password` | string | Yes | Min 6 characters |
| `role` | string | No | `admin` or `sales` (default: `sales`) |

**Response `201`**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "sales"
  }
}
```

**Response `400`** — Missing fields or email already exists
```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

### `POST /auth/login`

Login with existing credentials.

**Auth required:** No

**Request Body**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response `200`**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "sales"
  }
}
```

**Response `401`** — Invalid credentials
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### `GET /auth/me`

Get the currently authenticated user.

**Auth required:** Yes

**Response `200`**
```json
{
  "success": true,
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "sales",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Leads

All lead routes require a valid JWT token in the `Authorization` header.

---

### `GET /leads`

Get a paginated list of leads with optional filters.

**Auth required:** Yes (any role)

**Query Parameters**

| Param | Type | Default | Notes |
|-------|------|---------|-------|
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Records per page |
| `status` | string | — | `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | string | — | `Website`, `Instagram`, `Referral` |
| `search` | string | — | Searches name and email (case-insensitive) |
| `sort` | string | `latest` | `latest` or `oldest` |

All filters can be combined. Example:
```
GET /leads?status=Qualified&source=Instagram&search=rahul&sort=latest&page=1
```

**Response `200`**
```json
{
  "success": true,
  "leads": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "status": "Qualified",
      "source": "Instagram",
      "createdBy": "64f1a2b3c4d5e6f7a8b9c0d1",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### `POST /leads`

Create a new lead.

**Auth required:** Yes (any role)

**Request Body**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Instagram"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | Yes | |
| `email` | string | Yes | |
| `source` | string | Yes | `Website`, `Instagram`, `Referral` |
| `status` | string | No | `New`, `Contacted`, `Qualified`, `Lost` (default: `New`) |

**Response `201`**
```json
{
  "success": true,
  "lead": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "status": "New",
    "source": "Instagram",
    "createdBy": "64f1a2b3c4d5e6f7a8b9c0d1",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response `400`** — Missing required fields
```json
{
  "success": false,
  "message": "Name, email and source are required"
}
```

---

### `GET /leads/:id`

Get a single lead by ID.

**Auth required:** Yes (any role)

**Response `200`**
```json
{
  "success": true,
  "lead": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "status": "Qualified",
    "source": "Instagram",
    "createdBy": "64f1a2b3c4d5e6f7a8b9c0d1",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T08:00:00.000Z"
  }
}
```

**Response `404`**
```json
{
  "success": false,
  "message": "Lead not found"
}
```

---

### `PUT /leads/:id`

Update a lead by ID.

**Auth required:** Yes (any role)

**Request Body** — Send only the fields you want to update
```json
{
  "status": "Qualified"
}
```

**Response `200`**
```json
{
  "success": true,
  "lead": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "status": "Qualified",
    "source": "Instagram",
    "createdBy": "64f1a2b3c4d5e6f7a8b9c0d1",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T08:00:00.000Z"
  }
}
```

**Response `404`**
```json
{
  "success": false,
  "message": "Lead not found"
}
```

---

### `DELETE /leads/:id`

Delete a lead by ID.

**Auth required:** Yes — **Admin only**

**Response `200`**
```json
{
  "success": true,
  "message": "Lead deleted"
}
```

**Response `403`** — Non-admin user
```json
{
  "success": false,
  "message": "Admin access required"
}
```

**Response `404`**
```json
{
  "success": false,
  "message": "Lead not found"
}
```

---

### `GET /leads/stats`

Get lead counts by status.

**Auth required:** Yes (any role)

**Response `200`**
```json
{
  "success": true,
  "stats": {
    "total": 42,
    "new": 15,
    "qualified": 18,
    "lost": 9
  }
}
```

---

### `GET /leads/export`

Export leads as a CSV file. Supports the same filters as `GET /leads` (no pagination — exports all matching records).

**Auth required:** Yes (any role)

**Query Parameters**

| Param | Type | Notes |
|-------|------|-------|
| `status` | string | Filter by status |
| `source` | string | Filter by source |
| `search` | string | Search by name or email |

**Response `200`** — `Content-Type: text/csv`
```
Name,Email,Status,Source,Created At
Rahul Sharma,rahul@example.com,Qualified,Instagram,2024-01-15T10:30:00.000Z
...
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

| Status Code | Meaning |
|-------------|---------|
| `400` | Bad request — missing or invalid fields |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — insufficient role permissions |
| `404` | Resource not found |
| `500` | Internal server error |

---

## Roles

| Role | Permissions |
|------|-------------|
| `admin` | Create, read, update, delete leads |
| `sales` | Create, read, update leads (no delete) |
