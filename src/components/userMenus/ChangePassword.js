import React, { useState } from "react";
import { Input, Button, message } from "antd";
import "./ChangePassword.css";
import chrome from "../chrome";
import { setIsLoggedIn } from "../../actions/actions";
import { useDispatch } from "react-redux";

const ChangePassword = (props) => {
  const dispatch = useDispatch();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const showErrorMessage = (errorMsg) => {
    message.error(errorMsg);
  };

  const verifyConfirmPassword = () => {
    if (confirmNewPassword !== newPassword) {
      showErrorMessage("New and Confirm Password Not Matching!!");
      return false;
    }
    return true;
  };

  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
  };

  const handleConfirmNewPasswordChange = (event) => {
    setConfirmNewPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handlePasswordChangeSuccess = () => {
    dispatch(setIsLoggedIn(false));

    chrome.storage.sync.remove("newTask", function () {
      console.log("New Task removed from chrome sync storage ****");
    });

    chrome.storage.sync.remove("accessToken", function () {
      console.log("Access Token removed from chrome sync storage ****");
    });
  };

  const changePasswordInAPI = function () {
    if (verifyConfirmPassword()) {
      chrome.storage.sync.get(["userId", "accessToken","userEmail"], function (r) {
        const userId = r.userId;
        const token = r.accessToken;
        const email = r.userEmail;
        const UPDATE_PASSWORD_URL = `https://whush.pro/api/api/updatepassword/${userId}`;
        const data = {
          oldpassword: oldPassword,
          newpassword: newPassword,
          email: email,
        };
        fetch(UPDATE_PASSWORD_URL, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify(data),
        })
          .then((data) => {
            if (data.status === 200) {
              handlePasswordChangeSuccess();
            }
            return data;
          })
          .then((response) => response.json())
          .then((data) => {
            if (data.errormessage) showErrorMessage(data.errormessage);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
    }
  };

  return (
    <div className="change-password">
      <Input.Password
        placeholder="Old Password"
        onChange={handleOldPasswordChange}
      />
      <Input.Password
        placeholder="New Password"
        onChange={handleNewPasswordChange}
      />
      <Input.Password
        placeholder="Confirm New Password"
        onChange={handleConfirmNewPasswordChange}
      />
      <Button
        className="change-password-btn"
        type="primary"
        onClick={changePasswordInAPI}
      >
        Submit
      </Button>
    </div>
  );
};

export default ChangePassword;
