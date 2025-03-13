import './App.css'
import * as React from 'react';
import Map, { useMap, Marker } from 'react-map-gl/mapbox';
import {MapProvider} from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import Button from '@mui/material/Button';
import img from './assets/language-icon.png';
import mapboxgl from 'mapbox-gl';

/**
 * Main application component that renders an interactive Mapbox map.
 * Implements a custom marker with a popup functionality centered in Hamilton, Ontario.
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  // Reference to control the marker's popup functionality
  const markerRef = React.useRef<mapboxgl.Marker>(null);
  // Mapbox access token retrieved from environment variables
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  // Create a memoized popup instance that appears below the marker
  // Offset ensures the popup appears below the marker without overlapping
  const popup = React.useMemo(() => {
    return new mapboxgl.Popup({closeButton: false, anchor: 'bottom', offset: [0, -30]}).setText('Hello world!');
  }, []);

  // Toggle popup visibility when marker is clicked
  const togglePopup = React.useCallback(() => {
    markerRef.current?.togglePopup();
  }, []);

  return(
    <MapProvider>
      {/* Main map component with initial view centered on Hamilton, Ontario */}
      <Map id="myMapA" mapboxAccessToken={accessToken}
        initialViewState={{
          longitude: -79.87,
          latitude: 43.23,
          zoom: 12
        }}
        style={{width: '100%', height: '100%'}}
        mapStyle="mapbox://styles/gabrielupcott/cm86hi45r005101s4giu82g2f">
              {/* Custom marker with click interaction and popup functionality */}
              <Marker longitude={-79.87} latitude={43.23} onClick={togglePopup} color="red" popup={popup} ref={markerRef}>
                <img style={{width: '50px', height: '50px', cursor: 'pointer'}} src={img} alt="language marker" />
              </Marker>

      </Map>
      <NavigateButton />
    </MapProvider>
  )
}

/**
 * Navigation button component that provides a way to reset the map view.
 * When clicked, smoothly animates the map to downtown Toronto coordinates.
 * @returns {JSX.Element} A button component positioned in the top-left corner of the map
 */
function NavigateButton() {
  // Access the map instance using the useMap hook
  const {myMapA} = useMap();

  // Handler for button click that animates the map to a new location
  const onClick = () => {
    if (myMapA) {
      // Animate to downtown Toronto coordinates over 2 seconds
      myMapA.flyTo({
        center: [-79.381829, 43.653571],
        duration: 2000,
        essential: true
      });
    }
    else {
      console.log('No map instance');
    }
  };

  return <Button style={{position: 'absolute', top: 10, left: 10}} onClick={onClick}>Reset View</Button>;
}

export default App;
