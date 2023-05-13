import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {
  useHistory,
  Switch,
  Route
} from "react-router-dom";
import AppBarAndDrawer from '../components/hotel/AppBarAndDrawer';
import HotelProfileInfo from '../screens/HotelProfileInfo';
import HotelDashboardScreen from '../screens/HotelDashboardScreen';
import ReservationScreen from '../screens/ReservationScreen';
import TransactionScreen from '../screens/TransactionScreen';
import HotelMapScreen from '../screens/HotelMapScreen';
import LogoutScreen from '../screens/LogoutScreen';
import ReservationRoom from '../screens/ReservationRoom';
import moment from 'moment';
import axios from 'axios';

function HotelDashboard({ socket }) {

  const [eventMounted, setEventMounted] = useState(false);

  useEffect(() => {
    if (socket && !eventMounted) {
      socket.on("getMessage", (data) => {
        //on getting message notify user
        console.log(data);
        toast(`${data.senderName}: ${data.message}`);
      });
      setEventMounted(true);
    }
  }, [socket, eventMounted]);

  const { _id, categoryID } = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : false;

  const [activeReservation, setActiveReservation] = useState([]);

  const history = useHistory();

  useEffect(() => {
    if (!_id) {
      history.push('/hotels/signup');
    } else if (!categoryID) {
      history.push('/hotels/moreinfo');
    }
  }, [history, categoryID, _id]);

  useEffect(() => {
    if (_id) {
      const getAllReservations = async () => {
        try {
          const res = await axios.get("reservations?userID=" + _id);
          const allReservations = res.data;

          const activeOnes = [];
          allReservations.forEach((reservation) => {
            //check if reservation is a pending one but is an active one (no need to update the DB simply push it into active reservations array and mark it as active on frontend)
            if (reservation.status === 'pending' && moment(reservation.startDate, "MMMM Do YYYY, h:mm:ss A").diff(moment()) < 5000 && moment(reservation.endDate, "MMMM Do YYYY, h:mm:ss A").diff(moment()) >= 5000) {
              activeOnes.push(reservation);
            }
          });
          setActiveReservation(activeOnes);
        } catch (err) {
          console.log(err);
        }
      };
      getAllReservations();
    } else {
      history.push('/signin');
    }
  }, [_id, history]);

  return (
    <div>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
      />
      <AppBarAndDrawer socket={socket} activeReservation={activeReservation.length ? activeReservation.length : false} />
      <Switch>
        <Route exact path="/hotels/dashboard/profile">
          <HotelProfileInfo />
        </Route>
        <Route path="/hotels/dashboard/dashboard">
          <HotelDashboardScreen />
        </Route>
        <Route path="/hotels/dashboard/map">
          <HotelMapScreen _id={_id} />
        </Route>
        <Route exact path="/hotels/dashboard/reservations">
          <ReservationScreen />
        </Route>
        <Route exact path="/hotels/dashboard/reservationroom">
          <ReservationRoom reservation={activeReservation.length ? activeReservation : false} />
        </Route>
        <Route exact path="/hotels/dashboard/transactions">
          <TransactionScreen type="hotel" />
        </Route>
        <Route path="/hotels/dashboard/logout">
          <LogoutScreen />
        </Route>
      </Switch>
    </div>

  );
}

export default HotelDashboard;
