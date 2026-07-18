import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIconPrototype = L.Icon.Default.prototype as L.Icon.Default & {
  _getIconUrl?: () => string;
};

delete defaultIconPrototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Replace with your shop coordinates
const shopLocation: [number, number] = [31.4504, 73.1350];

const Map = () => {
  return (
    <MapContainer
      center={shopLocation}
      zoom={15}
      scrollWheelZoom={false}
      className="h-112.5 w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={shopLocation}>
        <Popup>
          <strong>Game Store</strong>
          <br />
          Faisalabad, Pakistan
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;