const axios = require('axios');

async function getRouteFromMapbox(waypoints) {
  const coords = waypoints.map(([lng, lat]) => `${lng},${lat}`).join(';');
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&access_token=YOUR_MAPBOX_ACCESS_TOKEN`;
  const res = await axios.get(url);
  return res.data.routes[0].geometry;
}

module.exports = { getRouteFromMapbox };