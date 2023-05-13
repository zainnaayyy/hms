import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const HotelSignupScreen = (props) => {
  const info = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : false;
  const [userInfo, setUserInfo] = useState(info);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [hotelName, setHotelName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rooms, setRooms] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [description, setDescription] = useState('');

  const hotelNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const descriptionRef = useRef(null);

  const redirect = '/hotels/moreinfo';

  const isValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const startWithAlphabet = (name) => {
    const re = /^[a-zA-Z]{1}/;
    return re.test(String(name).toLowerCase());
  };

  function showSuccess(node) {
    node.parentElement.className = 'form__control success';
    node.className = 'form-control 1';
  }

  function showError(node, msg) {
    node.parentElement.className = 'form__control error';
    node.className = 'form-control';
    node.nextElementSibling.textContent = msg;
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    //hotelName validation
    if (hotelName === '') {
      showError(hotelNameRef.current, 'Hotel name is required');
    } else if (hotelName.trim().length < 3) {
      showError(hotelNameRef.current, 'Hotel name must be at least 3 characters');
    }
    else if (!startWithAlphabet(hotelName)) {
      showError(hotelNameRef.current, 'Hotel Name must start with an alphabet');
    } else {
      showSuccess(hotelNameRef.current);
    }

    //email validation
    if (email === '') {
      showError(emailRef.current, 'Email is required');
    } else if (!isValid(email)) {
      showError(emailRef.current, 'Email is invalid format');
    } else {
      showSuccess(emailRef.current);
    }

    //password validation
    if (password === '') {
      showError(passwordRef.current, 'Password is required');
    } else if (password.length < 8) {
      showError(passwordRef.current, 'Password must be at least 8 characters');
    } else if (password.search(/\d/) === -1) {
      showError(passwordRef.current, 'Password must contain at least a number');
    } else if (password.search(/[a-z]/) === -1) {
      showError(passwordRef.current, 'At least one lowercase alphabet');
    } else if (password.search(/[A-Z]/) === -1) {
      showError(passwordRef.current, 'At least one uppercase alphabet');
    } else if (password.search(/[\/\*\-\+\!\@\#\$\^\&]/) === -1) {
      showError(passwordRef.current, 'One of the following characters:  / * - + ! @ # $ ^ & *');
    } else {
      showSuccess(passwordRef.current);
    }

    //description validation
    if (description === '') {
      showError(descriptionRef.current, 'Description is required');
    } else if (description.trim().length < 21) {
      showError(descriptionRef.current, 'Description must be at least 20 characters');
    } else {
      showSuccess(descriptionRef.current);
    }

    if (hotelNameRef.current.classList.contains("1") &&
      emailRef.current.classList.contains("1") &&
      passwordRef.current.classList.contains("1")
      && rooms && hourlyRate && descriptionRef.current.classList.contains("1")) {
      //form submission logic here
      const hotel = {
        hotelName,
        email,
        password,
        rooms,
        hourlyRate,
        description
      };

      try {
        setLoading(true);
        const res = await axios.post("hotels/signup", hotel);
        const data = res.data.data;
        if (data) {
          localStorage.setItem('userInfo', JSON.stringify(data));
          setUserInfo(data);
          setLoading(false);
        }

      } catch (err) {
        setLoading(false);
        setError(err.message);
      }

    }
  };

  useEffect(() => {
    if (userInfo) {
      // props.history.push('/users/:Id'); //redirect user to his profile
      props.history.push(redirect);
    }
  }, [props.history, userInfo, redirect]);


  return (

    <div className="auth-wrapper my-5">
      <div className="auth-inner mt-5">

        <form onSubmit={submitHandler} noValidate>
          <h3>Let's Register Your Hotel</h3>

          {loading && <LoadingBox msg={`Registering you as a Hotel! Please wait...`} />}
          {error && <MessageBox msg={error} variant='danger'></MessageBox>}

          <div className="form-group form__control">
            <label htmlFor="hotelName">Hotel name</label>
            <input
              ref={hotelNameRef}
              type="text"
              name="hotelName"
              id="hotelName"
              onChange={(e) => setHotelName(e.target.value)}
              className="form-control"
              placeholder="Enter full name of the hotel"
              required
            />
            <small class="form__error-msg"></small>
          </div>

          <div className="form-group form__control">
            <label htmlFor="email">Email address</label>
            <input
              ref={emailRef}
              type="email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter email address of hotel"
              required
            />
            <small class="form__error-msg"></small>
          </div>

          <div className="form-group form__control">
            <label htmlFor="password">Password</label>
            <input
              ref={passwordRef}
              type="password"
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Choose a password"
              required
            />
            <small class="form__error-msg"></small>
          </div>

          <div className="form-group form__control">
            <label htmlFor="hourlyRate">Hourly Charges Starts From:</label>

            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                className="form-control"
                id="hourlyRate"
                aria-label="Amount (to the nearest dollar)"
                name="hourlyRate"
                onChange={(e) => setHourlyRate(e.target.value)}
                required
              />
              <div className="input-group-append">
                <span className="input-group-text">.00</span>
              </div>
            </div>
          </div>

          <div className="form-group form__control">
            <label htmlFor="rooms">Number of Rooms in your Hotel</label>
            <div className="input-group mb-3">
              <input
                type="number"
                className="form-control"
                id="rooms"
                aria-label="Years of rooms"
                name="rooms"
                onChange={(e) => setRooms(e.target.value)}
                required
              />
              <div className="input-group-append">
                <span className="input-group-text">Rooms</span>
              </div>
            </div>
          </div>

          <div className="form-group form__control">
            <label htmlFor="description">Description</label>
            <textarea
              ref={descriptionRef}
              rows='3'
              name="description"
              id="description"
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              placeholder="Please write a little about your Hotel..."
              required
            >
            </textarea>
            <small class="form__error-msg"></small>
          </div>

          <button type="submit" className="btn btn-primary btn-block">Sign Up as Hotel</button>

          <hr />

          <Link to="/customers/signup" type="submit" className="btn btn-danger btn-block">Take me to Customer Sign Up Page <i className="fa fa-arrow-right"></i></Link>

          <p className="forgot-password text-right">
            Already registered <Link to="/signin">sign in?</Link>
          </p>
        </form>
      </div >
    </div >
  );
};

export default withRouter(HotelSignupScreen);