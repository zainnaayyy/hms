import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';


function HotelProfileCard({ hotelInfo, currentUser }) {
  const history = useHistory();
  const [averageRating, setAverageRating] = useState(0);
  const { _id } = hotelInfo;

  const hotelProfile = {
    pathname: "/hotels/profile",
    hotelInfo
  };

  useEffect(() => {
    if (_id) {
      const getAverageRating = async () => {
        try {
          const feedbacks = await axios.get("feedbacks/" + _id);
          if (feedbacks.data.length)
            setAverageRating(feedbacks.data.reduce((n, { rating }) => n + rating, 0) / feedbacks.data.length);
        } catch (err) {
          console.log(err);
        }
      };
      getAverageRating();
    }
  }, [_id]);

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
    <div className="hotel__profile-container">
      <div className="hotel__img-container">
        <img src={"http://localhost:5000/" + hotelInfo?.imageURL} />
      </div>
      <Box mb={0.2}>
        <Rating name="read-only" precision={0.5} value={averageRating} readOnly />
      </Box>
      <Link to={hotelProfile} className="hotel__info hotel__full-name">{hotelInfo?.hotelName}</Link>
      <p className="hotel__info hotel__role">
        <i className="fas fa-star"></i>
        {hotelInfo?.categoryName} Hotel
      </p>
      <p className="hotel__info hotel__place">
        <i className="fas fa-map-marker-alt"></i>
        {hotelInfo?.city} {hotelInfo?.country}
      </p>

      <div className="hotel__rate-info">
        ${hotelInfo?.hourlyRate}<span>&nbsp;/hour</span>
      </div>

      <button className="hotel__action" onClick={scheduleNewReservation}>Schedule</button>
      <button className="hotel__action inbox" onClick={createNewInbox}>Message</button>
    </div>
  );
}

export default HotelProfileCard;
