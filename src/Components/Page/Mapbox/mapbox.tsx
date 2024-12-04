import React, { useState, useEffect } from 'react';
import mapboxgl, { Map, MapboxOptions } from 'mapbox-gl';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'; // CSS cho Geocoder
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

const MapboxSearch = () => {
  const [map, setMap] = useState<Map | null>(null);
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 12,
  });

  // Hàm khởi tạo bản đồ
  useEffect(() => {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoidHVhbmFuaDIwMDMiLCJhIjoiY20zd3lpNWdnMWFkNjJpbjJiZGZ6N2NtMyJ9.qNRh5uT3j2x0wT_cNht1zg'; // Thay YOUR_MAPBOX_ACCESS_TOKEN bằng token của bạn

    const mapInstance = new mapboxgl.Map({
      container: 'map', // ID của container
      style: 'mapbox://styles/mapbox/streets-v11', // Style bản đồ
      center: [viewport.longitude, viewport.latitude],
      zoom: viewport.zoom,
    });

    // Tạo geocoder (search box)
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl as any,
      marker: true, // Tạo marker khi tìm kiếm
    });

    // Thêm geocoder vào bản đồ
    mapInstance.addControl(geocoder);

    // Xử lý khi tìm kiếm thành công
    geocoder.on('result', (e) => {
      const result = e.result.geometry.coordinates;
      mapInstance.flyTo({ center: result, zoom: 14 }); // Di chuyển bản đồ đến vị trí tìm được
    });

    // Lưu bản đồ vào state
    setMap(mapInstance);

    // Dọn dẹp bản đồ khi component unmount
    return () => mapInstance.remove();
  }, [viewport]);

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

export default MapboxSearch;
