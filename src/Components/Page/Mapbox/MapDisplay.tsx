import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

interface MapDisplayProps {
  accessToken: string; // Mapbox Access Token
  longitude: number; // Kinh độ
  latitude: number; // Vĩ độ
}

const MapDisplay: React.FC<MapDisplayProps> = ({ accessToken, longitude, latitude }) => {
  const mapContainer = useRef<HTMLDivElement>(null); // Tham chiếu tới container của bản đồ
  const mapRef = useRef<mapboxgl.Map | null>(null); // Lưu trữ instance của bản đồ

  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      // Khởi tạo Mapbox
      mapboxgl.accessToken = accessToken;

      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11", // Style mặc định
        center: [longitude, latitude],
        zoom: 13, // Độ zoom mặc định
        attributionControl: false,
      });
    } else if (mapRef.current) {
      // Cập nhật vị trí trung tâm của bản đồ khi props thay đổi
      mapRef.current.setCenter([longitude, latitude]);
    }
  }, [accessToken, longitude, latitude]);

  return (
    <div ref={mapContainer} style={{ height: "400px", width: "100%" }}></div>
  );
};

export default MapDisplay;
