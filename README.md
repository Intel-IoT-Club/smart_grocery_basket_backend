# Smart Grocery Basket - Backend API

A production-ready RESTful API service for barcode scanning grocery management built with Node.js, Express.js, and MongoDB. Designed to handle product inventory, barcode scanning integration, and real-time shopping basket functionality.

## Architecture Overview

This backend service follows a modular MVC architecture pattern with separation of concerns across configuration, middleware, models, and routes. The system is designed for scalability with comprehensive error handling, input validation, and security measures.

## Technical Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Runtime** | Node.js | ≥16.0.0 | Server-side JavaScript execution |
| **Framework** | Express.js | 4.21.2 | Web application framework |
| **Database** | MongoDB | ≥4.4 | Document-oriented NoSQL database |
| **ODM** | Mongoose | 8.12.1 | MongoDB object modeling |
| **Validation** | Express Validator | 7.2.0 | Request validation and sanitization |
| **Security** | Helmet.js | 8.0.0 | HTTP security headers |
| **Logging** | Winston | 3.15.0 | Application logging |
| **CORS** | CORS | 2.8.5 | Cross-origin resource sharing |
| **Rate Limiting** | Express Rate Limit | 7.4.1 | Request rate limiting |
| **Development** | Nodemon | 3.1.9 | Auto-reload for development |

## System Architecture

### Core Components

#### 1. Configuration Layer (`/config`)
- **Database Configuration**: Connection management, connection pooling, error handling, and graceful shutdown
- **Application Configuration**: Environment-based settings, CORS origins, API versioning, and business constants

#### 2. Middleware Layer (`/middleware`)
- **Security Middleware**: Request sanitization, rate limiting, and input validation
- **Error Handling**: Centralized error processing with environment-aware error responses
- **Logging Middleware**: Request/response logging with timing metrics

#### 3. Data Layer (`/models`)
- **Product Schema**: Comprehensive product model with validation, indexing, and virtual fields
- **Schema Features**: Automatic timestamps, text search indexing, and data transformation

#### 4. API Layer (`/routes`)
- **Product Routes**: Full CRUD operations with advanced filtering, pagination, and search
- **Error Handling**: Route-specific error handling with detailed validation feedback

### Database Design

#### Product Schema Structure
```javascript
{
  productId: {
    type: String,
    required: true,
    unique: true,
    indexed: true
  },
  name: {
    type: String,
    required: true,
    maxLength: 200,
    indexed: "text"
  },
  mrpPrice: {
    type: Number,
    required: true,
    min: 0,
    validated: true
  },
  image: {
    type: String,
    default: "placeholder_url"
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  category: {
    type: String,
    enum: ['Dairy', 'Fruits', 'Vegetables', 'Grocery', 'Bakery', 'Beverages', 'Snacks', 'Other'],
    default: 'Other'
  },
  discounts: {
    type: String,
    default: ""
  },
  expiryDate: {
    type: String,
    validated: "YYYY-MM-DD format"
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Virtual Fields
- `formattedPrice`: Currency formatted price display
- `isInStock`: Boolean stock availability status
- `isExpired`: Boolean expiration status check

## API Specification

### Base URL
- **Development**: `http://localhost:5001`
- **Production**: Configured via environment variables

### Authentication
Currently implements public API access. Authentication middleware ready for implementation.

### Endpoints

#### Health Check
```http
GET /health
```
**Response**: System health status, timestamp, service information

#### Product Management

##### List Products
```http
GET /api/products?category={category}&inStock={boolean}&page={number}&limit={number}&search={query}
```
**Features**: 
- Category filtering
- Stock availability filtering
- Full-text search across name and category
- Pagination with metadata
- Sort by creation date (newest first)

##### Get Single Product
```http
GET /api/products/{productId}
```
**Response**: Complete product information with virtual fields

##### Create Product
```http
POST /api/products
Content-Type: application/json

{
  "productId": "P001",
  "name": "Product Name",
  "mrpPrice": 99.99,
  "stock": 50,
  "category": "Grocery",
  "image": "image_url",
  "discounts": "10% off",
  "expiryDate": "2025-12-31"
}
```

##### Update Product
```http
PUT /api/products/{productId}
Content-Type: application/json
```
**Features**: Partial updates, validation, duplicate prevention

##### Delete Product
```http
DELETE /api/products/{productId}
```
**Features**: Soft delete ready, validation

### Response Format
```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "error": string,
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "pages": number
  },
  "timestamp": "ISO_DATE_STRING"
}
```

## Security Implementation

### Security Measures
1. **Input Validation**: Comprehensive validation using Express Validator
2. **Sanitization**: XSS prevention and input sanitization
3. **Rate Limiting**: Request frequency limiting per IP
4. **CORS**: Configurable origin allowlist
5. **Security Headers**: Helmet.js implementation
6. **Error Handling**: Information leakage prevention

### Environment Configuration
```bash
# Database
MONGO_URI=mongodb://localhost:27017/smart_grocery_basket

# Server
PORT=5001
NODE_ENV=development

# Security
FRONTEND_URLS=http://localhost:3000,https://app.domain.com
JSON_LIMIT=10mb
```

## Data Seeding

The application includes a comprehensive seeding system with:
- Sample product data across all categories
- Realistic pricing and stock levels
- Various discount structures
- Error handling and cleanup
- Duplicate prevention

### Seed Data Features
- 8 sample products covering all categories
- Realistic grocery data (Amul Milk, Fresh Apples, etc.)
- Varied pricing from ₹20 to ₹450
- Multiple discount types (percentage, cashback, BOGO)
- Future expiration dates

## Development Workflow

### Setup Process
```bash
# Repository setup
git clone https://github.com/Intel-IoT-Club/smart_grocery_basket_backend.git
cd smart_grocery_basket_backend

# Dependency installation
npm install

# Environment configuration
cp .env.example .env
# Configure MONGO_URI and other variables

# Database initialization
npm run seed

# Development server
npm run dev
```

### Available Scripts
```bash
npm start          # Production server
npm run dev        # Development with auto-reload
npm run seed       # Database seeding
npm run lint       # Code linting
npm run lint:fix   # Auto-fix linting issues
npm run validate   # Run linting and formatting checks
```

## Error Handling Strategy

### Error Types
1. **Validation Errors**: Input validation failures (400)
2. **Authentication Errors**: Auth failures (401)
3. **Authorization Errors**: Permission failures (403)
4. **Not Found Errors**: Resource not found (404)
5. **Duplicate Errors**: Unique constraint violations (409)
6. **Server Errors**: Internal server errors (500)

### Error Response Format
```json
{
  "success": false,
  "error": "Human readable error message",
  "timestamp": "2025-07-20T10:30:00.000Z",
  "details": "Development only - detailed error info"
}
```

## Performance Optimizations

### Database Optimizations
- Strategic indexing on frequently queried fields
- Text search indexing for product names and categories
- Connection pooling with optimal pool size (10 connections)
- Query optimization with field selection

### API Optimizations
- Response compression middleware
- Request size limiting
- Efficient pagination implementation
- Parallel query execution for aggregated data

## Monitoring and Logging

### Logging Implementation
- Winston-based structured logging
- Request/response logging with timing
- Error logging with stack traces
- Database connection status logging
- Graceful shutdown logging

### Health Monitoring
- Database connection status endpoint
- Application health metrics
- Memory usage monitoring ready
- Process signal handling for graceful shutdown

## Deployment Considerations

### Production Readiness
- Environment-specific configuration
- Graceful shutdown handling
- Process signal management (SIGINT, SIGTERM)
- Uncaught exception handling
- Connection cleanup on shutdown

### Scaling Considerations
- Stateless application design
- Database connection pooling
- Rate limiting for DoS protection
- Memory-efficient request processing

## License

MIT License - Open source project by Intel IoT Club
