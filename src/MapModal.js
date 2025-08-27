import React, { useEffect, useRef } from 'react';

const MapModal = ({ onClose }) => {
  const mapRef = useRef(null);

  // Initialize the map only once when the component mounts
  useEffect(() => {
    // Check if the map container is available and not already initialized
    if (mapRef.current && !mapRef.current._leaflet_id) {
      // Coordinates for Naples, Italy
      const naplesPosition = [40.8518, 14.2681];
      
      // Create the map instance
      const map = window.L.map(mapRef.current).setView(naplesPosition, 13);

      // Add the OpenStreetMap tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="[https://www.openstreetmap.org/copyright](https://www.openstreetmap.org/copyright)">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add a marker for Naples
      window.L.marker(naplesPosition).addTo(map)
        .bindPopup('Welcome to Naples!')
        .openPopup();
    }
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <h2>Interactive Map</h2>
        <div id="map" ref={mapRef} style={{ height: '400px', width: '100%' }}></div>
      </div>
    </div>
  );
};

export default MapModal;