import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useGetCountryQuery, useGetWeatherQuery } from "../redux/apiSlice";
import "leaflet/dist/images/marker-icon-2x.png";
import countryData from "../data/countries.json";
import { LatLngBounds } from 'leaflet';
import L from 'leaflet';
import Control from 'react-leaflet-custom-control'

const cityIds = [
  2643743,   // London, United Kingdom
  5128581,   // New York, United States
  1850147,   // Tokyo, Japan
  2968815,   // Paris, France
  2147714,   // Sydney, Australia
  1283240,  // Kathmandu, Nepal
  1273294,
  1185241,
  1138958,  // Kabul, Afghanistan
  174982,   // Tirana, Albania
  2507480,  // Algiers, Algeria
  3041563,  // Andorra la Vella, Andorra
  3351879,  // Luanda, Angola
  3865483,  // Buenos Aires, Argentina
  2950159,  // Vienna, Austria
  587084,   // Baku, Azerbaijan
  1215502,  // Nassau, Bahamas
  130758,   // Ljubljana, Slovenia
  // 3661563,  // Honiara, Solomon Islands
  // 51537,    // Mogadishu, Somalia
  // 953987,   // Pretoria, South Africa
  // 3669881   // Madrid, Spain
];

interface CountryStyle {
  fillColor: string;
}

const Map: React.FC = () => {

  const southWest = { lat: 100, lng: -10 }; // Replace with your desired south-west coordinate
  const northEast = { lat: 60, lng: 60 }; // Replace with your desired north-east coordinate
  const bounds = new LatLngBounds(southWest, northEast);

  const SetBounds = () => {
    const map = useMap();
    map.setMaxBounds(bounds);
    return null;
  };

  // 
  const [center, setCenter] = useState<[number, number]>([0, 0]);

  // 
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

  // methods
  const getCountryStyle = (countryCode: string): CountryStyle => {
    const country = countryDataResponse?.find((data: any) => data.cca3 === countryCode);
    if (country) {
      const weather = weathers?.list?.find((data: any) => data.sys.country === countryCode.slice(0, -1));
      if (weather) {
        const weatherMain = weather.weather[0].main.toLowerCase();
        switch (weatherMain) {
          case "rain":
            return { fillColor: "red" };
          case "clear":
            return { fillColor: "yellow" };
          case "clouds":
            return { fillColor: " #000" };
          case "snow":
            return { fillColor: "white" };
          case "haze":
            return { fillColor: "#FD0000" };
          default:
            return { fillColor: "lightgray" };
        }
      }
    }

    return { fillColor: "lightgray" };
  };
  // methods
  const [click, setClick] = useState(false)
  const getCountryStyleonClick = (countryCode: string, value: string): CountryStyle => {
    const country = countryDataResponse?.find((data: any) => data.cca3 === countryCode);
    if (country) {
      const weather = weathers?.list?.find((data: any) => data.weather[0].main.toLowerCase() === value);
      // console.log(weather)
      if (weather) {
        const weatherMain = weather.weather[0].main.toLowerCase();
        switch (weatherMain) {
          case "rain":
            console.log("rain")
            return { fillColor: "red" };
          case "clear":
            console.log("clear")
            return { fillColor: "yellow" };
          case "clouds":
            console.log("cloud")
            return { fillColor: " #000" };
          case "snow":
            return { fillColor: "white" };
          case "haze":
            return { fillColor: "#FD0000" };
          default:
            return { fillColor: "green" };
        }
      }
    }

    return { fillColor: "green" };
  };



  // zoom to location
  const ZoomToLocation: React.FC = () => {
    const map = useMap();
    useEffect(() => {
      if (center[0] !== 0 && center[1] !== 0) {
        map.flyTo(center, 8, {
          duration: 3,
        });
      }
    }, [center, map]);

    return null;
  };



  return (
    !loadingWeather ?
      <div className="map-container" style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <MapContainer scrollWheelZoom={false} style={{ width: "100%", height: "100%", overflow: "hidden" }} center={[0, 0]} zoom={2} >
          {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?lang=en" /> */}
          <TileLayer url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png' />
          {/* <SetBounds /> */}
          {/* <ZoomToLocation /> */}
          <Control prepend position='topright'>
            <button onClick={() => setClick(true)} style={{ position: "absolute", right: "10px" }}>Hot</button>
          </Control>
          <GeoJSON data={countryData} style={(features) => click ? getCountryStyleonClick(features?.properties?.ISO_A3, "clouds") : getCountryStyle(features?.properties?.ISO_A3)} />

          {/* <GeoJSON data={countryData} style={(features) => click ? getCountryStyleonClick("clear") : getCountryStyle(features?.properties?.ISO_A3)} /> */}
          {weathers?.list?.length > 0 && weathers?.list?.map((data: any, ind: number) => (

            Math.round(center[0]) === Math.round(data.coord.lat) && Math.round(center[1]) === Math.round(data.coord.lon) && (
              <div key={ind} style={{ background: "red" }}>
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
