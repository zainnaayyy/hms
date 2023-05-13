import { Box, Typography } from '@material-ui/core';
import axios from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router';
import Content from '../components/Content';

function ReservationRoom({ reservation }) {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const joinReservationHandler = async () => {
    if (reservation?.length) {
      //get customer and hotel info
      try {
        setLoading(true);
        const reservationInfo = reservation[0];
        const { hotelID, customerID } = reservationInfo;
        const hotelRes = await axios.get("hotels/" + hotelID);
        const customerRes = await axios.get("customers/" + customerID);
        const hotelInfo = hotelRes.data.data;
        const customerInfo = customerRes.data.data;
        setLoading(false);
        history.push({
          pathname: '/room',
          state: {
            hotelInfo,
            customerInfo,
            reservationInfo
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" minHeight={405} className={reservation ? "bg-black" : ""}>
      <Content>
        {
          reservation ?
            <Box className="d-flex justify-content-center align-items-center flex-column">
              <Typography className="mb-3" variant='h3' align='center' sx={{ py: 4 }}>
                <span className="text-capitalize text-info font-weight-bold">Welcome!</span>
              </Typography>
              <Typography variant="subtitle1" className="text-white" align='center'>
                You have {reservation.length} ongoing reservation in your virtual reservation room right now.
              </Typography>
              <Typography variant="subtitle1" className="text-white" align='center'>
                Please click the button below and join the reservation <span className="text-info font-weight-bold">NOW!</span>
              </Typography>
              <Box my={4}>
                <button onClick={joinReservationHandler} className="btn btn-info btn-block mt-3">JOIN NOW</button>
              </Box>
            </Box> :
            <Box fontSize={25} minHeight={350} className="d-flex align-items-center justify-content-center">Silence here. No active reservation found!</Box>
        }
      </Content>
    </Box>
  );
}

export default ReservationRoom;
