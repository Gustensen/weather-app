import os
import json
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import date
from typing import Optional
from database import delete_weather_record, save_weather_data, get_weather_history, update_weather_location


app = FastAPI()

# Load environment variables from .env when the app starts.
load_dotenv()

# Allow the frontend to call this API during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins= ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/weather")
def get_weather(city: str, start_date: Optional[date] = None, end_date: Optional[date] = None):
    # Read the API key once per request.
    api_key = os.getenv("Weather_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Weather API key is not configured")

    # Quick safety check so users do not send impossible date ranges.
    if start_date and end_date and end_date <= start_date:
        raise HTTPException(status_code=400, detail="End date must be after start date")

    forecast_url = f"https://api.weatherapi.com/v1/forecast.json?key={api_key}&q={city}&days=7&aqi=no&alerts=no"

    try:
        # Always fetch the latest forecast for the selected city.
        forecast_response = requests.get(forecast_url, timeout=10)
        forecast_response.raise_for_status()
        combined_payload = {
            "forecast": forecast_response.json()
        }

        # If the date range is in the past, also fetch historical weather.
        if start_date and end_date and end_date < date.today():
            historical_url = f"https://api.weatherapi.com/v1/history.json?key={api_key}&q={city}&dt={start_date}&end_dt={end_date}"
            historical_response = requests.get(historical_url, timeout=10)
            historical_response.raise_for_status()
            combined_payload["history"] = historical_response.json()

    except requests.RequestException as exc:
        # Return a clean API error instead of crashing the server.
        raise HTTPException(status_code=502, detail=f"Weather API request failed: {exc}") from exc

    # Save a copy of this search so users can see history later.
    save_weather_data(city, start_date, end_date, json.dumps(combined_payload))
    return combined_payload

@app.get("/weather-history")
def get_historical_weather():
    # Return everything we have saved in the local DB.
    return get_weather_history()

@app.put("/weather/{record_id}")
def update_record(record_id: int, new_location: str):
    # Update one row by id.
    update_weather_location(record_id, new_location)
    return {"status": "updated"}

@app.delete("/weather/{record_id}")
def delete_record(record_id: int):
    # Delete one row by id.
    delete_weather_record(record_id)
    return {"status": "deleted"}
