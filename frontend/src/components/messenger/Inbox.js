import axios from "axios";
import { useEffect, useState } from "react";

export default function Inbox({ inbox, currentUser }) {
  const [endUser, setEndUser] = useState(null);

  useEffect(() => {
    const endUserID = inbox.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        let res;
        if (currentUser.category === 'customers') {
          res = await axios("/hotels/" + endUserID);
        }
        else {
          res = await axios("/customers/" + endUserID);
        }
        setEndUser(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, inbox]);

  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src={"http://localhost:5000/" + endUser?.imageURL}
        alt=""
      />
      <span className="conversationName">{endUser?.category === "hotels" ? endUser?.hotelName : endUser?.firstName + " " + endUser?.lastName}</span>
    </div>
  );
}
