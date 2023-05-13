import { Box, CircularProgress } from '@material-ui/core';
import React from 'react';
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import StyledButton from '../components/controls/StyledButton';
import axios from 'axios';

import MessageBox from '../components/MessageBox';

mapboxgl.accessToken = 'pk.eyJ1IjoibWlseWFzayIsImEiOiJja3Z4cmtpeTYxeTFqMnZtOXF4MXVlaHRqIn0.v07SNE-4A3eTY_MYZCOMwQ';

function HotelMapScreen({ _id }) {

  const [userLocation, setUserLocation] = useState(localStorage.getItem('userLocation') ? JSON.parse(localStorage.getItem('userLocation')) : false);

  const [longitude, latitude] = userLocation ? userLocation.coordinates : [false, false];

  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [lat, setLat] = useState(latitude || 24.8607);
  const [lng, setLng] = useState(longitude || 67.0011);
  const [zoom, setZoom] = useState(9);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getLocation = async () => {


      try {
        if (!latitude && !longitude) {
          //if user data is not in local storage then look for his current location in the mongo atlas cluster (api get location of a hotelID)
          const res = await axios.get("locations/" + _id);
          localStorage.setItem('userLocation', JSON.stringify(res.data.data));
          setUserLocation(res.data.data);
          setLng(res.data.data.coordinates[0].toFixed(4));
          setLat(res.data.data.coordinates[1].toFixed(4));

          map.current.flyTo({
            center: [
              res.data.data.coordinates[0].toFixed(4),
              res.data.data.coordinates[1].toFixed(4)
            ],
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
          });

          setZoom(map.current.getZoom().toFixed(12));
          // marker.current.setLngLat([map.current.getCenter().lng.toFixed(4), map.current.getCenter().lat.toFixed(4)]);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getLocation();
  }, [_id, latitude, longitude]);

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

  const saveLocationHandler = async () => {
    //form submission logic here
    const location = {
      latitude: lat,
      longitude: lng,
      hotelID: _id
    };

    try {
      setLoading(true);
      const res = await axios.post("locations", location);
      const data = res.data.data;
      if (data) {
        localStorage.setItem('userLocation', JSON.stringify(data));
        setUserLocation(data);
        setLoading(false);
      }

    } catch (err) {
      setLoading(false);
      setError(err.message);
    }

  };

  return (
    <Box className="minus-240 p-1 mapbox">
      <Box className="map-sidebar">
        Latitude: {lat} | Longitude: {lng} | Zoom: {zoom}
      </Box>
      <Box ref={mapContainer} className="map-container" />
      {
        error ?
          <Box className="save-location-button">
            <MessageBox msg={error} variant='danger'></MessageBox>
          </Box> :
          null
      }
      {
        loading ?
          <Box className="save-location-button">
            <CircularProgress />
          </Box> :
          !userLocation ?
            <Box className="save-location-button">
              <StyledButton
                responsive
                variant="contained"
                color="secondary"
                type="submit"
                size="large"
                style={{ color: '#fff' }}
                onClick={saveLocationHandler}>
                Save current location pinned on map as my location
              </StyledButton>
            </Box> :
            null
      }
    </Box>
  );
}

export default HotelMapScreen;
