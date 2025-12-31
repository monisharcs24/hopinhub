export const getDistance = (origin, destination) => {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject("Google Maps not loaded");
      return;
    }

    const service = new window.google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          const element = response.rows[0].elements[0];
          resolve({
            distance: element.distance.text,
            duration: element.duration.text,
            distanceValue: element.distance.value / 1000, // km
          });
        } else {
          reject(status);
        }
      }
    );
  });
};
