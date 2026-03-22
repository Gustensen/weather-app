import sqlite3

# Create the DB table once if it does not already exist.
with sqlite3.connect('weather_data.db') as conn:
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS weather_data
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                    city TEXT,
                    start_date DATE,
                    end_date DATE,
                    data TEXT)''')
    conn.commit()
    
def get_weather_history():
    # Fetch all saved rows so the UI can show search history.
    with sqlite3.connect('weather_data.db') as conn:
        c = conn.cursor()
        c.execute('SELECT * FROM weather_data')
        rows = c.fetchall()
        return rows
    
def update_weather_location(record_id, new_location):
    # Update the location text for one record.
    with sqlite3.connect('weather_data.db') as conn:
        conn.execute("UPDATE weather_data SET location = ? WHERE id = ?", (new_location, record_id))

def delete_weather_record(record_id):
    # Remove one record by id.
    with sqlite3.connect('weather_data.db') as conn:
        conn.execute("DELETE FROM weather_data WHERE id = ?", (record_id,))

def save_weather_data(city, start_date, end_date, data):
    # Store a weather response in the local database.
    with sqlite3.connect('weather_data.db') as conn:
        c = conn.cursor()
        c.execute('''INSERT INTO weather_data (city, start_date, end_date, data)
                     VALUES (?, ?, ?, ?)''', (city, start_date, end_date, data))
        conn.commit()
    


