import { Box } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { Link } from 'react-router-dom';
import Slider from "react-slick";

export default function Carousel({ recommendedHotels }) {
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    arrows: true,
    slidesToScroll: 2
  };
  console.log(recommendedHotels);
  return (
    <Slider {...settings}>
      {
        recommendedHotels?.map(hotel =>
        (
          <div key={hotel.hotel._id} className="hotel__profile-container recommender">
            <div className="hotel__img-container recommender">
              <img src={"http://localhost:5000/" + hotel.hotel.imageURL} />
            </div>
            <Box mb={0.2}>
              <Rating name="read-only" precision={0.5} value={hotel.AR} readOnly />
            </Box>
            <Link to={{
              pathname: "/hotels/profile",
              hotelInfo: hotel.hotel
            }} className="hotel__info hotel__full-name recommender">{hotel?.hotel.hotelName}</Link>
            <p className="hotel__info hotel__place recommender">
              <i className="fas fa-map-marker-alt"></i>
              {hotel?.hotel.city} {hotel?.hotel.country}
            </p>

          </div>
        )
        )
      }

    </Slider>
  );
}