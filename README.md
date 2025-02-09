# 🎵 Musical Instrument Store

This repository contains a **Musical Instrument Store** web application that allows users to browse, review, and purchase musical instruments. The application is divided into two main parts:

- **Frontend**: Built with React and Vite.
- **Backend**: Developed using Node.js, Express, and MySQL.

---

## 📌 Implemented Features

### 🛍️ Guest Users (Minimal Role: Guest)
1. Browse the list of musical instruments.
2. View detailed information about individual instruments.
3. View comments on musical instruments.
4. Log in.
5. Register an account.
6. Change the application language (English or Ukrainian).

### 👤 Registered Users (Minimal Role: User)
7. Add, edit, and delete their own comments.
8. Add, view, and remove instruments from their cart.
9. Edit and view their profile.

### 🔧 Admin Users (Minimal Role: Administrator)
10. Add, edit, and delete musical instruments.
11. Add and edit categories for musical instruments.

---

## 🚀 Setup Guide
### Prerequisites
Ensure you have the following installed before proceeding:
- **Node.js** (Latest LTS version recommended)
- **MySQL** (Database setup required)
- **Git** (For cloning the repository)

### 🛠 Steps to Run the Application
1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/musical-instrument-store.git
   cd musical-instrument-store
   ```
2. **Set up the backend** (Instructions in `backend/README.md`).
3. **Set up the frontend** (Instructions in `frontend/README.md`).
4. **Configure MySQL database** using provided SQL scripts.
5. **Set up environment variables** for backend configuration:
   - Configure `config/database.js` for MySQL connection.
   - Set up `.env` file with JWT secret and Azure Blob Storage credentials.
6. **Run the application** 🚀
   - Start the backend server.
   - Start the frontend server.
   - Open the application in your browser.

---

## 📂 Project Structure
```
/musical-instrument-store
│── music_store_backend/            # Node.js Express backend
│── music_store_frontend/           # React frontend with Vite
│── sql.txt             # SQL script for database setup
│── .gitignore          # Ignored files
│── README.md           # General project README
```

For more details on individual components, check the `backend/README.md` and `frontend/README.md`.

---

## 📄 License
This project is licensed under the MIT License.

