import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import axios from 'axios';
import { useState } from 'react';
import Rating from '@material-ui/lab/Rating';
import { Typography } from '@material-ui/core';
import ReviewCard from '../components/Card/ReviewCard';

function HotelProfileScreen() {

  const location = useLocation();
  const history = useHistory();
  const { hotelInfo } = location;
  const [averageRating, setAverageRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : false;

  const currentUser = userInfo._id ? userInfo : false;

  useEffect(() => {
    if (!hotelInfo)
      history.push('/');
  }, []);

  useEffect(() => {
    const getFeedbacks = async () => {
      try {
        const feedbacks = await axios.get("feedbacks/" + hotelInfo?._id);
        if (feedbacks.data.length) {
          setAverageRating(feedbacks.data.reduce((n, { rating }) => n + rating, 0) / feedbacks.data.length);
          setReviews(feedbacks.data.map(feedback => feedback.review));
          setFeedbacks(feedbacks.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getFeedbacks();
  }, []);


  const createNewInbox = async () => {

    if (hotelInfo?._id && currentUser) {
      const members = {
        ownerID: currentUser?._id,
        opponentID: hotelInfo?._id
      };

      try {
        const res = await axios.post('inboxes', members);
        const inboxCreated = res.data.success;
        if (inboxCreated) {
          history.push('/messenger');
        }

      } catch (err) {
        console.log(err.message);
      }
    } else if (!currentUser) {
      history.push('/signin');
    }

  };

  const scheduleNewReservation = async () => {

    if (hotelInfo?._id && currentUser) {
      //take user to schedule screen and pass there the hotel id and current user id as state
      history.push({
        pathname: '/schedule',
        state: {
          hotelInfo,
          customerInfo: currentUser
        }
      });
    } else if (!currentUser) {
      history.push('/signin');
    }
  };

  return (
    <div className="container my-4">
      <div className="profile-header">
        <div className="profile-img">
          <img src={"http://localhost:5000/" + hotelInfo?.imageURL} width="200" alt="Profile Image" />
        </div>
        <div className="profile-nav-info">
          <h3 className="user-name">{hotelInfo?.hotelName} </h3>
          <div className="address">
            <p id="state" className="state">{hotelInfo?.city}</p>
            <span id="country" className="country">{hotelInfo?.country}</span>
          </div>

        </div>
      </div>

      <div className="main-bd">
        <div className="left-side">
          <div className="profile-side">
            <Typography className="text-capitalize" variant="h6" gutterBottom component="div">
              {hotelInfo?.categoryName} Hotel
            </Typography>
            <div className="user-bio">
              <Typography className="text-uppercase mb-1 pb-1" variant="h4" gutterBottom component="div">
                Bio
              </Typography>
              <Typography className="text-capitalize mb-2 pb-1" variant="subtitle2" gutterBottom component="div">
                {hotelInfo?.description}
              </Typography>
            </div>
            <div className="profile-btn">
              <button onClick={createNewInbox} className="chatbtn" id="chatBtn"><i className="fa fa-comment"></i> Chat</button>
              <button onClick={scheduleNewReservation} className="createbtn" id="Create-post"><i className="fa fa-plus"></i> Schedule</button>
            </div>
            <div className="user-rating mt-2">
              <h3 className="rating">{averageRating.toFixed(1)}</h3>
              <div className="rate">
                <Rating name="read-only" precision={0.2} value={averageRating} readOnly />
                <span className="no-of-user-rate"><span className="d-block">{reviews.length}&nbsp;reviews</span></span>
              </div>

            </div>
          </div>

        </div>
        <div className="right-side">

          <div className="profile-nav">
            <ul>
              <li className="user-review active d-block">Reviews</li>
            </ul>
          </div>
          <div className="profile-body">
            <div className="profile-reviews tab">
              <div class="comment-section">
                <div class="container">
                  <div class="review">
                    <div class="comment-section">
                      {
                        feedbacks.map((feedback) => <ReviewCard key={feedback._id} feedback={feedback} />)
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelProfileScreen;
