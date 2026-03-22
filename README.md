# Weather App

A weather application designed to track current conditions, provide 7-day forecasts, and manage historical search data with full CRUD (Create, Read, Update, Delete) capabilities.

## System Architecture

- Backend: FastAPI (Python) for robust API handling, asynchronous data fetching, and SQLite database management.
- Frontend: React (Vite) with a modern, responsive CSS-grid/flexbox design.
- Database: SQLite for lightweight, reliable data persistence of weather records.
- API Integration: WeatherAPI.com (includes fuzzy-matching location support).

## Features and Requirements Fulfilled

- CRUD operations: users can create search records, view history, update saved locations, and delete records.
- Data validation: strict client-side and server-side validation for date ranges and location inputs.
- Data export: one-click functionality to export historical weather data into JSON format for portability.
- Forecast and maps: integrated 7-day forecast display with interactive visual maps.
- Professional UI: modern interface with horizontal scrolling for forecast data and Fahrenheit unit conversion.

## Requirements

Install backend dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

## How to Run

Start the backend server:

```bash
cd backend
uvicorn main:app --reload
```

Start the frontend development server:

```bash
cd frontend
npm run dev
```
