import { makeStyles } from '@material-ui/core';
import CircularProgress from "@material-ui/core/CircularProgress";
import Rating from '@material-ui/lab/Rating';
import { useEffect, useState } from 'react';
import SummaryCard from '../components/Card/SummaryCard';
import Content from '../components/Content';
import axios from 'axios';
import moment from 'moment';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  headerContainer: {
    position: "relative",
    height: "100px",
  },
  header: {
    display: "flex",
    position: "absolute",
    width: "calc(100%)",
    top: "-70px",
    alignItems: "flex-end",
    "& > *": {
      margin: `${theme.spacing(3)}px ${theme.spacing(1)}px`,
    },
  },
  spacer: {
    flexGrow: "1",
  },
  avatar: {
    border: `3px solid white`,
    width: theme.spacing(13),
    height: theme.spacing(13),
    boxShadow: theme.shadows[3],
  },
  actionGroup: {
    display: "flex",
    width: "330px",
    justifyContent: "space-between",
    marginRight: 0,
  },
  summaryCards: {
    display: "flex",
    flexWrap: "wrap",
  },
  summaryCard: {
    margin: theme.spacing(1),
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  tripCard: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));

export default function HotelDashboardScreen() {
  const { categoryName, hourlyRate, experience, _id } = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : false;
  const history = useHistory();
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [pendingReservations, setPendingReservations] = useState([]);
  const [activeReservations, setActiveReservations] = useState([]);
  const [attendedReservations, setAttendedReservations] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

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
    if (loading) {
      return (
        <Content>
          <CircularProgress />
        </Content>
      );
    }
  }, [loading]);

  useEffect(() => {
    if (_id) {
      const getInfo = async () => {
        try {
          const transactions = await axios.get("transactions?userID=" + _id);
          const allTransactions = transactions.data;
          setTotalEarnings(allTransactions.reduce((n, { amount }) => n + amount, 0));
          const feedbacks = await axios.get("feedbacks/" + _id);
          if (feedbacks.data.length)
            setAverageRating(feedbacks.data.reduce((n, { rating }) => n + rating, 0) / feedbacks.data.length);
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
        } catch (err) {
          console.log(err);
        }
      };
      getInfo();
    } else {
      history.push('/signin');
    }
  }, [_id]);

  return (
    <Content>
      <div className={classes.summaryCards}>
        <SummaryCard title={"Hotel Of"} value={categoryName} />
        <SummaryCard title={"Total Earnings"} value={"$" + totalEarnings?.toFixed(2)} />
        <SummaryCard title={"Hourly Rate"} value={"$" + hourlyRate} />
        <SummaryCard title={"Experience"} value={experience + " years"} />
        <SummaryCard title={"Active Reservations"} value={activeReservations.length} />
        <SummaryCard title={"Upcoming Reservations"} value={pendingReservations.length} crud={true}/>
        <SummaryCard title={"Attended Reservations"} value={attendedReservations.length} />
        <SummaryCard title={"Total Reservations"} value={reservations.length} />
        <SummaryCard title={"Average Rating"} value={<Rating name="read-only" value={averageRating} precision={0.5} readOnly />} />
      </div>
      <div className="mb-4"></div>

    </Content>
  );
}