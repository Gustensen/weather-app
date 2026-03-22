                                Weather App
A weather application designed to track current conditions, provide 7-day forecasts, and manage historical search data with full CRUD (Create, Read, Update, Delete) capabilities.

🚀 System Architecture

Backend: FastAPI (Python) for robust API handling, asynchronous data fetching, and SQLite database management.

Frontend: React (Vite) with a modern, responsive CSS-grid/flexbox design.

Database: SQLite for lightweight, reliable data persistence of weather records.

API Integration: WeatherAPI.com (includes fuzzy-matching location support).

🛠 Features & Requirements Fulfilled
CRUD Operations: Users can create search records, view history, update saved locations, and delete records.

Data Validation: Strict client-side and server-side validation for date ranges and location inputs.

Data Export: One-click functionality to export historical weather data into JSON format for portability.

Forecast & Maps: Integrated 7-day forecast display with interactive visual maps.

Professional UI: Modern interface with horizontal scrolling for forecast data and Fahrenheit unit conversion.

📦 Requirements
To install dependencies, run:

Bash
pip install -r requirements.txt
🚀 How to Run
Backend:

cd backend

uvicorn main:app --reload

Frontend:

npm install

npm run dev