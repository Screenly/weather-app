export const trimCoordinates = (location) => {
  const { lat, lng } = location
  return {
    lat: parseFloat(lat).toFixed(2),
    lng: parseFloat(lng).toFixed(2)
  }
}
