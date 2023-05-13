// import Topbar from "../components/messenger/Topbar";
import Inbox from "../components/messenger/Inbox";
import Message from "../components/messenger/Message";

// import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import StyledButton from '../components/controls/StyledButton';
import { Box } from '@material-ui/core';
import { Link } from 'react-router-dom';
import moment from 'moment';

export default function Messenger() {
  const [inboxes, setInboxes] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const scrollRef = useRef();

  const user = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : false;

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderID,
        message: data.message,
        senderImageURL: data.senderImageURL,
        createdAt: moment().format()
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
  }, [user]);

  useEffect(() => {
    const getInboxes = async () => {
      try {
        const res = await axios.get("/inboxes/" + user._id);
        setInboxes(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getInboxes();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (currentChat) {
          const res = await axios.get("/messages/" + currentChat?._id);
          setMessages(res.data.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      senderID: user._id,
      message: newMessage,
      inboxID: currentChat._id,
      senderImageURL: user.imageURL
    };

    const receiverID = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderID: user._id,
      senderName: user.firstName,
      receiverID,
      message: newMessage,
      senderImageURL: user.imageURL
    });

    try {
      const res = await axios.post("/messages", message);
      setMessages([...messages, res.data.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            {
              inboxes.length ? inboxes.map((i) => (
                <div key={i._id} onClick={() => setCurrentChat(i)}>
                  <Inbox inbox={i} currentUser={user} />
                </div>
              )) :
                user.category === 'customers' ?
                  <Box mt={4} ml={2} mr={8}>
                    <Link to="/" className="text-white">
                      <StyledButton
                        fullWidth
                        disableElevation
                        responsive
                        variant="contained"
                        color="secondary"
                        type="submit"
                        style={{ color: '#fff' }}
                      >
                        Explore Hotels
                      </StyledButton>
                    </Link>
                  </Box> :
                  <Box mt={5} mr={3} textAlign="center">No Inboxes</Box>
            }
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages?.map((m) => (
                    <div ref={scrollRef} key={m._id}>
                      <Message message={m} own={m.senderID === user._id} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open an Inbox to start a chat.
              </span>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
