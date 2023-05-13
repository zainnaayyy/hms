
import { styled } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import Box from '@material-ui/core/Box';

import Typography from '@material-ui/core/Typography';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { useState } from 'react';
import axios from 'axios';
import { Slider } from '@material-ui/core';

const drawerBleeding = 56;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor:
    theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#fff'
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[400],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

function SwipeableEdgeDrawer(props) {
  const { hotelIDs, setHotelIDs, setFilterApplied } = props;
  const [open, setOpen] = useState(false);
  const [distance, setDistance] = useState(3000);

  const getNearbyHotels = () => {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const currentUserLat = position.coords.latitude;
        const currentUserLng = position.coords.longitude;

        //filter all hotels and get new list of nearby hotels by default the distance inside which to find hotels would be 3000 in meters i:e 3 kilometers

        if (currentUserLat && currentUserLng) {

          const payload = {
            hotelIDs,
            latitude: currentUserLat,
            longitude: currentUserLng,
            distance
          };

          try {
            const res = await axios.post('locations/radius', payload);
            const filteredHotelIDs = res.data.data;
            if (filteredHotelIDs?.length) {
              setHotelIDs(filteredHotelIDs);
              setFilterApplied(true);
              setOpen(false);
            } else {
              setHotelIDs([]);
            }
          } catch (err) {
            console.log(err.message);
          }
        }
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleDistanceChange = (event, distance) => {
    if (typeof distance === 'number') {
      setDistance(distance);
    }
  };

  return (
    <Root>

      <Box sx={{ textAlign: 'center', pt: 1 }}>
        <button className="btn btn-block btn-info font-weight-bold" onClick={toggleDrawer(true)}>Apply Filters <i class="fas fa-filter"></i></button>
      </Box>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <Typography className="px-4 pt-4" sx={{ p: 2, color: 'text.secondary' }}>{hotelIDs?.length} Results</Typography>
        </StyledBox>
        <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: '100%',
            overflow: 'auto',
          }}
        >
          <Box pb={3} textAlign='center'>
            <Box width="80%" margin="auto" marginY={3}>
              <Typography id="non-linear-slider" gutterBottom>
                Distance: Within {distance} meters
              </Typography>
              <Slider
                size="medium"
                step={100}
                marks
                min={0}
                valueLabelDisplay="auto"
                max={30000}
                value={distance}
                onChange={handleDistanceChange}
                color="secondary"
              />
            </Box>
            <button type="button" class="btn btn-info" onClick={getNearbyHotels}>        <i className="fas fa-map-marker-alt"></i> &nbsp;Locate Hotels Only Near Me!</button>
          </Box>
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}

export default SwipeableEdgeDrawer;
