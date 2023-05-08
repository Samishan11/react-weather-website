import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useGetCountryQuery, useGetWeatherQuery } from "../redux/apiSlice";

const Map: React.FC = () => {
  const [filter, setFilter] = useState({})

  // 
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [countryCodes, setCountryCodes] = useState<string[]>([]);
  const { isLoading, data } = useGetWeatherQuery(filter);
  const { isLoading: lodingCountry, data: countryData } = useGetCountryQuery({});
  useEffect(() => {
    if (!isLoading) {
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
  }, [isLoading]);

  useEffect(() => {
    if (!lodingCountry) {
      const codes = countryData.map((country: any) => country.latlng);
      console.log(countryData)
      setCountryCodes(codes)
      setFilter({
        lat: codes
      })
    }
  }, [countryData]);

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

    !isLoading ?
      <div className="map-container">
        <MapContainer center={[0, 0]} zoom={2} style={{ width: "100%", height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {data?.list?.length > 0 && data?.list?.map((data: any) => (
            <Marker position={center}>
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
        <div className="map-legend">
          {!isLoading && data?.length > 0 && data?.map((data: any) => (
            console.log(data?.weather[0]?.description),
            <span key={data.id} className={`legend-item ${getWeatherClass(data?.weather[0]?.description)}`}>
              {data.name}
            </span>
          ))}
        </div>
      </div> :
      <p>Loading...</p>

  );
};

export default Map;
