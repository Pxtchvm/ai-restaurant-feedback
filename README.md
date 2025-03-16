# crAIvings - AI-Powered Restaurant Feedback Analysis

crAIvings is a web application that leverages artificial intelligence to analyze restaurant reviews, providing actionable insights to restaurant owners and helping diners make informed decisions.

## Features

- **Intelligent Review Analysis**: AI-powered sentiment analysis breaks down reviews by food quality, service, ambiance, and value
- **Restaurant Discovery**: Find restaurants with advanced filtering and sorting options
- **User Reviews**: Share your dining experiences with detailed ratings and feedback
- **Restaurant Owner Dashboard**: Get actionable insights from customer feedback (for restaurant owners)
- **Responsive Design**: Optimized for both desktop and mobile experiences

## Tech Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose ODM
- JSON Web Token (JWT) authentication
- Natural language processing for sentiment analysis

### Frontend
- React with functional components and hooks
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/craivings.git
   cd craivings
   ```

2. Install dependencies
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. Set up environment variables
   - Create a `.env` file in the root directory (see `.env.example` for required variables)

4. Run the development servers
   ```bash
   # Run backend and frontend concurrently
   npm run dev
   ```

## Project Structure

```
craivings/
├── client/                 # React frontend
│   ├── public/             # Static files
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── contexts/       # React contexts for state management
│       ├── hooks/          # Custom React hooks
│       ├── pages/          # Page components
│       ├── services/       # API service integrations
│       └── utils/          # Helper utilities
├── server/                 # Express backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── services/           # Business logic services
│   └── utils/              # Helper utilities
└── .env                    # Environment variables (create from .env.example)
```

## API Documentation

Documentation for API endpoints can be found in the [API_DOCS.md](./API_DOCS.md) file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.