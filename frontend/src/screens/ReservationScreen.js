import { Box, makeStyles } from '@material-ui/core';
import CircularProgress from "@material-ui/core/CircularProgress";
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';

import Content from '../components/Content';
import axios from 'axios';
import CollapsibleTable from '../components/CollapsibleTable';
import moment from 'moment';

export default function ReservationScreen() {
  const { _id } = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : false;

  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [pendingReservations, setPendingReservations] = useState([]);
  const [activeReservations, setActiveReservations] = useState([]);
  const [attendedReservations, setAttendedReservations] = useState([]);

  const updateReservationStatus = async (reservationID) => {
    //updating reservation status to attended
    const reservationStatus = {
      status: "attended"
    };

    try {
      await axios.put(`reservations/${reservationID}`, reservationStatus);
    } catch (err) {
      console.log(err.message);
    }

  };

  useEffect(() => {
    if (_id) {
      const getAllReservations = async () => {
        try {
          const res = await axios.get("reservations?userID=" + _id);
          const allReservations = res.data;
          const pendingOnes = [];
          const activeOnes = [];
          const attendedOnes = [];
          allReservations.forEach((reservation) => {
            //first check if reservation status is simply attended (no need to update the status as the reservation is a past reservation)
            if (reservation.status === 'attended') {
              attendedOnes.push(reservation);
            }
            //then check if a reservation is past reservation but status is still pending in the database, then push that reservation into attended ones and also update in the DB:
            else if (reservation.status === 'pending' && moment(reservation.endDate, "MMMM Do YYYY, h:mm:ss A").diff(moment()) < 5000) {
              attendedOnes.push(reservation);
              updateReservationStatus(reservation._id);
            }
            //now check if reservation is a pending one but is an active one (no need to update the DB simply push it into active reservations array and mark it as active on frontend)
            else if (reservation.status === 'pending' && moment(reservation.startDate, "MMMM Do YYYY, h:mm:ss A").diff(moment()) < 5000 && moment(reservation.endDate, "MMMM Do YYYY, h:mm:ss A").diff(moment()) >= 5000) {
              activeOnes.push(reservation);
            }
            //then check if reservation is pending check if the start time is farther than now
            else if (reservation.status === 'pending' && moment(reservation.startDate, "MMMM Do YYYY, h:mm:ss A").diff(moment()) >= 5000) {
              pendingOnes.push(reservation);
            }
          });
          setReservations(allReservations);
          setPendingReservations(pendingOnes);
          setActiveReservations(activeOnes);
          setAttendedReservations(attendedOnes);
          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      };
      getAllReservations();
    } else {
      history.push('/signin');
    }
  }, [_id]);

  return (
    <div>
      <Content>
        {
          loading ?
            <Box className="d-flex justify-content-center align-items-center" minHeight={320}>
              <CircularProgress />
            </Box>
            :
            <>
              <CollapsibleTable mb={true} type="Active" reservations={activeReservations} />
              <CollapsibleTable mb={true} type="Upcoming" reservations={pendingReservations} updateRes={(val) => updateReservationStatus(val)}/>
              <CollapsibleTable mb={false} type="Past" reservations={attendedReservations} />
            </>
        }
      </Content>
    </div>
  );
}