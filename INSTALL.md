# Comprehensive Setup Guide for crAIvings Application

This detailed guide will walk you through setting up the crAIvings restaurant feedback application step-by-step. Each instruction is explained thoroughly to ensure success regardless of your experience level.

## Prerequisites

Before starting, ensure you have the following tools installed on your system:

- **VSCode**: A code editor where you'll work with the application files
  - Download from: [https://code.visualstudio.com/](https://code.visualstudio.com/)
  - Install using default settings

- **Node Version Manager (NVM)**: Helps manage different Node.js versions
  - For Windows: [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases) (download the latest nvm-setup.exe)
  - For Mac/Linux: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`

- **MongoDB Community Server**: The database where application data will be stored
  - Download from: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
  - Install MongoDB Compass during the installation (it's included as an option)

## Step 1: Set Up Node.js Environment

1. **Open a terminal** (Command Prompt, PowerShell, or Terminal app)

2. **Install the latest LTS version of Node.js using NVM**:
   ```bash
   # Check available Node.js versions
   nvm list available

   # Install the latest LTS version (currently 18.x)
   nvm install 18.18.2

   # Set it as the default
   nvm use 18.18.2
   ```

3. **Verify installation**:
   ```bash
   # Should show the installed Node.js version
   node -v

   # Should show the corresponding npm version
   npm -v
   ```

## Step 2: Configure VSCode for Node.js Development

1. **Launch VSCode**

2. **Create a Node.js profile**:
   - Click on the profile icon in the bottom-left corner of VSCode
   - Select "Create Profile..."
   - Choose "Node.js" from the templates
   - Name it "Node.js Development" and click "Create"
   
   This profile comes preconfigured with useful extensions for Node.js development.

3. **Ensure you're using this profile**:
   - Look at the bottom-left corner to confirm "Node.js Development" is shown
   - If not, click the profile icon and select it from the list

## Step 3: Clone and Configure the Repository

1. **Open a terminal** within VSCode:
   - Press `Ctrl+`` (backtick) or use Terminal → New Terminal from the menu

2. **Navigate to your preferred project directory**:
   ```bash
   # Example: Navigate to Documents folder
   cd Documents
   ```

3. **Clone the repository**:
   ```bash
   # Download the code from GitHub
   git clone https://github.com/Pxtchvm/ai-restaurant-feedback
   ```

4. **Open the project folder in VSCode**:
   ```bash
   # Open the folder in VSCode
   code ai-restaurant-feedback
   ```

5. **Switch to the crAIvings branch**:
   ```bash
   # Make sure you're in the project directory
   cd ai-restaurant-feedback
   
   # Switch to the crAIvings branch which contains our application
   git switch crAIvings
   ```

## Step 4: Install Dependencies

1. **Make sure you're in the project root directory** (you should see `package.json` when you list files)

2. **Install all required packages**:
   ```bash
   # This will install both server and client dependencies
   npm run install-all
   ```
   
   This may take a few minutes as it installs all necessary libraries for both the frontend and backend.

3. **Check for any error messages** and resolve them if needed (common issues might be permission-related)

## Step 5: Set Up Environment Variables

1. **Create environment file**:
   ```bash
   # For Windows
   copy .env.example .env
   
   # For Mac/Linux
   cp .env.example .env
   ```

2. **Open the .env file in VSCode** and review the settings:
   - PORT: The port number for the server (default 5000)
   - NODE_ENV: The environment (development or production)
   - MONGODB_URI: The database connection string
   - JWT_SECRET: Secret key for authentication tokens
   
   The default values should work for local development.

## Step 6: Set Up MongoDB Database

1. **Launch MongoDB Compass** (installed with MongoDB Community Server)

2. **Connect to your local MongoDB server**:
   - The default connection string is `mongodb://localhost:27017`
   - Click "Connect" with this default URI

3. **Create a new database**:
   - Click the "+" button next to "Databases"
   - Enter "craivings" as the database name
   - Enter "restaurants" as the initial collection name
   - Click "Create Database"

## Step 7: Seed the Database (Optional but Recommended)

Seeding adds sample data so you can immediately explore the application features.

1. **Navigate to the server directory**:
   ```bash
   # From the project root
   cd server
   ```

2. **Run the seeder script**:
   ```bash
   # This will populate the database with sample restaurants, users, and reviews
   node utils/seeder.js -i
   ```

3. **Check for successful seeding**:
   You should see console output confirming the creation of users, restaurants, and reviews.

4. **View seeded data in MongoDB Compass**:
   - Refresh the database in MongoDB Compass
   - You should now see collections for users, restaurants, and reviews
   - Click on each collection to see the sample data

## Step 8: Run the Application

1. **Return to the project root directory**:
   ```bash
   # If you're in the server directory
   cd ..
   ```

2. **Start the application**:
   ```bash
   npm run dev
   ```
   
   This single command runs both the backend server and frontend development server concurrently.

3. **Wait for both servers to start**:
   - The backend server will show: "Server running on port 5000 in development mode"
   - The frontend development server will show: "Compiled successfully!"

4. **Access the application**:
   - The frontend will automatically open in your default browser at: [http://localhost:3000](http://localhost:3000)
   - If it doesn't open automatically, manually visit the URL

## Step 9: Explore the Application

You can now use the application with the sample data that was seeded. Here are the login credentials for different user types:

1. **Admin User**:
   - Email: admin@craivings.com
   - Password: password123

2. **Restaurant Owner**:
   - Email: owner@craivings.com
   - Password: password123

3. **Regular User**:
   - Email: john@example.com
   - Password: password123

Each role has different permissions and access to features within the application.

## Troubleshooting Common Issues

1. **Port conflicts**:
   - If port 5000 or 3000 is already in use, edit the PORT value in the .env file or the proxy setting in client/package.json

2. **MongoDB connection issues**:
   - Ensure MongoDB service is running (`mongod` process)
   - Check that the connection string in .env matches your MongoDB setup

3. **Node.js version problems**:
   - The application is designed to work with Node.js 14.x or higher
   - If you experience issues, try using `nvm` to switch to Node.js 18.x

4. **NPM package errors**:
   - Try deleting the `node_modules` folders and running `npm run install-all` again
   - For Windows: `rmdir /s /q node_modules client\node_modules`
   - For Mac/Linux: `rm -rf node_modules client/node_modules`

## Stopping the Application

When you're done exploring, press `Ctrl+C` in the terminal where the application is running to stop both the frontend and backend servers.

---

If you encounter any issues not covered in this guide, please check the project repository's issue tracker or documentation for additional help.