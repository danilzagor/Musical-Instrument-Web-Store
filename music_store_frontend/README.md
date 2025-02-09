# Frontend - Musical Instruments Store

## Overview
The frontend of the Musical Instruments Store is a modern, dynamic, and responsive web application built using the latest web technologies. It provides an intuitive user interface for browsing, managing, and purchasing musical instruments. The frontend is designed with a focus on user experience, accessibility, and performance, featuring a **visually appealing and user-friendly design**.

## Technologies Used
- **React** - A powerful JavaScript library for building user interfaces.
- **Vite** - A fast build tool that enhances performance and development experience.
- **React Router** - For seamless client-side routing and navigation.
- **Axios** - For making HTTP requests and handling API communication.
- **CSS Modules** - For styling components in a modular and maintainable way.
- **JWT Authentication** - Ensures secure user login and session management.

## Implemented Features
### Guest Users
- Browse the list of available musical instruments.
- View detailed information about specific instruments.
- Read comments and reviews on musical instruments.
- Register and log into the application.
- Switch between multiple languages for a better user experience.

### Registered Users
- Add, edit, and delete their own comments on instruments.
- Add and remove instruments from their shopping cart.
- View and update their user profile.
- Log out securely.

### Admin Users
- Add, edit, and delete musical instruments.
- Manage instrument categories.

## Installation & Setup
### Prerequisites
- Node.js (v18 or later)
- NPM or Yarn

### Steps to Run
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/musical-instruments-store.git
   cd musical-instruments-store/frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. The application will be available at `http://localhost:5173/`.

## Environment Variables
Create a `.env` file in the root directory and configure necessary environment variables:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Folder Structure
```
frontend/
│── src/
│   ├── components/  # Reusable React components
│   ├── pages/       # Page components
│   ├── utils/       # Utility functions and configurations
│   ├── styles/      # CSS Modules for styling
│   ├── App.jsx      # Main application component
│   ├── main.jsx     # Application entry point
│── public/          # Static assets
│── package.json     # Dependencies and scripts
```

## Code Quality & Best Practices
- **Modular Components:** The project follows a component-based architecture.
- **State Management:** Uses React hooks for managing component states efficiently.
- **Performance Optimization:** Vite ensures a fast build and hot module replacement (HMR).
- **Secure Authentication:** Implements **JWT-based authentication** for a secure and robust login system.
- **Responsive UI:** The interface is designed to be fully responsive across different devices.

## License
This project is licensed under the MIT License.

