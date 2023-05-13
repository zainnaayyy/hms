import React from 'react';
import Rating from '@material-ui/lab/Rating';
import moment from 'moment';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Typography } from '@material-ui/core';

function ReviewCard({ feedback }) {
  const { customerID } = feedback;
  const [customerInfo, setCustomerInfo] = useState(false);

  useEffect(() => {
    if (customerID) {
      const getCustomerInfo = async () => {
        try {
          const res = await axios.get("customers/" + customerID);
          if (res.data.success)
            setCustomerInfo(res.data.data);
        } catch (err) {
          console.log(err);
        }
      };
      getCustomerInfo();
    }
  }, [customerID]);

  console.log(feedback);

  return (
    customerInfo ?
      <div class="media media-review">
        <div class="media-user"><img src={"http://localhost:5000/" + customerInfo?.imageURL} alt="" /></div>
        <div class="media-body">
          <div class="M-flex">
            <h2 class="title"><Typography className="font-weight-bold text-left"> {customerInfo.firstName} {customerInfo.lastName} </Typography>  {moment(feedback.createdAt).format("MMMM Do YYYY, h:mm:ss A")}</h2>
            <div class="rating-row">
              <ul>
                <Rating name="read-only" precision={0.5} value={feedback.rating} readOnly />
              </ul>
            </div>
          </div>
          <div class="description">{feedback.review}</div>
        </div>
      </div> :
      null


  );
}

export default ReviewCard;
