# EcoFinds 🌱

A full-stack sustainable second-hand marketplace built with React and Node.js, featuring ReactBits design patterns and modern UI components.

## ✨ Features

### Frontend
- 🌿 **Eco-Friendly Design**: Beautiful green-themed UI with sustainability focus
- 🎨 **ReactBits Components**: Modern UI components inspired by ReactBits.dev
- ✨ **Smooth Animations**: Framer Motion powered interactions and transitions
- 📱 **Responsive Design**: Mobile-first approach with perfect responsiveness
- 🎭 **Glassmorphism Effects**: Modern glass-like UI elements and backdrop blur
- 🎯 **Interactive Elements**: Hover effects, micro-interactions, and smooth transitions
- 🛒 **Shopping Cart**: Real-time cart management with persistent state
- 👤 **User Authentication**: Secure login/register with JWT tokens

### Backend
- 🚀 **Node.js & Express**: Fast, scalable backend API
- 🗄️ **SQLite Database**: Lightweight, file-based database for development
- 🔐 **JWT Authentication**: Secure user authentication and authorization
- 📊 **RESTful API**: Clean, well-structured API endpoints
- 🛡️ **Data Validation**: Input validation and error handling
- 🔄 **Real-time Updates**: Live cart and product updates

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Framework with hooks
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **Lucide React** - Beautiful, customizable icons
- **ReactBits Patterns** - Modern design system inspiration

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite3** - Embedded database
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd EcoFinds
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
cd ..
```

4. Initialize the database
```bash
cd backend
node database/init.js
node scripts/seed-data.js
cd ..
```

5. Start the full-stack application
```bash
# Option 1: Start both frontend and backend
npm run dev:full

# Option 2: Start them separately
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:backend
```

6. Open your browser and visit:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3001`

## 📁 Project Structure

```
EcoFinds/
├── src/                    # Frontend React application
│   ├── components/
│   │   ├── ui/            # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ...
│   │   └── layout/        # Layout components
│   │       ├── Header.jsx
│   │       └── Footer.jsx
│   ├── pages/             # Page components
│   │   ├── Hero.jsx
│   │   ├── FeaturedProducts.jsx
│   │   ├── Categories.jsx
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useProducts.js
│   │   └── useCart.js
│   ├── services/          # API services
│   │   └── api.js
│   └── lib/               # Utility functions
│       └── utils.js
├── backend/               # Backend Node.js application
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   └── categories.js
│   ├── models/           # Database models
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Cart.js
│   ├── database/         # Database files
│   │   ├── schema.sql
│   │   └── init.js
│   ├── scripts/          # Utility scripts
│   │   └── seed-data.js
│   └── server.js         # Main server file
└── README.md
```

## 🎨 Design System

The project uses a comprehensive design system inspired by ReactBits with:

- **Color Palette**: Eco-friendly greens and earth tones
- **Typography**: Inter font family with proper hierarchy
- **Spacing**: Consistent spacing scale using Tailwind
- **Components**: Reusable, accessible components
- **Animations**: Smooth, purposeful animations with Framer Motion
- **Glassmorphism**: Modern glass-like effects and backdrop blur
- **Gradients**: Subtle eco-themed gradients throughout

## 🗄️ Database Schema

### Tables
- **users** - User accounts and profiles
- **categories** - Product categories
- **products** - Marketplace products
- **cart** - Shopping cart items
- **purchases** - Order history
- **reviews** - Product reviews
- **favorites** - User favorites

### Key Features
- Foreign key relationships
- Data validation constraints
- Timestamps for tracking
- JSON storage for flexible data

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (auth required)
- `PUT /api/products/:id` - Update product (auth required)
- `DELETE /api/products/:id` - Delete product (auth required)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item quantity
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `GET /api/categories/:id/products` - Get products by category

## 📱 Available Scripts

### Frontend
- `npm run dev` - Start frontend development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev:backend` - Start backend development server
- `npm run dev:full` - Start both frontend and backend

### Database
- `cd backend && node database/init.js` - Initialize database
- `cd backend && node scripts/seed-data.js` - Seed sample data

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

### Database
The SQLite database file is created automatically at `backend/database.sqlite`. The database includes sample data for testing.

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service

### Backend (Railway/Heroku)
1. Set environment variables
2. Deploy the `backend` folder
3. Update API URLs in frontend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [ReactBits.dev](https://reactbits.dev) for design inspiration
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide](https://lucide.dev) for beautiful icons
