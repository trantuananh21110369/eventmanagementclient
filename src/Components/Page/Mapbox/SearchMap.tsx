import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { SearchBox } from "@mapbox/search-js-react";

interface SearchMapProps {
  accessToken: string; // Pass Mapbox Access Token as prop
  initialLongitude?: number; // Optional initial longitude
  initialLatitude?: number; // Optional initial latitude
  onAddressSelect: (address: string, longitude: number, latitude: number) => void; // Callback when an address is selected
}

const SearchMap: React.FC<SearchMapProps> = ({
  accessToken,
  initialLongitude = 106.660172, // Default coordinates
  initialLatitude = 10.762622, // Default coordinates
  onAddressSelect,
}) => {
  const [information, setInformation] = useState({
    address: "",
    longitude: initialLongitude,
    latitude: initialLatitude,
    isSaveAddress: false,
  });

  const mapContainer = useRef<HTMLDivElement>(null); // Reference to the map container
  const mapRef = useRef<mapboxgl.Map | null>(null); // Store the map instance

  // Initialize map when the component is mounted
  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      mapboxgl.accessToken = accessToken; // Use the provided access token

      // Initialize the map only once
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [information.longitude, information.latitude],
        zoom: 13,
        attributionControl: false,
      });
    } else if (mapRef.current) {
      // Update map center if already initialized
      mapRef.current.setCenter([information.longitude, information.latitude]);
    }
  }, [information, accessToken]);

  // Handle address selection from map search
  const handleAddressRetrieve = (e: any) => {
    const { full_address, coordinates } = e.features[0].properties;
    setInformation({
      address: full_address,
      longitude: coordinates.longitude,
      latitude: coordinates.latitude,
      isSaveAddress: false,
    });

    // Call the external callback function to send the selected address data back to the parent component
    onAddressSelect(full_address, coordinates.longitude, coordinates.latitude);
  };

  return (
    <div>
      <SearchBox
        options={{
          proximity: { lng: initialLongitude, lat: initialLatitude }, // Default coordinates
        }}
        onRetrieve={handleAddressRetrieve}
        accessToken={accessToken}
      />
      <div ref={mapContainer} style={{ height: "400px", marginTop: "20px" }}></div>
    </div>
  );
};

export default SearchMap;
