# Echo-Talk

- Echo-Talk is a platform for real-time communication with a backend powered by Node.js, MongoDB for database management, and a frontend built using ReactJS with TailwindCSS.

---

## Getting Started

- Follow the steps below to set up and run the project locally on your device.

### Prerequisites

- Ensure you have the following installed on your system:

- **Node.js** (LTS version recommended)
- **npm** (comes with Node.js).
- **MongoDB** (installed locally or a connection string for a remote MongoDB instance)
- **Git** (to clone the repository)

### Installation Steps

1. **Clone the Repository**

   ```
   git clone https://github.com/toqaezzatly/Echo-Talk.git
   cd Echo-Talk
   ```

2. **Install Backend Dependencies**
- Navigate to the backend directory and install dependencies:
   ```
   cd backend
   npm install
   ```

3. **Set Up Environment Variables for Backend**

- Copy the .env.example to make a new .env file, with its real values.

4. **Frontend Setup**

- In a new terminal Navigate to the Frontend Directory
   ```
   cd frontend
   ```

5. **Install Frontend Dependencies**

   ```
   npm install
   ```

6. **Accessing the Application**

   ```
   npm start
   ```

- Open your browser and go to http://localhost:3000 to access the Echo-Talk application.
- Ensure that both the backend and frontend servers are running.

---

## Troubleshooting

- MongoDB Issues: Ensure your MongoDB instance is running and accessible.
- Port Conflicts: If ports 5000 or 3000 are already in use, update the PORT variable in the backend .env file and change the frontend .env file accordingly.
