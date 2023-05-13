import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import axios from "axios";

import ReactTimeslotCalendar from "react-timeslot-calendar";
import moment from "moment";
import { useEffect, useState } from 'react';

export default function FirstStep({ activeStep, setActiveStep, setStartDate, startDate, setEndDate, hotelID, customerID }) {
  const [filledSlots, setFilledSlots] = useState([]);

  useEffect(() => {
    const getFilledSlots = async () => {
      try {
        const hotelSlots = await axios.get("reservations/slots/" + hotelID);
        const slotsToDisableHotel = hotelSlots.data.map(reservation => ({ ...reservation, format: 'MMMM Do YYYY, h:mm:ss A' }));

        const customerSlots = await axios.get("reservations/slots/" + customerID);
        const slotsToDisableCustomer = customerSlots.data.map(reservation => ({ ...reservation, format: 'MMMM Do YYYY, h:mm:ss A' }));

        setFilledSlots([...slotsToDisableHotel, ...slotsToDisableCustomer]);
      } catch (err) {
        console.log(err);
      }
    };
    getFilledSlots();
  }, [hotelID]);

  return (
    <Box mt={4}>
      <ReactTimeslotCalendar
        disabledTimeslots={filledSlots}
        initialDate={moment().format()}
        timeslots={[
          ['9', '12'],
          ['12', '15'],
          ['15', '18'],
        ]}
        onSelectTimeslot={(allSelectedTimeslots, lastSelectedTimeslot) => {
          setStartDate(moment(lastSelectedTimeslot.startDate._d).format("MMMM Do YYYY, h:mm:ss A"));
          setEndDate(moment(lastSelectedTimeslot.endDate._d).format("MMMM Do YYYY, h:mm:ss A"));
          // 'April 30th 2017, 12:00:00 AM',
        }}
      />

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant='contained'
          className="mt-3 mx-3 text-white"
          color='secondary'
          onClick={() => {
            setActiveStep(activeStep + 1);
          }}
          disabled={startDate ? false : true}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
