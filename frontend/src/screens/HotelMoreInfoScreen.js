import MultipleValueTextInput from 'react-multivalue-text-input';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';

import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import axios from 'axios';
import { withRouter } from 'react-router';

const useStyles = makeStyles((theme) => ({
  label: {
    marginTop: -22,
    paddingLeft: 10,
    fontSize: 20,
    fontWeight: 400,
    color: '#011627'
  }
}));

const HotelMoreInfoScreen = (props) => {
  const { hotelName, _id, categoryID } = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : false;

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const categories = [
    { value: "hotels", label: "Hotels", id: 1 },
    { value: "motels", label: "Motels", id: 2 },
    { value: "resorts", label: "Resorts", id: 3 },
    { value: "inns", label: "Inns", id: 4 },
    { value: "all suites", label: "All Suites", id: 5 },
    { value: "extended stay hotels", label: "Extended Stay Hotels", id: 6 },
    { value: "micro hotels", label: "Micro Hotels", id: 7 },
    { value: "heritage hotels", label: "Heritage Hotels", id: 8 },
    { value: "one star", label: "One Star", id: 9 },
    { value: "two star", label: "Two Star", id: 10 },
    { value: "three star", label: "Three Star", id: 11 },
    { value: "four star", label: "Four Star", id: 12 },
    { value: "five star", label: "Five Star", id: 13 },
    { value: "budget hotels", label: "Budget Hotels", id: 14 },
  ];
  const [category, setCategory] = useState('hotels');

  useEffect(() => {
    if (!_id) {
      props.history.push('/hotels/signup');
    } else if (categoryID) {
      props.history.push('/hotels/dashboard/profile');
    }
  }, [props.history, _id]);

  const handleChange = (event) => {
    setCategory(event.target.value || '');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  const onAmenityAdded = (amenity, allAmenities) => {
    setAmenities(allAmenities);
  };

  const onAmenityDeleted = (amenity, allAmenities) => {
    setAmenities(allAmenities);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let categoryID;
    categories.forEach((c) => {
      if (c.value === category)
        categoryID = c.id;
    });

    if (category && categoryID && amenities.length) {
      //posting amenities information to amenities and offerings api first
      amenities.forEach(async (amenityName) => {

        try {
          setLoading(true);
          //posting to amenities
          await axios.post("/amenities", { title: amenityName });
          //posting to offers api now to associate amenities with hotels
          await axios.post('/offers', {
            hotelID: _id,
            amenity: amenityName
          });
        } catch (err) {
          setLoading(false);
          setError(err.message);
        }

      });

      //updating hotel with category name and categoryID info
      const hotelInfo = {
        categoryName: category,
        categoryID: categoryID
      };

      try {
        setLoading(true);
        const res = await axios.put(`hotels/${_id}`, hotelInfo);
        const data = res.data.data;
        if (data) {
          localStorage.setItem('userInfo', JSON.stringify(data));
          props.history.push('/hotels/dashboard/profile');
          setLoading(false);
        }

      } catch (err) {
        setLoading(false);
        setError(err.message);
      }
    }
  };

  return (
    <div className="h-75">
      <Box className="extra-info-text bg-info h-25 d-flex align-items-center justify-content-center mb-5">Hi, {hotelName}! We would need some extra info from you to finalize your hotel registration process.</Box>
      <Box className="text-center my-5"><a className="btn btn-primary btn-lg" onClick={handleClickOpen}>Click Here & Fill in the Information</a></Box>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose} fullWidth >
        <DialogTitle>Fill the details please!</DialogTitle>
        {loading && <LoadingBox msg={`Uploading your data! Please wait...`} />}
        {error && <MessageBox msg={error} variant='danger'></MessageBox>}
        <DialogContent>
          <Box component="form">
            <FormControl variant='standard' fullWidth margin='normal' required>
              <InputLabel shrink className={classes.label} variant="standard" htmlFor="demo-dialog-native">Which category your Hotel belongs to ?</InputLabel>
              <Select
                native
                value={category}
                onChange={handleChange}
                input={<OutlinedInput label="Age" id="demo-dialog-native" />}
              >
                {
                  categories.map((c) => {
                    return (
                      <option value={c.value} key={c.id} data-id={c.id}>{c.label}</option>
                    );
                  })
                }
              </Select>
            </FormControl>
            <FormControl className="mt-2" fullWidth margin='normal' required variant='standard'>
              <MultipleValueTextInput
                className={amenities.length > 5 ? "multiple-value-text-input" : ""}
                disabled={amenities.length > 5 ? true : false}
                onItemAdded={onAmenityAdded}
                onItemDeleted={onAmenityDeleted}
                label="Which amenities would you like to offering on our platform ?"
                name="item-input"
                placeholder={amenities.length > 5 ? "No more than 3 amenities" : "Enter whatever amenities you want; separate them with COMMA or ENTER."}
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div >
  );
};

export default withRouter(HotelMoreInfoScreen);