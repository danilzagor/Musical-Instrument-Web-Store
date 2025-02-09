# Backend - Musical Instruments Store

## Overview
The backend of the Musical Instruments Store is a robust, scalable, and secure API built using modern web technologies. It serves as the backbone of the application, handling authentication, data processing, and business logic. Designed with security and efficiency in mind, it ensures seamless interactions between the frontend and the database.

## Technologies Used
- **Node.js & Express** - A powerful JavaScript runtime and framework for building scalable backend applications.
- **MySQL** - A relational database for structured and efficient data storage.
- **JWT (JSON Web Token)** - Secure authentication and authorization mechanism.
- **Azure Blob Storage** - Cloud-based storage for efficiently managing instrument images.

## Implemented Features
### Authentication & Security
- JWT-based authentication** for secure API access.
- Role-based authorization (**Admin, User, Guest**) for different levels of access.
- Password hashing and secure authentication practices.

### API Endpoints
#### **Authentication Routes**
- `POST /auth/login` - User login with JWT authentication.
- `POST /auth/register` - User registration.
- `POST /auth/logout` - Secure logout.
- `GET /auth/verify` - Verify the validity of a token.

#### **User Routes**
- `GET /users/:id` - Retrieve user profile.
- `PUT /users/:id` - Edit user profile.

#### **Cart Routes**
- `POST /cart/:musicInstrumentId` - Add an instrument to the cart.
- `GET /cart/:musicInstrumentId` - Get a specific instrument from the cart.
- `GET /cart/` - Retrieve all items in the cart.
- `DELETE /cart/` - Clear the entire cart.
- `DELETE /cart/:musicInstrumentId` - Remove an instrument from the cart.

#### **Instrument Routes**
Each instrument type has a dedicated endpoint to ensure modularity and maintainability:
- **Drums**
  - `GET /drums/` - Retrieve all drums.
  - `GET /drums/:id` - Get drum details.
  - `POST /drums/` - Add a new drum (Admin only).
  - `PUT /drums/:id` - Edit drum details (Admin only).
  - `DELETE /drums/:id` - Remove a drum (Admin only).
- **Guitars**
  - `GET /guitars/` - Retrieve all guitars.
  - `GET /guitars/:id` - Get guitar details.
  - `POST /guitars/` - Add a new guitar (Admin only).
  - `PUT /guitars/:id` - Edit guitar details (Admin only).
  - `DELETE /guitars/:id` - Remove a guitar (Admin only).
- **Pianos**
  - `GET /pianos/` - Retrieve all pianos.
  - `GET /pianos/:id` - Get piano details.
  - `POST /pianos/` - Add a new piano (Admin only).
  - `PUT /pianos/:id` - Edit piano details (Admin only).
  - `DELETE /pianos/:id` - Remove a piano (Admin only).

#### **Review Routes**
- `GET /reviews/:musicInstrumentId` - Retrieve all reviews for a specific instrument.
- `POST /reviews/:musicInstrumentId` - Add a review (User only).
- `PUT /reviews/:musicInstrumentId` - Edit a review (User only).
- `DELETE /reviews/:musicInstrumentId` - Remove a review (User only).

## Azure Blob Storage
The backend integrates **Azure Blob Storage** for efficient and scalable image storage. When an admin uploads an instrument image, it is securely stored in the Azure cloud, ensuring reliability and performance. Each image is linked to the corresponding instrument in the database for easy retrieval.

## Installation & Setup
### Prerequisites
- **Node.js (v18 or later)**
- **MySQL Database**
- **Azure Blob Storage Account**

### Steps to Run
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/musical-instruments-store.git
   cd musical-instruments-store/backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure the environment variables in a `.env` file:
   ```env
   DB_HOST=your-database-host
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DB_NAME=your-database-name
   JWT_SECRET=your-jwt-secret
   AZURE_STORAGE_ACCOUNT=your-azure-account
   AZURE_STORAGE_KEY=your-azure-key
   AZURE_CONTAINER_NAME=your-container-name
   ```
4. Run the sql scripts:

5. Start the backend server:
   ```sh
   npm start
   ```
6. The backend will be available at `http://localhost:5000/api`.

## Folder Structure
```
backend/
│── controllers/    # API logic for different resources
│── routes/         # Route definitions
│── services/       # Security, utility, and controller services (e.g., JWT, Azure Storage, controller logic)
│── config/         # Configuration files (DB, Azure, etc.)
│── app.js          # Main application entry point
│── .env            # Environment variables
│── package.json    # Dependencies and scripts
```

## Code Quality & Best Practices
- **Modular Structure:** Routes, controllers, and services are separated for maintainability.
- **Secure Authentication:** JWT ensures user identity protection.
- **Cloud Storage:** Azure Blob Storage optimizes image management.
- **Error Handling:** Proper validation and exception handling mechanisms.

## License
This project is licensed under the MIT License.

