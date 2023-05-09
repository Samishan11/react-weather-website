import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useGetCountryQuery, useGetWeatherQuery } from "../redux/apiSlice";
import axios from "axios";


const cityIds = [
  2643743,   // London, United Kingdom
  5128581,   // New York, United States
  1850147,   // Tokyo, Japan
  2968815,   // Paris, France
  2147714    // Sydney, Australia
];

const Map: React.FC = () => {

  // states
  const [filter, setFilter] = useState({})
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [countryCodes, setCountryCodes] = useState<string[]>([]);
  const [isLoading, setIsLoding] = useState<Boolean>(false);

  // rtk query
  const { isLoading: lodingCountry, data: countryData } = useGetCountryQuery({});
  const { isLoading: loadingWeather, data: weathers } = useGetWeatherQuery({ cityId: cityIds.join(",") });
  console.log(weathers)
  // hooks 

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

  useEffect(() => {
    if (!lodingCountry) {
      const codes = countryData.map((country: any) => country.latlng);
      setCountryCodes(codes)
      setFilter({
        lat: codes
      })
    }
  }, [countryData]);

  // methods 

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

    !loadingWeather ?
      <div className="map-container">
        <MapContainer center={[0, 0]} zoom={2} style={{ width: "100%", height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {weathers?.list?.length > 0 && weathers?.list?.map((data: any) => (
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
          {!loadingWeather && weathers?.length > 0 && weathers?.list?.map((data: any) => (
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
