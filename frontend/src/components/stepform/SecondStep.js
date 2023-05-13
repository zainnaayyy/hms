import { Box } from '@material-ui/core';
import React from 'react';
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Button from '@material-ui/core/Button';

mapboxgl.accessToken = 'pk.eyJ1IjoibWlseWFzayIsImEiOiJja3Z4cmtpeTYxeTFqMnZtOXF4MXVlaHRqIn0.v07SNE-4A3eTY_MYZCOMwQ';

export default function SecondStep({ activeStep, setActiveStep, setVenue, venue }) {

  const [longitude, latitude] = venue ? [venue.longitude, venue.latitude] : [false, false];
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [lat, setLat] = useState(latitude || 24.8607);
  const [lng, setLng] = useState(longitude || 67.0011);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
    if (map.current) {
      //adding marker
      marker.current = new mapboxgl.Marker({
        draggable: false
      })
        .setLngLat([lng, lat])
        .addTo(map.current);

      //adding current location control
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          // When active the map will receive updates to the device's location as it changes.
          trackUserLocation: true,
          // Draw an arrow next to the location dot to indicate which direction the device is heading.
          showUserHeading: true
        })
      );
    }
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
      marker.current.setLngLat([map.current.getCenter().lng.toFixed(4), map.current.getCenter().lat.toFixed(4)]);
    });
  });

  const capturePinnedLocation = async () => {
    //form submission logic here
    const location = {
      latitude: lat,
      longitude: lng
    };

    setVenue(location);

  };

  return (
    <>
      <Box className="p-4 mapbox">
        <Box className="map-sidebar map-sidebar--scheduler">
          Latitude: {lat} | Longitude: {lng} | Zoom: {zoom}
        </Box>
        <Box ref={mapContainer} className="map-container" />

        <Box className="save-location-button save-location-button--scheduler">
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            size="large"
            style={{ color: '#fff' }}
            onClick={capturePinnedLocation}
          >
            I would like to meet on the currently pinned location
          </Button>
        </Box>

      </Box>
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button
          variant='contained'
          className="mt-3 mx-3 "
          color='primary'
          onClick={() => {
            setActiveStep(activeStep - 1);
          }}
        >
          Back
        </Button>
        <Button
          variant='contained'
          className="mt-3 mx-3 text-white"
          color='secondary'
          onClick={() => {
            setActiveStep(activeStep + 1);
          }}
          disabled={venue?.latitude ? false : true}
        >
          Next
        </Button>
      </Box>
    </>
  );
}
