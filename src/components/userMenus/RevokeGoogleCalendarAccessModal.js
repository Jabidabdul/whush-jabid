import React, { useState, useEffect } from "react";
import { Modal, message } from "antd";
import chrome from "../chrome";
import { useSelector } from "react-redux";
import { selectRevokeCalendarId } from "../../selectors/selectors";

const RevokeGoogleCalendarAccessModal = (props) => {
  const [userEmail, setUserEmail] = useState("");
  const revokeCalendarId = useSelector(selectRevokeCalendarId);

  const fetchUserCalendars = () => {
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
          const calendarToRevoke = calendars.filter((calendar) => {
            return calendar.id === revokeCalendarId;
          });
          setUserEmail(calendarToRevoke[0].email);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  };

  useEffect(() => {
    fetchUserCalendars();
  }, []);

  const closeModal = () => {
    props.onModalClose();
  };

  const showCalendarRevokeSuccessMessage = (successMsg) => {
    message.success(successMsg);
  };

  const showRevokeCalendarErrorMessage = () => {
    message.error("Can't revoke Calendar Access. Something went wrong!");
  };

  const handleRevokeCalendarSuccess = () => {
    showCalendarRevokeSuccessMessage(
      `Successfully revoked permission for Google Calendar`
    );
    props.onModalClose();
  };

  const updateCalendarStatus = () => {
    chrome.storage.sync.get(["userId", "accessToken"], function (r) {
      const userId = r.userId;
      const token = r.accessToken;

      const UPDATE_CALENDAR_STATUS_URL = `https://whush.pro/api/api/revoke-calendar-access/${userId}/${revokeCalendarId}`;
      fetch(UPDATE_CALENDAR_STATUS_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            handleRevokeCalendarSuccess();
          } else if (data.errormessage) {
            showRevokeCalendarErrorMessage();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  };

  return (
    <Modal
      title="Revoke Google Calendar Access"
      onOk={updateCalendarStatus}
      onCancel={closeModal}
      visible={props.shouldShowModal}
      okButtonProps={{
        style: { color: "white", backgroundColor: "#222222", border: "none" },
      }}
    >
      <div>
        Are you sure you want to revoke the access for calendar of your email
        &nbsp;&nbsp;{<strong>{userEmail}</strong>} from your Whush account.
        <br />
        <br />
        Please make sure you revoke the access for our google application as
        well post this revoke step. You can follow below steps to revoke the
        accesss for application :
        <br />
        <br />
        <b>
          {`Manage your google account -> security -> third Party app with
            account access -> select the app(Whush) -> Remove access`}
        </b>
      </div>
    </Modal>
  );
};

export default RevokeGoogleCalendarAccessModal;
