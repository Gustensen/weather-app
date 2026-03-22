import { useState } from 'react'

function WeatherResults({ data }) {
  // Grab what we need from the API response to keep JSX clean below.
  const current = data.forecast.current;
  const forecastDays = data.forecast.forecast.forecastday;

  return (
    <div className="weather-results">
      <h2>Results for {data.forecast.location.name}, {data.forecast.location.country}</h2>
      <div className="map-container">
      <h3>Location Map</h3>
      <iframe
        width="100%"
        height="250"
        style={{ border: 0, borderRadius: '8px' }}
        src={`https://maps.google.com/maps?q=${data.forecast.location.name}&t=&z=13&ie=UTF8&iwloc=&output=embed`}></iframe>
      </div>
      {/* Show today's weather first so users get the quick answer. */}
      <div className="current-card">
        <h3>Current: {current.temp_f}°F ({current.condition.text})</h3>
        {/* WeatherAPI gives icon paths without protocol, so we prepend https:. */}
        <img src={`https:${current.condition.icon}`} alt={current.condition.text} />
        <p>Feels Like: {current.feelslike_f}°F | Humidity: {current.humidity}%</p>
      </div>

      {/* Then show upcoming days so users can plan ahead. */}
      <h3>7-Day Forecast</h3>
      <div className="forecast-grid">
        {forecastDays.map((day, index) => (
          <div key={index} className="forecast-card">
            <h4>{day.date}</h4>
            <img src={`https:${day.day.condition.icon}`} alt={day.day.condition.text} />
            <p>{day.day.maxtemp_f}° / {day.day.mintemp_f}° F</p>
            <p>{day.day.condition.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
function App() {
  
  // These states power the form, result view, and UI status messages.
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
  // Pull saved searches from the backend.
  const res = await fetch("http://localhost:8000/weather-history");
  const data = await res.json();
  setHistory(data);
  };
  
  const handleUpdate = async (id) => {
  // Ask user for a new location and send it to backend.
  const newLocation = prompt("Enter new location:");
  if (newLocation) {
    await fetch(`http://localhost:8000/weather/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location: newLocation })
    });
    loadHistory(); // Refresh the list
  }
};
  const handleDelete = async (id) => {
  // Delete one history row and reload list.
  await fetch(`http://localhost:8000/weather/${id}`, { method: 'DELETE' });
  loadHistory(); // Refresh the list
};
  const handleSearch = async () => {
    // Small validation keeps the API calls clean and useful.
    if (!city.trim()) {
      alert("Error: Please enter a city.");
      return;
    }

    if (startDate && endDate && !(new Date(endDate) > new Date(startDate))) {
      alert("Error: End date must be after start date");
      return;
    }

    setIsLoading(true);
    setIsError(false);

    try {
      // Build query params only with values the user actually entered.
      const params = new URLSearchParams({ city: city.trim() });

      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const response = await fetch(`http://localhost:8000/weather?${params.toString()}`);

      if (!response.ok) throw new Error("Failed to fetch weather data");
      const result = await response.json();
      setWeatherData(result);
    } catch (error) {
      setIsError(true);
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
    
    if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong.</div>;
  }

  const exportData = () => {
          // Turn current weather JSON into a downloadable file.
          const blob = new Blob([JSON.stringify(weatherData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'weather_export.json';
          a.click();
        };
  return (
  <div className="container">
    <header className="main-header">
      <h2>Weather App - Built by Gustensen</h2>
    </header>

    <main className="search-and-results">
      <div className="search-section">
        <label>
          City: <input type="text" placeholder="London, New York, etc." value={city} onChange={(e) => setCity(e.target.value)} />
        </label>
        <label>
          Start: <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          End: <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
          <button onClick={handleSearch}>Get Weather</button>
          <button onClick={exportData}>Export to JSON</button>
      </div>

      {/* Show results only after we have data from the API. */}
      {weatherData && <WeatherResults data={weatherData} />}
    </main>

        <div className="history-section">
        <h2>Search History (DB Read/Delete)</h2>
        <button onClick={loadHistory}>View/Refresh History</button>
        <ul>
          {history.map((item) => (
            <li key={item[0]}>
              {item[2]} ({item[3]}) 
              <button onClick={() => handleUpdate(item[0])}>Update Location</button>
              <button onClick={() => handleDelete(item[0])}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    <footer className="pm-accelerator-section">
      <h3>About PM Accelerator</h3>
      <p>
        The Product Manager Accelerator program is designed to support PM professionals through every stage of their careers...
          <a href="https://www.linkedin.com/school/pmaccelerator/">
            <br></br>[LinkedIn description]</a>
      </p>
    
    </footer>
    </div>
    
    
);
}

export default App
