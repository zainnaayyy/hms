import * as React from 'react';
import Box from '@material-ui/core/Box';
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
import CircularProgress from "@material-ui/core/CircularProgress";
import Countdown from 'react-countdown';
import axios from 'axios';
import { Button, makeStyles } from '@material-ui/core';
import moment from 'moment';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': { borderBottom: 'unset' }
  },
}));


function Row(props) {
  const { root } = useStyles(props);
  const { row, type, updateRes } = props;
  console.log("zain",row)
  const [open, setOpen] = React.useState(false);
  const [hotelInfo, setHotelInfo] = React.useState(false);
  const [customerInfo, setCustomerInfo] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const fetchUsersInfo = async (hotelID, customerID) => {
    setOpen(!open);
    try {
      setLoading(true);
      const hotelRes = await axios.get("hotels/" + hotelID);
      const customerRes = await axios.get("customers/" + customerID);
      setHotelInfo(hotelRes.data.data);
      setCustomerInfo(customerRes.data.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const onApprove = () => {
    updateRes(row._id)
  }

  return (
    <React.Fragment>
      <TableRow className={root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => fetchUsersInfo(row.hotelID, row.customerID)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.startDate}
        </TableCell>
        <TableCell align="center">{row.venue.formattedAddress}</TableCell>
        <TableCell align="center">{type === "Active" ? "Ongoing" : row.status}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Typography variant="h6" gutterBottom component="div">
                Details:
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Hotel</TableCell>
                    <TableCell>Hourly Charges</TableCell>
                    <TableCell>Time Left</TableCell>
                    {type === "Upcoming" && <TableCell>Actions</TableCell>}
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
                          {"$" + hotelInfo.hourlyRate.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Countdown date={Date.now() + moment(row.startDate, "MMMM Do YYYY, h:mm:ss A").diff(moment())} />
                        </TableCell>
                        {type === "Upcoming" && <TableCell>
                          <Button className="border border-black bg-primary text-white" onClick={() => onApprove()}>Approve</Button>
                        </TableCell>}
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

export default function CollapsibleTable({ reservations, type, mb, updateRes }) {
  return (
    <TableContainer className={mb ? "mb-5" : ""} component={Paper}>
      <Typography variant="h6" className="d-flex align-items-center justify-content-center py-3 table-title shadow-sm" fontSize={22}><span className="text-capitalize">{type} </span>&nbsp; Reservations</Typography>
      <Table aria-label="collapsible table">
        {
          reservations?.length ?
            <>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Reservation Time</TableCell>
                  <TableCell align="center">Reservation Place</TableCell>
                  <TableCell align="center">Reservation Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.map((reservation) => (
                  <Row key={reservation._id} row={reservation} type={type} updateRes={(id) => {
                    updateRes && updateRes(id)
                  }} />
                ))}
              </TableBody>
            </> :
            <Box className="d-flex justify-content-center align-items-center p-3">No {type} reservations found! {type == "Past" ? "You have not attended any reservations yet." : ""}</Box>
        }
      </Table>
    </TableContainer>
  );
}
