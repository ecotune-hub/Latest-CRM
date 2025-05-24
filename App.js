import React, { useEffect, useState } from 'react';
import MapGL, { Marker, Source, Layer } from 'react-map-gl';
import axios from 'axios';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

function App() {
  const [contacts, setContacts] = useState([]);
  const [viewport, setViewport] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    zoom: 11,
    width: "100vw",
    height: "100vh"
  });
  const [selected, setSelected] = useState([]);
  const [routeGeoJson, setRouteGeoJson] = useState(null);

  useEffect(() => {
    axios.get('/api/contacts').then(res => setContacts(res.data));
  }, []);

  const handleSelect = id => {
    setSelected(sel => sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]);
  };

  const planRoute = async () => {
    if (selected.length < 2) return alert('Select at least two contacts');
    const { data } = await axios.post('/api/route', { contacts: selected });
    setRouteGeoJson(data.routeGeoJson);
  };

  return (
    <div>
      <div style={{ position: 'absolute', zIndex: 10, background: 'white', padding: 10 }}>
        <h2>Contacts</h2>
        <ul>
          {contacts.map(c => (
            <li key={c._id}>
              <label>
                <input
                  type="checkbox"
                  checked={selected.includes(c._id)}
                  onChange={() => handleSelect(c._id)}
                />
                {c.name} ({c.address})
              </label>
            </li>
          ))}
        </ul>
        <button onClick={planRoute}>Plan Route</button>
      </div>
      <MapGL
        {...viewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onViewportChange={setViewport}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {contacts.map((contact, idx) =>
          contact.coordinates ? (
            <Marker key={contact._id} latitude={contact.coordinates.lat} longitude={contact.coordinates.lng}>
              <div style={{ background: 'red', borderRadius: '50%', width: 10, height: 10 }} />
            </Marker>
          ) : null
        )}
        {routeGeoJson && (
          <Source id="route" type="geojson" data={{ type: "Feature", geometry: routeGeoJson }}>
            <Layer
              id="route"
              type="line"
              paint={{ 'line-color': '#007cbf', 'line-width': 4 }}
            />
          </Source>
        )}
      </MapGL>
    </div>
  );
}

export default App;