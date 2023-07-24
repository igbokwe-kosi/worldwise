import { useEffect, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import styles from "./Map.module.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";

import { useCities } from "../context/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import useUrlPosition from "../hooks/useUrlPosition";

function Map() {
  const [mapPostion, setMapPostion] = useState([
    52.53586782505711, 13.376933665713324,
  ]);
  const { cities } = useCities();
  const {
    isLoading: isLoadingPositon,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  // console.log(geolocationPosition);

  const [mapLat, mapLng] = useUrlPosition();

  useEffect(
    function () {
      if (mapLat && mapLng) {
        setMapPostion([mapLat, mapLng]);
      }
    },
    [mapLat, mapLng]
  );
  useEffect(
    function () {
      if (geolocationPosition) {
        setMapPostion([geolocationPosition.lat, geolocationPosition.lng]);
      }
    },
    [geolocationPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {geolocationPosition === null && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPositon ? "Loading..." : "use your position"}
        </Button>
      )}
      <MapContainer
        center={[mapLat || mapPostion[0], mapLng || mapPostion[1]]}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter
          position={[mapLat || mapPostion[0], mapLng || mapPostion[1]]}
        />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvent("click", (e) =>
    navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
  );
  return null;
}

export default Map;
