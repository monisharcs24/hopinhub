import { useEffect, useRef } from "react";

export default function MapPreview({ pickup, destination }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.google || !pickup || !destination) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 13,
      center: { lat: 12.9716, lng: 77.5946 }, // fallback
    });

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();

    directionsRenderer.setMap(map);

    directionsService.route(
      {
        origin: pickup,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
        } else {
          console.error("Directions error:", status);
        }
      }
    );
  }, [pickup, destination]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[350px] rounded-xl shadow mt-6"
    />
  );
}
