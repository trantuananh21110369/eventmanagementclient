import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { SearchBox } from "@mapbox/search-js-react";

interface SearchMapProps {
  accessToken: string; // Pass Mapbox Access Token as prop
  location?: string; // Optional initial location
  initialLongitude?: number; // Optional initial longitude
  initialLatitude?: number; // Optional initial latitude
  onAddressSelect: (address: string, longitude: number, latitude: number) => void; // Callback when an address is selected
}

const SearchMap: React.FC<SearchMapProps> = ({
  accessToken,
  location = "", // Default to an empty string
  initialLongitude = 106.660172, // Default longitude
  initialLatitude = 10.762622, // Default latitude
  onAddressSelect,
}) => {
  const [information, setInformation] = useState({
    address: location, // Set initial address from location prop
    longitude: initialLongitude,
    latitude: initialLatitude,
    isSaveAddress: false,
  });

  const mapContainer = useRef<HTMLDivElement>(null); // Reference to the map container
  const mapRef = useRef<mapboxgl.Map | null>(null); // Store the map instance

  // Initialize the map
  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      mapboxgl.accessToken = accessToken;

      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [initialLongitude, initialLatitude],
        zoom: 13,
        attributionControl: false,
      });
    } else if (mapRef.current) {
      mapRef.current.setCenter([initialLongitude, initialLatitude]);
    }
  }, [accessToken, initialLongitude, initialLatitude]);

  // Update address when location prop changes
  useEffect(() => {
    setInformation((prev) => ({
      ...prev,
      address: location,
    }));
  }, [location]);

  // Handle address selection from search box
  const handleAddressRetrieve = (e: any) => {
    const { full_address, coordinates } = e.features[0].properties;
    setInformation({
      address: full_address,
      longitude: coordinates.longitude,
      latitude: coordinates.latitude,
      isSaveAddress: false,
    });

    onAddressSelect(full_address, coordinates.longitude, coordinates.latitude);
  };

  return (
    <div>
      <SearchBox
        options={{
          proximity: { lng: initialLongitude, lat: initialLatitude },
        }}
        value={information.address} // Bind to address state
        onRetrieve={handleAddressRetrieve}
        accessToken={accessToken}
      />
      <div ref={mapContainer} style={{ height: "400px", marginTop: "20px" }}></div>
    </div>
  );
};

export default SearchMap;
