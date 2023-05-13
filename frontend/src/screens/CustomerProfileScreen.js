import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import moment from 'moment';

import LoadingBox from '../components/LoadingBox';

function CustomerProfileScreen() {
  const { _id } = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : false;
  const [customerInfo, setCustomerInfo] = useState(null);

  useEffect(() => {
    const getCustomer = async () => {
      const res = await axios(`/customers/${_id}`);
      setCustomerInfo(res.data.data);
    };
    getCustomer();
  }, []);

  const imageUpdateHandler = async (event) => {
    try {
      const image = event.target.files[0];
      const files = new FormData();
      files.append('image', image);
      const res = await axios.put(`customers/${_id}/image`, files, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const data = res.data.data;
      if (data) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        window.location.reload();
      }

    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="page-content page-container minus-240" id="page-content">
      <div className="padding">
        <div className="row container d-flex justify-content-center mx-auto">
          <div className="col-xl-12 col-md-12">
            {
              customerInfo ?
                <div className="card user-card-full">
                  <div className="row m-l-0 m-r-0">
                    <div className="col-sm-4 bg-c-lite-green user-profile">
                      <div className="card-block text-center text-white">
                        <div className="m-b-25 mx-auto w-50"> <img src={"http://localhost:5000/" + customerInfo.imageURL} className="img-radius w-100" alt="User-Profile-Image" /> </div>
                        <div>
                          <label htmlFor="files" className="btn btn-primary btn-sm" role="button">Update Profile Image</label>
                          <input id="files" name="image" style={{ visibility: "hidden" }} type="file" onChange={imageUpdateHandler} />
                        </div>
                        <h6 className="f-w-600 text-uppercase">{customerInfo.firstName} {customerInfo.lastName}</h6>
                        <p>Customer</p> <i className=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                      </div>
                    </div>
                    <div className="col-sm-8">
                      <div className="card-block">
                        <h6 className="m-b-20 p-b-5 b-b-default f-w-600">Information</h6>
                        <div className="row">
                          <div className="col-sm-6">
                            <p className="m-b-10 f-w-600">Email</p>
                            <h6 className="text-muted f-w-400">{customerInfo.email}</h6>
                          </div>
                          <div className="col-sm-6">
                            <p className="m-b-10 f-w-600">Registered with us</p>
                            <h6 className="text-muted f-w-400">{moment(customerInfo.createdAt).fromNow()}</h6>
                          </div>
                        </div>
                        <div className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600"></div>
                        <div className="row">
                          <div className="col-sm-6">
                            <p className="m-b-10 f-w-600">First Name</p>
                            <h6 className="text-muted f-w-400">{customerInfo.firstName}</h6>
                          </div>
                          <div className="col-sm-6">
                            <p className="m-b-10 f-w-600">Last Name</p>
                            <h6 className="text-muted f-w-400">{customerInfo.lastName}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                :
                <LoadingBox />
            }
          </div>
        </div>
      </div>
    </div >
  );
}

export default CustomerProfileScreen;
