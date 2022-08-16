import React from "react";

function MiniView(props) {
  const { user, date, content } = props;
  const imgSrc = `https://finstagram-images.s3.us-east-1.amazonaws.com/${user.image}`;

  return (
    <div className="user-mini">
      <img src={imgSrc} alt="user mini" />
      <div className="mini-info">
        <p className="mini-username">{user.username}</p>
        <p className="mini-date">{date}</p>
      </div>
      <p className="mini-content">{content}</p>
    </div>
  )
}

export default MiniView;
