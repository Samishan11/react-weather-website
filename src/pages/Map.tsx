import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useGetCountryQuery, useGetWeatherQuery } from "../redux/apiSlice";
import L from "leaflet";
import "leaflet/dist/images/marker-icon-2x.png";
import { Icon } from "leaflet";

const cityIds = [
  2643743,   // London, United Kingdom
  5128581,   // New York, United States
  1850147,   // Tokyo, Japan
  2968815,   // Paris, France
  2147714,  // Sydney, Australia
  1283240  // katmandu
];

const Map: React.FC = () => {

  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const { isLoading: loadingWeather, data: weathers } = useGetWeatherQuery({ cityId: cityIds.join(",") });

  useEffect(() => {
    if (!loadingWeather) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    }
  }, [loadingWeather]);

  // methods 

  // const weatherIcon = (weather: string): L.Icon => {
  //   let iconUrl = "";

  //   if (weather.includes("rain")) {
  //     iconUrl = "/rain-marker-icon.png";
  //   } else if (weather.includes("clear")) {
  //     iconUrl = "/clear-marker-icon.png";
  //   } else if (weather.includes("cloud")) {
  //     iconUrl = "/cloud-marker-icon.png";
  //   } else if (weather.includes("snow")) {
  //     iconUrl = "/snow-marker-icon.png";
  //   } else {
  //     iconUrl = "/default-marker-icon.png";
  //   }

  //   return new L.Icon({
  //     iconUrl,
  //     iconSize: [25, 41],
  //     iconAnchor: [12, 41],
  //     popupAnchor: [1, -34],
  //     shadowSize: [41, 41],
  //   });
  // };
  const getWeatherClass = (weather: string): string => {
    if (weather.includes("rain")) {
      return "weather-rain";
    } else if (weather.includes("clear")) {
      return "weather-clear";
    } else if (weather.includes("cloud")) {
      return "weather-cloud";
    } else if (weather.includes("snow")) {
      return "weather-snow";
    }
    return "weather-default";
  };
  // 



  return (

    !loadingWeather ?
      <div className="map-container">
        <MapContainer center={[0, 0]} zoom={2} style={{ width: "100%", height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {weathers?.list?.length > 0 && weathers?.list?.map((data: any) => (
            Math.round(center[0]) === Math.round(data.coord.lat) && Math.round(center[1]) === Math.round(data.coord.lon) && (
              <div style={{ background: "red" }}>
                <Marker key={data.id} position={[data.coord.lat, data.coord.lon]}>
                  <Popup className={getWeatherClass(data.weather[0].main)}>
                    <div>
                      <h3>{data.name}</h3>
                      <p>Temperature: {data.main.temp}°C</p>
                      <p>Humidity: {data.main.humidity}%</p>
                    </div>
                  </Popup>
                </Marker>
              </div>
            )
          ))}
        </MapContainer>

      </div> :
      <p>Loading...</p>

  );
};

export default Map;
