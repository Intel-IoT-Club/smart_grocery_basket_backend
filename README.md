# Smart Grocery Basket - Backend

RESTful API service for a barcode scanning grocery application built with Node.js and Express.js.

## Technology Stack
- **Runtime**: Node.js (≥16.0.0)
- **Framework**: Express.js 4.21.2
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet.js, CORS, Rate Limiting
- **Development**: Nodemon for auto-reload

## Features
- Product management API
- Barcode scanning integration
- Input validation and sanitization
- Security middleware
- Database seeding

## Project Structure
```
smart_grocery_basket_backend/
├── config/
│   ├── database.js          # Database connection
│   └── index.js             # App configuration
├── middleware/
│   └── index.js             # Security & validation middleware
├── models/
│   └── Product.js           # Product schema
├── routes/
│   └── productRoutes.js     # API endpoints
├── index.js                 # Server entry point
├── seed.js                  # Database seeding
└── package.json
```

## API Endpoints

### Health Check
```
GET /health
```

### Products
```
GET /api/products           # Get all products (with pagination)
GET /api/products/:id       # Get product by ID
POST /api/products          # Create product
PUT /api/products/:id       # Update product
DELETE /api/products/:id    # Delete product
```

### Response Format
```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "error": string
}
```

## Database Schema

### Product Model
```javascript
{
  productId: String,        // Unique identifier
  name: String,             // Product name
  mrpPrice: Number,         // Price
  image: String,            // Image URL
  stock: Number,            // Stock count
  category: String,         // Product category
  discounts: String,        // Discount info
  expiryDate: String,       // Expiry date (YYYY-MM-DD)
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables
```bash
MONGO_URI="mongodb://localhost:27017/smart_grocery_basket"
PORT="5001"
NODE_ENV="development"
```

## Development Setup

### Prerequisites
- Node.js ≥16.0.0
- MongoDB ≥4.4

### Installation
```bash
# Clone repository
git clone https://github.com/Intel-IoT-Club/smart_grocery_backend.git
cd smart_grocery_backend

# Install dependencies
npm install

# Copy environment template
cp .env.sample .env
# Edit .env with your MongoDB URI

# Seed database
npm run seed

# Start development server
npm run dev
```

### Scripts
```bash
npm start       # Production server
npm run dev     # Development server
npm run seed    # Seed database
```

## License
MIT License
