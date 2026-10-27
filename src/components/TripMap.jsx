import { useEffect, useRef, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import {
  ArrowUpRight,
  BedDouble,
  Crosshair,
  MapPin,
  Navigation,
  Utensils,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import { hasCoordinates, navigationUrl } from "../utils/travel.js";

const types = {
  accommodation: { label: "Nơi ở", color: "#b67632", icon: BedDouble },
  food: { label: "Ăn uống & cà phê", color: "#3e6e5b", icon: Utensils },
  attraction: { label: "Khám phá", color: "#426f8b", icon: MapPin },
};

function MapController({ selected, fitKey, locations }) {
  const map = useMap();
  useEffect(() => {
    if (hasCoordinates(selected))
      map.flyTo(selected.coordinates, 15, {
        animate: !matchMedia("(prefers-reduced-motion: reduce)").matches,
        duration: 0.7,
      });
  }, [selected, map]);
  useEffect(() => {
    const points = locations
      .filter(hasCoordinates)
      .map((location) => location.coordinates);
    if (points.length > 1)
      map.fitBounds(points, { padding: [45, 45], maxZoom: 14, animate: false });
    else if (points.length === 1) map.setView(points[0], 13);
    else map.setView([11.9417, 108.4383], 12);
  }, [fitKey, locations, map]);
  return null;
}

function PlaceMarker({ location, selected, onSelect, onShowActivity }) {
  const ref = useRef(null);
  useEffect(() => {
    if (selected) ref.current?.openPopup();
  }, [selected]);
  return (
    <CircleMarker
      ref={ref}
      center={location.coordinates}
      radius={selected ? 12 : 8}
      pathOptions={{
        color: "#fff",
        weight: 3,
        fillColor: types[location.type]?.color || "#213e35",
        fillOpacity: 1,
      }}
      eventHandlers={{ click: () => onSelect(location.id) }}
    >
      <Popup>
        <strong>{location.name}</strong>
        {location.address && <p>{location.address}</p>}
        <a href={navigationUrl(location)} target="_blank" rel="noreferrer">
          Mở chỉ đường ↗
        </a>
        <button
          className="map-popup-button"
          onClick={() => onShowActivity(location.activityIds[0])}
        >
          Xem trong lịch trình
        </button>
      </Popup>
    </CircleMarker>
  );
}

export default function TripMap({
  locations,
  selectedId,
  onSelect,
  onShowActivity,
}) {
  const [filter, setFilter] = useState("all");
  const [tileError, setTileError] = useState(false);
  const [fitKey, setFitKey] = useState(0);
  const listRef = useRef(null);
  const selected = locations.find((location) => location.id === selectedId);
  const filtered = locations.filter(
    (location) => filter === "all" || location.type === filter,
  );
  const verified = locations.filter(hasCoordinates);

  useEffect(() => {
    if (selectedId) setFilter("all");
  }, [selectedId]);

  useEffect(() => {
    const list = listRef.current;
    const row = list?.querySelector(".place-selected");
    if (row)
      list.scrollTo({
        top: Math.max(0, row.offsetTop - 8),
        behavior: "instant",
      });
  }, [selectedId, filter]);

  return (
    <>
      <div className="map-layout">
        <div className="map-canvas" aria-label="Bản đồ các điểm đến ở Đà Lạt">
          <MapContainer
            center={[11.9417, 108.4383]}
            zoom={12}
            scrollWheelZoom={false}
            className="leaflet-map"
          >
            <TileLayer
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              maxZoom={19}
              eventHandlers={{ tileerror: () => setTileError(true) }}
            />
            <MapController
              selected={selected}
              fitKey={fitKey}
              locations={locations}
            />
            {verified.map((location) => (
              <PlaceMarker
                key={location.id}
                location={location}
                selected={selectedId === location.id}
                onSelect={onSelect}
                onShowActivity={onShowActivity}
              />
            ))}
          </MapContainer>
          <button
            className="icon-button map-fit"
            title="Xem toàn bộ điểm đến"
            aria-label="Xem toàn bộ điểm đến"
            onClick={() => {
              onSelect(null);
              setFitKey(fitKey + 1);
            }}
          >
            <Crosshair size={19} />
          </button>
          {tileError && (
            <p className="map-status" role="status">
              Không tải được một số ô bản đồ. Danh sách địa điểm vẫn có sẵn.
            </p>
          )}
          {!verified.length && (
            <p className="map-status">
              Chưa có tọa độ đã xác minh. Các liên kết bản đồ gốc vẫn có sẵn.
            </p>
          )}
        </div>
        <div className="place-panel">
          <div className="place-panel-heading">
            <h3>Điểm hẹn của chúng mình</h3>
            <span>{locations.length} địa điểm</span>
          </div>
          <div className="place-filters" aria-label="Loại địa điểm">
            {[
              ["all", "Tất cả"],
              ["accommodation", "Nơi ở"],
              ["food", "Ăn uống"],
              ["attraction", "Khám phá"],
            ].map(([value, label]) => (
              <button
                key={value}
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="place-list" ref={listRef}>
            {filtered.map((location) => {
              const Icon = types[location.type]?.icon || MapPin;
              const url = navigationUrl(location);
              return (
                <div
                  key={location.id}
                  className={`place-item ${selectedId === location.id ? "place-selected" : ""}`}
                >
                  <button
                    className="place-select"
                    onClick={() => onSelect(location.id)}
                    aria-pressed={selectedId === location.id}
                  >
                    <Icon size={19} />
                    <span>
                      <strong>{location.name}</strong>
                      <small>
                        {types[location.type]?.label}
                        {hasCoordinates(location)
                          ? " · Đã xác minh tọa độ"
                          : " · Chưa xác minh tọa độ"}
                      </small>
                    </span>
                  </button>
                  {selectedId === location.id && (
                    <div className="place-detail">
                      <p className="preserve-lines">{location.sourceText}</p>
                      <div>
                        {url && (
                          <a
                            className="text-link"
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Navigation size={14} />
                            Chỉ đường <ArrowUpRight size={14} />
                          </a>
                        )}
                        <button
                          className="text-link"
                          onClick={() =>
                            onShowActivity(location.activityIds[0])
                          }
                        >
                          Xem lịch trình <ArrowUpRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {!filtered.length && <p>Chưa có địa điểm thuộc nhóm này.</p>}
          </div>
        </div>
      </div>
      <div className="map-footnote">
        <span>
          <span className="legend-dot legend-stay" />
          Nơi ở
        </span>
        <span>
          <span className="legend-dot legend-food" />
          Ăn uống & cà phê
        </span>
        <span>
          <span className="legend-dot legend-place" />
          Khám phá
        </span>
        <p>
          {verified.length}/{locations.length} địa điểm có tọa độ xác minh.
          Không tự suy đoán vị trí.
        </p>
      </div>
    </>
  );
}
