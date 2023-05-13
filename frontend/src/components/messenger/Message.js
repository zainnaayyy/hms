import moment from 'moment';

export default function Message({ message, own }) {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={"http://localhost:5000/" + message.senderImageURL}
          alt=""
        />
        <p className="messageText">{message.message}</p>
      </div>
      <div className="messageBottom">{moment(message.createdAt).fromNow()}</div>
    </div>
  );
}
