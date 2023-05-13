import { useEffect, useState, useRef } from 'react';
import { useHistory } from "react-router-dom";
import { Box, makeStyles, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';

import BgVideo from '../components/BgVideo';
import axios from 'axios';

const useStyles = makeStyles({
  root: {
    '& .MuiFilledInput-input': {
      color: '#fff'
    }
  },
});

export default function HomeScreen() {
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : false;
  const history = useHistory();

  const inputField = useRef(null);
  const classes = useStyles();
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (userInfo?.category === 'hotels') {
      history.push('/hotels/dashboard/profile');
    }
  }, []);


  const kPresentProbability = (a, n, k) => {
    let count = 0;

    for (let i = 0; i < n; i++)
      if (a[i] == k)
        count += 1;
    // find probability
    return count / n;
  };

  const autocomplete = async (e, value) => {
    setInputValue(value.trim());
    try {
      const res = await axios.get("amenities/search?term=" + inputValue);
      const titles = res.data.map((amenity) => amenity.title);

      setSuggestions(titles);
    } catch (err) {
      console.log(err);
    }
  };

  const searchHotels = async () => {

    if (inputValue.trim() === '')
      return;

    try {
      const res = await axios.get("offers?amenity=" + inputValue.trim());
      if (res.data.length) {
        const hotels = res.data.map((hotel) => hotel.hotelID);
        //first update the interest of the current customer if the customer if signed in

        if (userInfo) {
          //first calculate the most probable category the amenity belongs to

          let res = await axios.all(hotels.map(hotelID => axios.get("hotels/" + hotelID.trim())));

          const categories = res.map((r) => {
            const { categoryID } = r.data.data;
            return { categoryID };
          });

          const arrayOfCategories = categories.map(c => {
            return c.categoryID;
          });

          let listOfProbabilities = {};

          arrayOfCategories.forEach(item => {
            listOfProbabilities[item] = kPresentProbability(arrayOfCategories, arrayOfCategories.length, item);
          });

          const interestedCategory = Object.keys(listOfProbabilities).reduce((a, b) => listOfProbabilities[a] > listOfProbabilities[b] ? a : b);



          const customerID = userInfo?._id;

        }

        //now move to the results page
        history.push({
          pathname: '/results',
          state: {
            hotelIDs: hotels,
            term: inputValue
          }
        });
      }
    } catch (err) {
      console.log(err);
    }

  };

  return (
    <>
      <Box className="hero__container">
        <BgVideo title="hero" />
        <div className="home__inner">
          <div className="d-flex min-vh-100">
            <div className="m-auto w-50 text-center">
              <h1 className="mb-0 font-weight-normal text-center">Find Nearby Hotels.</h1>

              <h4 className="text-center font-weight-lighter font-smaller m-3 h5">Finding hotels near has become easy than ever!
                <span className="d-none d-md-inline-block">Tailor your searches to your needs. Decide how much you pay and your preferred amenities. The choice is yours.</span></h4>

              <div className="d-inline-block text-left">
                <small className="mb-1 d-inline-block">Search Hotels Near You</small>
                <Autocomplete
                  onInputChange={autocomplete}
                  autoComplete={true}
                  autoSelect
                  id="combo-box-demo"
                  openOnFocus={false}
                  noOptionsText=''
                  clearOnEscape
                  fullWidth
                  options={suggestions}
                  getOptionLabel={(option) => option}
                  style={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      inputRef={inputField}
                      value={inputValue}
                      className={classes.root}
                      InputProps={{
                        className: classes.root
                      }} {...params} autoFocus color="error" variant="filled" />
                  )}
                />
                <button onClick={searchHotels} className="btn btn-danger btn-block mt-3">FIND NEARBY HOTELS</button>
              </div>

            </div>
          </div>


          {
            !userInfo?.category ?
              <div className="row home__scroll">
                <div className="col col-md-6 m-auto text-center">
                  <a href="#getting-help" className="btn btn-outline-primary border-0 text-white home__btn">
                    <span className="home__scroll-text px-3 d-inline-block">See how personalized learning – in-person – can work for you</span>
                    <i className="fa fa-chevron-down home__scroll-icon"></i>
                  </a>
                </div>
              </div> :
              null
          }
        </div>
      </Box>

      {
        !userInfo?.category ?
          <>
            <div id="getting-help" className="row mt-5 mb-5">
              <div className="col">
                <h2 className="mb-0 text-dark font-weight-normal h1 text-center"> Getting help is easier than you think.</h2>
              </div>
            </div>

            <section className="how-it-works container">
              <div className="row text-center">
                <div className="col-md-4 mb-4">
                  <div className="circle-icon mb-4">
                    <h2 className="circle-icon__content">1</h2>
                  </div>
                  <div>
                    <h4 className="font-weight-normal text-dark">Hit the CTA Button</h4>
                    <p className="mt-0 mb-4 text-dark">Gives you a list of hotels around you via GPS of your device.</p>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="circle-icon mb-4">
                    <h2 className="circle-icon__content">2</h2>
                  </div>
                  <div>
                    <h4 className="font-weight-normal text-dark">Give HMS Location Access</h4>
                    <p className="mt-0 mb-4 text-dark">Search online for nearby hotels with the best hourly rates that best addresses your needs.</p>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="circle-icon mb-4">
                    <h2 className="circle-icon__content">3</h2>
                  </div>
                  <div>
                    <h4 className="font-weight-normal text-dark">Make Your Reservation</h4>
                    <p className="mt-0 mb-4 text-dark">Tell your Host when you’d like to stay, and only pay for the time span of your stay.</p>
                  </div>
                </div>
              </div>

              <div className="row text-center">
                <div className="col w-100  col-12 text-center mb-0">
                  <Link to="/customers/signup" className="btn btn-primary btn-lg mb-4">get started</Link>
                </div>
              </div>
            </section>

            <section className="become-a-hotel py-5">
              <div className="row text-center py-5">

                <div className="col py-3">
                  <div className="container">
                    <h1 className="mb-4 text-white font-weight-light">Register your hotel with HMS today.</h1>
                    <p className="text-white mb-3">We’re always looking for all kinds of hotels to offer to our clients with a wide range of options. Set your own rate, get paid and make a difference.</p>
                  </div>
                  <Link to="/hotels/signup" className="btn btn-outline-light btn-lg">Apply today</Link>
                </div>

              </div>
            </section>
          </>
          :
          null
      }
    </>
  );
}
