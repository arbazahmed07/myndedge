# MyndEdge

MyndEdge is a full-stack web application built with the MERN stack (MongoDB, Express.js, React, and Node.js).

## Project Overview

MyndEdge provides a modern web application architecture with a separate client and server structure. The client is built with React using Vite as the build tool and incorporates the Shadcn UI component system, while the server is a Node.js Express API connected to a MongoDB database.

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Shadcn UI components (Radix UI-based)
- React Router for navigation
- React Query for data fetching
- React Hook Form for form handling
- Zod for form validation
- Axios for HTTP requests

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt.js for password hashing
- dotenv for environment variable management
- CORS for cross-origin resource sharing

## Project Structure

```
MyndEdge/
├── client/               # React frontend
│   ├── public/           # Static assets
│   ├── src/              # Source code
│   ├── package.json      # Frontend dependencies
│   └── vite.config.js    # Vite configuration
│
└── server/               # Node.js backend
    ├── controllers/      # Request handlers
    ├── models/           # Database models
    ├── routes/           # API endpoints
    ├── middleware/       # Express middleware
    ├── .env              # Environment variables
    ├── server.js         # Main entry point
    └── package.json      # Backend dependencies
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- MongoDB Atlas account or local MongoDB installation
- Git

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd MyndEdge
   ```

2. Set up the server
   ```bash
   cd server
   npm install
   ```

3. Set up the client
   ```bash
   cd ../client
   npm install
   ```

4. Configure environment variables
   - Create or modify `.env` file in the server directory with your MongoDB connection string and JWT secret

### Running the Application

1. Start the backend server
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend development server
   ```bash
   cd client
   npm run dev
   ```

## Environment Configuration

### Server Environment Variables (.env)
- `PORT`: The port on which the server runs (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation and verification

**Important:** The provided MongoDB connection string in the `.env` file contains credentials. This is for development purposes only. In a production environment:
- Use environment variables specific to your deployment platform
- Never commit credentials to version control
- Consider using a service like Azure Key Vault for secure credential management

## Development Workflow

1. Run both client and server in development mode
2. The client development server includes hot-reloading
3. The server uses nodemon for automatic restarts when code changes

### Building for Production

#### Frontend
```bash
cd client
npm run build
```

#### Backend
```bash
cd server
npm start
```

## Trade-offs and Considerations

### Architecture Decisions
- **Separate Client/Server**: Allows independent development and deployment but requires CORS configuration
- **MongoDB**: Offers flexibility for schema evolution but may not be ideal for complex relationships
- **JWT Authentication**: Simple to implement but requires careful handling of token security and expiration
- **React + Vite**: Fast development experience but adds complexity in build tooling

### UI Component Strategy
The project uses Shadcn UI, which:
- Provides accessible, customizable components
- Is built on Radix UI primitives
- Uses utility classes for styling (TailwindCSS)
- Gives you full control over your components as they are copied into your project

### Performance Considerations
- React Query is used for data fetching, caching, and state management
- Vite provides efficient bundling and fast HMR
- Image optimization should be implemented for production

## Future Improvements

- Implement CI/CD pipelines
- Add comprehensive test suite
- Consider server-side rendering for improved SEO
- Implement monitoring and error tracking
- Enhance security with refresh tokens
- Add rate limiting to API endpoints
- Consider containerization with Docker

## License

ISC
