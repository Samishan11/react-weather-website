import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
interface Center {
  lat: number;
  lon: number;
}

const Map: React.FC<Center> =  ({ lat, lon }: Center)  => {
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [weatherData, setWeatherData] = useState<any[]>([]);


  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCenter([latitude, longitude]);
      },
      (error) => {
        console.error("Error getting current location:", error);
      }
    );
  }, [weatherData]);

  const fetchWeather = async () => {
    try {
      const API_KEY = "1c5d8a607c8ec51b649bdd2ce052e5ff";
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/group?id=524901,703448,2643743&units=metric&appid=${API_KEY}`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };
  console.log(weatherData)

  useEffect(()=>{
    fetchWeather()
  },[])

  const getWeatherClass = (weather: string): string => {
    if (weather) {
      if (weather.includes("rain")) {
        return "weather-rain";
      } else if (weather.includes("clear")) {
        return "weather-clear";
      } else if (weather.includes("cloud")) {
        return "weather-cloud";
      } else if (weather.includes("snow")) {
        return "weather-snow";
      }
    }
    
    return "weather-default";
  };
  return (
    <div className="map-container">
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ width: "100%", height: "100%" }}
        className={getWeatherClass(weatherData[0]?.weather[0]?.description)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        { weatherData?.length > 0 && weatherData?.map((data: any) => (
          <Marker key={data.id} position={[data.coord.lat, data.coord.lon]}>
            <Popup>
              <div>
                <h3>{data.name}</h3>
                <p>Temperature: {data.main.temp}°C</p>
                <p>Humidity: {data.main.humidity}%</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
