import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useGetCountryQuery, useGetWeatherQuery } from "../redux/apiSlice";
import "leaflet/dist/images/marker-icon-2x.png";
import countryData from "../data/countries.json";

const cityIds = [
  2643743,   // London, United Kingdom
  5128581,   // New York, United States
  1850147,   // Tokyo, Japan
  2968815,   // Paris, France
  2147714,   // Sydney, Australia
  1283240    // Kathmandu, Nepal
];

interface CountryStyle {
  fillColor: string;
}

const Map: React.FC = () => {
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const { isLoading: loadingWeather, data: weathers } = useGetWeatherQuery({ cityId: cityIds.join(",") });
  const { isLoading: loadingCountry, data: countryDataResponse } = useGetCountryQuery([]);
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

  const getCountryStyle = (countryCode: string): CountryStyle => {
    const country = countryDataResponse?.find((data: any) => data.cca3 === countryCode);
    if (country) {
      const weather = weathers?.list?.find((data: any) => data.sys.country === countryCode.slice(0, -1));
      if (weather) {
        const weatherMain = weather.weather[0].main.toLowerCase();
        console.log(weatherMain)
        switch (weatherMain) {
          case "rain":
            return { fillColor: "red" };
          case "clear":
            return { fillColor: "yellow" };
          case "clouds":
            return { fillColor: " red" };
          case "snow":
            return { fillColor: "white" };
          default:
            return { fillColor: "lightgray" };
        }
      }
    }

    return { fillColor: "lightgray" };
  };
  // zoom to location
  const ZoomToLocation: React.FC = () => {
    const map = useMap();

    useEffect(() => {
      if (center[0] !== 0 && center[1] !== 0) {
        map.flyTo(center, 10, {
          duration: 2,
        });
      }
    }, [center, map]);

    return null;
  };


  // 
  return (
    !loadingWeather ?
      <div className="map-container">
        <MapContainer center={[0, 0]} zoom={2} style={{ width: "100%", height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ZoomToLocation />
          <GeoJSON data={countryData} style={(features) => getCountryStyle(features?.properties?.ISO_A3)} />
          {weathers?.list?.length > 0 && weathers?.list?.map((data: any) => (

            Math.round(center[0]) === Math.round(data.coord.lat) && Math.round(center[1]) === Math.round(data.coord.lon) && (
              <div style={{ background: "red" }}>
                <Marker key={data.id} position={[data.coord.lat, data.coord.lon]}>
                  <Popup >
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
      </div>
      :
      <p>Loading...</p>

  );
};

export default Map;
