# EcoFinds API Endpoints Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "bio": "string (optional)",
  "location": "string (optional)"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": { ... },
  "token": "jwt_token"
}
```

### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "token": "jwt_token"
}
```

### GET /api/auth/me
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "user": { ... }
}
```

### PUT /api/auth/profile
Update user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "bio": "string (optional)",
  "location": "string (optional)"
}
```

## Product Endpoints

### GET /api/products
Get all products with filtering and search.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `category` (number): Filter by category ID
- `search` (string): Search in title and description
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `condition` (string): Filter by condition (excellent, good, fair, poor)
- `isEcoFriendly` (boolean): Filter by eco-friendly status

**Response:**
```json
{
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50
  }
}
```

### GET /api/products/featured
Get featured products.

**Query Parameters:**
- `limit` (number): Number of products (default: 8)

**Response:**
```json
{
  "products": [...]
}
```

### GET /api/products/:id
Get single product details.

**Response:**
```json
{
  "product": { ... }
}
```

### POST /api/products
Create new product listing (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "price": "number",
  "originalPrice": "number (optional)",
  "condition": "string (excellent|good|fair|poor)",
  "categoryId": "number",
  "imageUrls": ["string"],
  "isEcoFriendly": "boolean (default: true)"
}
```

### PUT /api/products/:id
Update product (requires authentication, owner only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "price": "number (optional)",
  "condition": "string (optional)",
  "imageUrls": ["string"] (optional)
}
```

### DELETE /api/products/:id
Delete product (requires authentication, owner only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### GET /api/products/user/:userId
Get user's products.

**Response:**
```json
{
  "products": [...]
}
```

### PATCH /api/products/:id/sold
Mark product as sold (requires authentication, owner only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

## Cart Endpoints

### GET /api/cart
Get user's cart items (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "cartItems": [...]
}
```

### POST /api/cart
Add product to cart (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "productId": "number",
  "quantity": "number"
}
```

### PUT /api/cart/:productId
Update cart item quantity (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "quantity": "number"
}
```

### DELETE /api/cart/:productId
Remove item from cart (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### DELETE /api/cart
Clear entire cart (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### GET /api/cart/count
Get cart item count (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "count": 5
}
```

### GET /api/cart/total
Get cart total amount (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "total": 150.50
}
```

## Category Endpoints

### GET /api/categories
Get all categories.

**Response:**
```json
{
  "categories": [...]
}
```

### GET /api/categories/:id
Get category by ID.

**Response:**
```json
{
  "category": { ... }
}
```

### GET /api/categories/:id/products
Get products by category.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)

**Response:**
```json
{
  "products": [...],
  "pagination": { ... }
}
```

## Purchase Endpoints

### POST /api/purchases
Complete purchase (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "number",
      "quantity": "number"
    }
  ],
  "shippingAddress": "string",
  "paymentMethod": "string"
}
```

**Response:**
```json
{
  "message": "Purchase completed successfully",
  "purchases": [...]
}
```

### GET /api/purchases
Get user's purchase history (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "purchases": [...]
}
```

### GET /api/purchases/sales
Get user's sales history (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "sales": [...]
}
```

### PATCH /api/purchases/:id/status
Update purchase status (requires authentication, seller only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "status": "string (pending|confirmed|shipped|delivered|cancelled)"
}
```

## Health Check

### GET /api/health
Check API health status.

**Response:**
```json
{
  "status": "OK",
  "message": "EcoFinds API is running",
  "timestamp": "2025-09-06T06:52:33.813Z"
}
```

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "message": "Error description",
  "errors": [...] // For validation errors
}
```

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained through the `/api/auth/login` or `/api/auth/register` endpoints and are valid for 7 days.
