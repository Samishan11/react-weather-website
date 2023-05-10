import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useGetCountryQuery, useGetWeatherQuery } from "../redux/apiSlice";
import L from "leaflet";
import "leaflet/dist/images/marker-icon-2x.png";
import { Icon } from "leaflet";
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
  console.log(countryDataResponse)
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

  // const getCountryStyle = (countryCode: string): CountryStyle => {
  //   const weather = weathers?.list?.find((data: any) => data.sys.country === countryCode);
  //   if (weather) {
  //     const weatherMain = weather.weather[0].main.toLowerCase();

  //     switch (weatherMain) {
  //       case "rain":
  //         return { fillColor: "red" };
  //       case "clear":
  //         return { fillColor: "blue" };
  //       case "clouds":
  //         return { fillColor: "gray" };
  //       case "snow":
  //         return { fillColor: "white" };
  //       default:
  //         return { fillColor: "lightgray" };
  //     }
  //   }

  //   return { fillColor: "lightgray" };
  // };

  const getCountryStyle = (countryCode: string): CountryStyle => {
    console.log(countryCode)
    const country = countryDataResponse?.find((data: any) => data.cca2 === countryCode);
    if (country) {
      const weather = weathers?.list?.find((data: any) => data.sys.country === countryCode);
      if (weather) {
        const weatherMain = weather.weather[0].main.toLowerCase();

        switch (weatherMain) {
          case "rain":
            return { fillColor: "red" };
          case "clear":
            return { fillColor: "blue" };
          case "clouds":
            return { fillColor: "gray" };
          case "snow":
            return { fillColor: "white" };
          default:
            return { fillColor: "lightgray" };
        }
      }
    }

    return { fillColor: "lightgray" };
  };

  // const getWeatherClass = (weather: string): string => {
  //   if (weather.includes("rain")) {
  //     return "weather-rain";
  //   } else if (weather.includes("clear")) {
  //     return "weather-clear";
  //   } else if (weather.includes("cloud")) {
  //     return "weather-cloud";
  //   } else if (weather.includes("snow")) {
  //     return "weather-snow";
  //   }
  //   return "weather-default";
  // };
  // 

  // 
  return (
    // <div className="map-container">
    //   {loadingWeather ? (
    //     <p>Loading...</p>
    //   ) : (
    //     <MapContainer center={center} zoom={2} style={{ width: "100%", height: "100%" }}>
    //       <TileLayer attribution="OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

    //       <GeoJSON
    //         data={countryData}
    //         style={(feature) => getCountryStyle(feature?.properties?.cca2)}
    //       />
    //     </MapContainer>
    //   )}
    // </div>
    !loadingWeather ?
      <div className="map-container">
        <MapContainer center={[0, 0]} zoom={2} style={{ width: "100%", height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <GeoJSON data={countryData} style={(features) => getCountryStyle(features?.properties?.ISO_A3)} />
          {weathers?.list?.length > 0 && weathers?.list?.map((data: any) => (

            Math.round(center[0]) === Math.round(data.coord.lat) && Math.round(center[1]) === Math.round(data.coord.lon) && (
              <div style={{ background: "red" }}>
                <Marker key={data.id} position={[data.coord.lat, data.coord.lon]}>
                  {/* <Popup className={getWeatherClass(data.weather[0].main)}> */}
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
