import React, { useEffect, useState } from "react";
import { Avatar } from "antd";
import "./UserProfile.css";
import chrome from "../chrome";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const username = localStorage.getItem("username");

  const fetchUserDetails = () => {
    chrome.storage.sync.get(["userId", "accessToken"], function (r) {
      const userId = r.userId;
      const token = r.accessToken;

      const GET_USER_DETAILS_URL = `https://whush.pro/api/api/getuserdetails/${userId}`;
      fetch(GET_USER_DETAILS_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      })
        .then((data) => data.json())
        .then((userData) => {
          console.log(userData);
          if (userData.message) {
            setUser(userData.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div className="user-details">
      <div className="user-profile-pic-container">
        <Avatar
          style={{ backgroundColor: "white", color: "#282828" }}
          size={100}
        >
          {username[0].toUpperCase()}
        </Avatar>
      </div>
      <div className="user-details-container">
        <div className="user-details-item-container">
          <div className="user-details-item-label">Full Name &nbsp; :</div>
          <div className="user-details-item-value">{user.fullname}</div>
        </div>
        <div className="user-details-item-container">
          <div className="user-details-item-label">Mobile Number &nbsp; :</div>
          <div className="user-details-item-value">{user.mobilenumber}</div>
        </div>
        <div className="user-details-item-container">
          <div className="user-details-item-label">Email &nbsp; :</div>
          <div className="user-details-item-value">{user.email}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
