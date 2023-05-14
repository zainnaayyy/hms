import React, { useState } from 'react';
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
import { styled } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': { borderBottom: 'unset' }
  },
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function Row(props) {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const cat = user.category
  const { root } = useStyles(props);
  const { row, type, updateRes } = props;
  console.log("zain", row)
  const [open, setOpen] = React.useState(false);
  const [hotelInfo, setHotelInfo] = React.useState(false);
  const [customerInfo, setCustomerInfo] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [extendedDate, setExtendedDate] = useState(dayjs(new Date()));

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

  function BootstrapDialogTitle(props: DialogTitleProps) {
    const { children, onClose, ...other } = props;
  
    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {/* {children} */}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  }

  const onApprove = (bool) => {
    updateRes(row._id, bool)
  }

  const [openModal, setOpenModal] = useState(false);

  const handleClickOpen = () => {
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };

  const handleExtend = (id) => {
    console.log('zain :>> ', extendedDate.format('YYYY-MM-DDTHH:mm:ss'));
    const eDate = extendedDate.format('YYYY-MM-DDTHH:mm:ss')
    const reservationDateExtend = {
      endDate: eDate
    };

    try {
      axios.put(`reservations/${id}`, reservationDateExtend).then((response) => {
        if(response.status === 200) {
          toast.success("Reservation updated successfully", {
            position: 'top-right'
          })
          handleClose()
        } else {
          toast.error("Reservation not updated.", {
            position: "top-right"
          })
          handleClose()
        }
      });
    } catch (err) {
      console.log(err.message);
    }
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
        <TableCell align="center">
          {type === "Active" ? "Ongoing" : row.status}
        </TableCell>
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
                    {cat != "customers" && <TableCell>Actions</TableCell>}
                  </TableRow>
                </TableHead>
                {loading ? (
                  <Box className="d-flex p-2 justify-content-center align-items-center">
                    <CircularProgress size={20} />
                  </Box>
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {customerInfo.firstName} {customerInfo.lastName}
                      </TableCell>
                      <TableCell>
                        <Link
                          to={{
                            pathname: "/hotels/profile",
                            hotelInfo,
                          }}
                          className="text-info"
                        >
                          {hotelInfo?.hotelName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {"$" + hotelInfo.hourlyRate.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Countdown
                          date={
                            Date.now() +
                            moment(
                              row.startDate,
                              "MMMM Do YYYY, h:mm:ss A"
                            ).diff(moment())
                          }
                        />
                      </TableCell>
                      {cat != "customers" && (
                        <TableCell>
                          {row.status === "pending" && (
                            <>
                              <Button
                                className="border border-black bg-success text-white"
                                onClick={() => onApprove(true)}
                              >
                                Approve
                              </Button>
                              <Button
                                className="border border-black bg-danger text-white"
                                onClick={() => onApprove(false)}
                              >
                                Decline
                              </Button>
                            </>
                          )}
                          {row?.status === 'attended' && (
                            <div>
                              <Button
                                className="border border-black bg-primary text-white"
                                onClick={() => handleClickOpen()}
                              >
                                Extend
                              </Button>
                              <BootstrapDialog
                                onClose={handleClose}
                                aria-labelledby="customized-dialog-title"
                                open={openModal}
                              >
                                <BootstrapDialogTitle
                                  id="customized-dialog-title"
                                  onClose={handleClose}
                                >
                                  Modal title
                                </BootstrapDialogTitle>
                                <DialogContent dividers>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <StaticDateTimePicker value={extendedDate} disablePast onChange={(val) => {setExtendedDate(val)}} defaultValue={dayjs(new Date())} />
                                </LocalizationProvider>
                                </DialogContent>
                                <DialogActions>
                                  <Button autoFocus onClick={() => handleExtend(row?._id)}>
                                    Save
                                  </Button>
                                </DialogActions>
                              </BootstrapDialog>
                            </div>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  </TableBody>
                )}
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
                  <Row key={reservation._id} row={reservation} type={type} updateRes={(id, bool) => {
                    updateRes && updateRes(id, bool)
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
