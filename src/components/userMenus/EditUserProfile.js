import React, { useState } from "react";
import { Input, Button, Avatar, message } from "antd";
import "./EditUserProfile.css";
import chrome from "../chrome";

const EditUserProfile = () => {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const username = localStorage.getItem("username");

  const showErrorMessage = (errorMsg) => {
    message.error(errorMsg);
  };

  const showSuccessMessage = (successMsg) => {
    message.success(successMsg);
  };

  const handlFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleMobileNumberChange = (event) => {
    setMobileNumber(event.target.value);
  };

  const changeUserDetailsInAPI = function () {
    chrome.storage.sync.get(["userId", "accessToken"], function (r) {
      const userId = r.userId;
      const token = r.accessToken;
      const UPDATE_USER_DETAILS_URL = `https://whush.pro/api/api/updateuser/${userId}`;
      const data = {
        fullname: (fullName && fullName) || undefined,
        mobilenumber: (mobileNumber && mobileNumber) || undefined,
      };
      fetch(UPDATE_USER_DETAILS_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(data),
      })
        .then((data) => {
          if (Response.status === 200) {
            console.log("Successfully updated the details");
          }
          return data;
        })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            setFullName("");
            setMobileNumber("");
            showSuccessMessage(data.message);
          } else if (data.errormessage) {
            showErrorMessage(data.errormessage);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  };

  return (
    <div className="edit-user-details">
      <div className="user-profile-pic-container">
        <Avatar
          style={{ backgroundColor: "white", color: "#282828" }}
          size={80}
        >
          {username[0].toUpperCase()}
        </Avatar>
      </div>
      <div className="edit-user-details-container">
        <Input
          placeholder="Full Name"
          value={fullName}
          onChange={handlFullNameChange}
        />
        <Input
          type="number"
          placeholder="Mobile Number"
          value={mobileNumber}
          onChange={handleMobileNumberChange}
        />
        <Button
          className="change-user-details-btn"
          type="primary"
          onClick={changeUserDetailsInAPI}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default EditUserProfile;
