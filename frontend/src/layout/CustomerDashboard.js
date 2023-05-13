import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {
  Switch,
  Route
} from "react-router-dom";
import { useHistory } from 'react-router';
import AppBarAndDrawer from '../components/customer/AppBarAndDrawer';
import LogoutScreen from '../screens/LogoutScreen';
import CustomerDashboardScreen from '../screens/CustomerDashboardScreen';
import CustomerProfileScreen from '../screens/CustomerProfileScreen';
import ReservationScreen from '../screens/ReservationScreen';
import ReservationRoom from '../screens/ReservationRoom';
import axios from 'axios';
import moment from 'moment';
import TransactionScreen from '../screens/TransactionScreen';

function CustomerDashboard({ socket }) {
  const { _id } = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : false;

  const [activeReservation, setActiveReservation] = useState([]);

  const history = useHistory();

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
        <Route exact path="/customers/dashboard/profile">
          <CustomerProfileScreen />
        </Route>
        <Route exact path="/customers/dashboard/dashboard">
          <CustomerDashboardScreen />
        </Route>
        <Route exact path="/customers/dashboard/reservations">
          <ReservationScreen />
        </Route>
        <Route exact path="/customers/dashboard/reservationroom">
          <ReservationRoom reservation={activeReservation.length ? activeReservation : false} />
        </Route>
        <Route exact path="/customers/dashboard/transactions">
          <TransactionScreen type="customer" />
        </Route>
        <Route path="/customers/dashboard/logout">
          <LogoutScreen />
        </Route>
      </Switch>
    </div>

  );
}

export default CustomerDashboard;
