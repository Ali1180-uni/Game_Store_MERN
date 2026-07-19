import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
const shopLocation: [number, number] = [31.40611, 73.102239];

const Map = () => {
  return (
    <MapContainer
      center={shopLocation}
      zoom={15}
      scrollWheelZoom={true}
      className="h-112.5 w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">GameVault</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={shopLocation}>
        <Tooltip permanent direction="top" offset={[-14, -10]}>
          <div className="text-center font-semibold">
            <strong>GameVault</strong>
            <br />
            Faisalabad, Pakistan
          </div>
        </Tooltip>
      </Marker>
    </MapContainer>
  );
};

export default Map;
