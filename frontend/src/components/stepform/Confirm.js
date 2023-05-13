import { Box, CircularProgress } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useHistory } from 'react-router';
import { useState } from 'react';

export default function Confirm({ activeStep, setActiveStep, startDate, endDate, venue, hotelID, customerID, setVenue }) {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async () => {
    //create new reservation here
    if (customerID && hotelID && startDate && endDate && venue) {
      // for a new reservation we need
      /*
      hotelID
      customerID
      startDate
      endDate
      venue
      */
      const reqBody = {
        latitude: venue.latitude,
        longitude: venue.longitude,
        customerID,
        hotelID,
        startDate,
        endDate
      };

      try {
        setLoading(true);
        const res = await axios.post('reservations', reqBody);
        const reservationCreated = res.data.success;
        if (reservationCreated) {
          // Show last component or success message
          setLoading(false);
          setVenue(res.data.data.venue.formattedAddress);
          setActiveStep(activeStep + 1);
        }

      } catch (err) {
        console.log(err.message);
      }
    } else if (!customerID) {
      history.push('/signin');
    }

  };

  return (
    <>
      {
        loading && <Box className="loading-modal">
          <CircularProgress />
        </Box>
      }
      <List disablePadding>
        <ListItem>
          <ListItemText primary='Reservation Date & Time' secondary={`From ${startDate} to ${endDate}`} />
        </ListItem>

        <Divider />

        <ListItem>
          <ListItemText primary='Reservation Place' secondary={'Latitude: ' + venue.latitude + ' Longitude: ' + venue.longitude} />
        </ListItem>

        <Divider />
      </List>

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button
          variant='contained'
          className="mx-3 "
          color='primary'
          onClick={() => {
            setActiveStep(activeStep - 1);
          }}
        >
          Back
        </Button>
        <button
          className='btn-success btn mx-3'
          onClick={handleSubmit}>
          Confirm & Continue
        </button>
      </Box>
    </>
  );
}
