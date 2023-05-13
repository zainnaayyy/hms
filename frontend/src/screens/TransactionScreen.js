import { Box } from '@material-ui/core';
import CircularProgress from "@material-ui/core/CircularProgress";
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import moment from 'moment';

import Content from '../components/Content';
import axios from 'axios';
import * as React from 'react';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': { borderBottom: 'unset' }
  },
}));


function Row(props) {
  const { root } = useStyles(props);
  const { row } = props;

  const [open, setOpen] = React.useState(false);
  const [hotelInfo, setHotelInfo] = React.useState(false);
  const [customerInfo, setCustomerInfo] = React.useState(false);
  const [reservationInfo, setReservationInfo] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const fetchInfo = async (hotelID, customerID, reservationID) => {
    setOpen(!open);
    try {
      setLoading(true);
      const hotelRes = await axios.get("hotels/" + hotelID);
      const customerRes = await axios.get("customers/" + customerID);
      const reservationRes = await axios.get("reservations/" + reservationID);
      setHotelInfo(hotelRes.data.data);
      setCustomerInfo(customerRes.data.data);
      setReservationInfo(reservationRes.data.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <TableRow className={root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => fetchInfo(row.hotelID, row.customerID, row.reservationID)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {moment(row.createdAt).format("MMMM Do YYYY, h:mm:ss A")}
        </TableCell>
        <TableCell align="center">${row.amount.toFixed(2)}</TableCell>
        <TableCell align="center">{new Date(row.reservationDuration * 1000).toISOString().substr(11, 8)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Typography variant="h6" gutterBottom component="div">
                Transaction For Reservation:
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Hotel</TableCell>
                    <TableCell>Reservation Date</TableCell>
                    <TableCell>Reservation Place</TableCell>
                  </TableRow>
                </TableHead>
                {
                  loading ?
                    <Box className="d-flex p-2 justify-content-center align-items-center">
                      <CircularProgress size={20} />
                    </Box>
                    :
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {customerInfo.firstName} {customerInfo.lastName}
                        </TableCell>
                        <TableCell><Link to={{
                          pathname: "/hotels/profile",
                          hotelInfo
                        }} className="text-info">{hotelInfo?.hotelName}</Link></TableCell>
                        <TableCell>
                          {reservationInfo.startDate}
                        </TableCell>
                        <TableCell>
                          {reservationInfo.venue.formattedAddress}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                }
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function CollapsibleTable({ transactions, type }) {
  return (
    <TableContainer className="transactions-table" component={Paper}>
      <Typography variant="h6" className="d-flex align-items-center justify-content-center py-3 table-title shadow-sm" fontSize={22}>Transactions History</Typography>
      <Table aria-label="collapsible table">
        {
          transactions?.length ?
            <>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell align="left">Date & Time</TableCell>
                  <TableCell align="center">{type === 'hotel' ? "Earner" : "Spent"}</TableCell>
                  <TableCell align="center">Reservation Duration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <Row key={transaction._id} row={transaction} />
                ))}
              </TableBody>
            </> :
            <Box className="d-flex justify-content-center align-items-center p-3">
              No past transactions found!
            </Box>
        }
      </Table>
    </TableContainer>
  );
}

export default function TransactionScreen({ type }) {
  const { _id } = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : false;

  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (_id) {
      const getAllTransactions = async () => {
        try {
          const res = await axios.get("transactions?userID=" + _id);
          const allTransactions = res.data;

          setTransactions(allTransactions);
          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      };
      getAllTransactions();
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
              <CollapsibleTable mb={true} type={type} transactions={transactions} />
            </>
        }
      </Content>
    </div>
  );
}