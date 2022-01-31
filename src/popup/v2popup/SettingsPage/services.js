import chrome from "../../../components/chrome";
import {message} from 'antd';


export const fetchUserDetails = ({setFullName, setMobileNumber, setEmail,}) => {
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
        console.log("userdata", userData);
        if (userData.message) {
          setFullName(userData.message.fullname);
          setMobileNumber(userData.message.mobilenumber);
          setEmail(userData.message.email)
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
};

export const changeUserDetailsInAPI = function ({fullName, mobileNumber}) {
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
          message.success(data.message);
        } else if (data.errormessage) {
          message.error(data.errormessage);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
};

export const fetchUserCalendars = ({setCalendars}) => {
  chrome.storage.sync.get(["userId", "accessToken"], function (r) {
    const userId = r.userId;
    const token = r.accessToken;

    const GET_USER_CALENDARS_URL = `https://whush.pro/api/api/users/${userId}/calendars`;
    fetch(GET_USER_CALENDARS_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    })
      .then((data) => data.json())
      .then((calendars) => {
        if (calendars.length) {
          const transformedCalendar = calendars.map((calendar) => {
            return {
              key: calendar.id,
              email: calendar.email,
              colorCode: calendar.color_code,
            };
          });
          setCalendars(transformedCalendar);
        } else {
          setCalendars([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
};

export const changePasswordInAPI = function ({oldPassword, newPassword, newPasswordConfirm, handlePasswordChangeSuccess}) {
  if (newPassword !== newPasswordConfirm) {
    message.error("Passwords Don't match!!")
    return;
  }
  chrome.storage.sync.get(["userId", "accessToken","userEmail"], function (r) {
    const userId = r.userId;
    const token = r.accessToken;
const email = r.userEmail;
    const UPDATE_PASSWORD_URL = `https://whush.pro/api/api/updatepassword/${userId}`;
    const data = {
      oldpassword: oldPassword,
      newpassword: newPassword,
      email:email
    };
    console.log(data)
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
        "errormessage" in data && message.error(data.errormessage);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
};
