import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
interface Center {
  lat: number;
  lon: number;
}

const Map: React.FC<Center> =  ({ lat, lon }: Center)  => {
  return (
    <div className="map-container">
      <MapContainer
        center={[lat=0, lon=0]}
        zoom={2}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
};

export default Map;
