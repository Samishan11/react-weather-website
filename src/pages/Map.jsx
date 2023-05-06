import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
const Map = () => {
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  const fetchMarkers = async (scrollPosition) => {
    // Fetch new map data based on scroll position
    // Update the `markers` state with the fetched data
    // Example:
    const newMarkers = await yourApiCall(scrollPosition);
    setMarkers((prevMarkers) => [...prevMarkers, ...newMarkers]);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollPosition > documentHeight * 0.9) {
        fetchMarkers(scrollPosition);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.log("Error retrieving location:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (mapRef.current && mapRef.current.leafletElement) {
      mapRef.current.leafletElement.closePopup();
      mapRef.current.leafletElement.eachLayer((layer) => {
        if (layer instanceof Marker) {
          mapRef.current.leafletElement.removeLayer(layer);
        }
      });

      markers.forEach((marker) => {
        const { lat, lng, title, description } = marker;

        const leafletMarker = L.marker([lat, lng]).addTo(
          mapRef.current.leafletElement
        );
        leafletMarker.bindPopup(`<b>${title}</b><br>${description}`);
      });

      if (currentLocation) {
        const { lat, lng } = currentLocation;
        const currentLocationMarker = L.marker([lat, lng]).addTo(
          mapRef.current.leafletElement
        );
        currentLocationMarker.bindPopup("Your Location");
      }
    }
  }, [markers, currentLocation]);

  return (
    <div className="map-container">
      <MapContainer
        ref={mapRef}
        center={[0, 0]}
        zoom={2}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
};

export default Map;
