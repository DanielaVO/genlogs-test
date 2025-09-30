# 🚚 GenLogs – Truck Carrier Route Analysis  

![React](https://img.shields.io/badge/React-18-blue?logo=react)  
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green?logo=fastapi)  
![MUI](https://img.shields.io/badge/MUI-Design-blue?logo=mui)  
![Google Maps](https://img.shields.io/badge/Google%20Maps-API-red?logo=googlemaps)  
![Docker](https://img.shields.io/badge/Docker-ready-blue?logo=docker)

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **Python**: v3.8 or higher
- **Docker & Docker Compose**: For containerized setup (recommended)

### 🔑 Environment Variables

This project requires a Google Maps API key to function correctly. The key must have the **Maps JavaScript API** and **Places API** enabled.

1.  **Frontend**: Create a `.env` file in the `frontend/` directory:
    ```bash
    # frontend/.env
    REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
    ```

2.  **Docker**: Create a `.env` file in the root directory of the project:
    ```bash
    # ./.env
    REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
    ```

---

## 💻 Installation & Running

### Option 1: Using Docker (Recommended)

This is the simplest way to get the entire application running.

1.  **Clone the repository**:
    ```sh
    git clone https://github.com/your-username/genlogs-test.git
    cd genlogs-test
    ```
2.  **Set up the environment file** as described in the Environment Variables section (create a `.env` file in the root).

3.  **Build and run the containers**:
    ```sh
    docker-compose up --build
    ```

4.  **Access the application**:
    - Frontend: http://localhost:3000
    - Backend API: http://localhost:8000/docs

### Option 2: Running Locally

Follow these steps to run the frontend and backend services separately.

#### Backend (FastAPI)
```sh
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
```
The backend will be available at `http://localhost:8000`.

#### Frontend (React)
```sh
# In a new terminal, navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```
The frontend will open automatically at `http://localhost:3000`.

---

## 🧪 Running Tests

Unit tests are available for the frontend components using Jest and React Testing Library.

1.  **Navigate to the frontend directory**:
    ```sh
    cd frontend
    ```
2.  **Run the tests**:
    ```sh
    npm test
    ```

---