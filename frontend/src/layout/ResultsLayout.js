import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@material-ui/core';
import HotelProfileCard from '../components/Card/HotelProfileCard';
import BottomDrawer from '../components/hotel/BottomDrawer';
import Carousel from '../components/Carousel';
import axios from 'axios';

function ResultsLayout(props) {
  const location = useLocation();

  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : false;

  const [hotelIDs, setHotelIDs] = useState(location.state.hotelIDs);
  const { term } = location.state;

  const [hotelsData, setHotelsData] = useState([]);
  const [recommendedHotels, setRecommendedHotels] = useState([]);

  const [filterApplied, setFilterApplied] = useState(false);

  useEffect(() => {
    let hotels;
    if (hotelIDs.length) {
      const getHotelsData = async () => {
        let res = await axios.all(hotelIDs.map(hotelID => axios.get("hotels/" + hotelID.trim())));
        hotels = res.map((r) => {
          const { _id, imageURL, description, categoryName, hotelName, hourlyRate, rooms, averageRating, city, country } = r.data.data;
          return { _id, description, imageURL, categoryName, hotelName, city, country, hourlyRate, rooms, averageRating };
        });
        setHotelsData(hotels);
      };
      getHotelsData();
    }
  }, [hotelIDs]);

  useEffect(() => {
    const getRecommendedHotels = async () => {
      try {
        //first we find those hotels who are reviewed
        const reviewedHotels = [];
        const feedbacks = await axios.all(hotelIDs.map(hotelID => axios.get("feedbacks/" + hotelID.trim())));
        feedbacks.forEach(feedback => {
          if (feedback.data.length)
            reviewedHotels.push(feedback.data);
        });
        console.log(reviewedHotels);
        //now we have to avg rating of each hotel
        // AR = 1*a+2*b+3*c+4*d+5*e/(R) 
        //for this we need to calculate first the number of 1s, 2s, 3s, 4s, 5s rating so the data structure for each hotel is gonna look something like this:
        /*
        {
          hotelID:
          1:
          2:
          3:
          4:
          5:
          totalReviews:
        }
        */
        const hotelsWithAverageRating = reviewedHotels.map(reviewedHotel => {
          let a, b, c, d, e;
          a = b = c = d = e = 0;
          console.log(a, b, c, d, e);

          let R = reviewedHotel.length;
          reviewedHotel.forEach(review => {
            switch (review.rating) {
              case 1:
                a++;
                break;
              case 2:
                b++;
                break;
              case 3:
                c++;
                break;
              case 4:
                d++;
                break;
              case 5:
                e++;
                break;
              default:
                break;
            }
          });
          //now that we have all the variables apply AR = 1*a+2*b+3*c+4*d+5*e/(R) to get average rating
          const AR = (1 * a + 2 * b + 3 * c + 4 * d + 5 * e) / R;
          return {
            hotel: hotelsData.find(hotel => hotel._id === reviewedHotel[0].hotelID),
            AR
          };
        });
        hotelsWithAverageRating.sort((a, b) => parseFloat(b.AR) - parseFloat(a.AR));
        setRecommendedHotels(hotelsWithAverageRating);
      } catch (err) {
        console.log(err);
      }
    };
    if (hotelsData.length)
      getRecommendedHotels();
  }, [hotelsData, hotelIDs]);

  return (
    <Box>
      {
        !hotelIDs.length ?
          <>
            <Box height={380} display="flex" justifyContent="center" alignItems="center">

              no results found

            </Box>
          </> :
          !hotelsData.length ?
            <Box height={450} display="flex" alignItems="center" justifyContent="center">
              <CircularProgress />
            </Box>
            :
            <>
              <BottomDrawer hotelIDs={hotelIDs} setHotelIDs={setHotelIDs} setFilterApplied={setFilterApplied} />
              <Box fontSize={25} className="text-capitalize pt-4 pb-3 px-4">
                <span className="font-weight-bold">{hotelIDs.length} {filterApplied ? "nearby" : ""} {term} hotel{hotelIDs.length > 1 ? "s" : ""}</span> found
              </Box>
              <div className="row mb-5">
                {
                  hotelsData.map((hotel) => (
                    <div key={hotel._id} className="col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3"><HotelProfileCard hotelInfo={hotel} currentUser={userInfo._id ? userInfo : false} /></div>
                  ))
                }
              </div>
              {
                recommendedHotels.length ?
                  <>
                    <Box fontSize={22} mt={8} className="text-capitalize pt-4 px-4">
                      <span className="font-weight-bold">Top {filterApplied ? "nearby" : ""} {term} hotel{recommendedHotels.length > 1 ? "s" : ""}</span> Recommended for you
                    </Box>
                    <Box mb={6} mt={2}>
                      <Carousel recommendedHotels={recommendedHotels} />
                    </Box>
                  </>
                  :
                  null
              }
            </>
      }
    </Box>
  );
}

export default ResultsLayout;
