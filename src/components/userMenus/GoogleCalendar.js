import React, { useState, useEffect } from "react";
import { Button, Table } from "antd";
import "./GoogleCalendar.css";
import chrome from "../chrome";
import { useDispatch } from "react-redux";
import {
  setIsRevokeGoogleCalendarModalOpen,
  setRevokeCalendarId,
} from "../../actions/actions";

const GoogleCalendar = () => {
  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (mail) => <div>{mail}</div>,
    },
    {
      title: "Color Code",
      dataIndex: "colorCode",
      key: "colorCode",
      render: (colorCode) => (
        <div
          style={{
            width: "40px",
            height: "20px",
            display: "inline-flex",
            backgroundColor: `${colorCode}`,
            marginLeft: "16px",
            marginTop: "5px",
          }}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      render: (element, record) => (
        <a
          style={{
            color: "#222222",
            textDecoration: "underline",
          }}
          onClick={(e) => handleRevokeCalendarAccess(record)}
        >
          Revoke
        </a>
      ),
    },
  ];

  const dispatch = useDispatch();
  const [calendars, setCalendars] = useState([]);
  const handleLinkCalendar = () => {
    chrome.tabs.create({ url: "https://whush.pro/calender" });
  };

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

  const handleRevokeCalendarAccess = (record) => {
    dispatch(setRevokeCalendarId(record.key));
    dispatch(setIsRevokeGoogleCalendarModalOpen(true));
  };

  useEffect(() => {
    fetchUserCalendars();
  }, []);

  return (
    <div className="link-google-calendar-container">
      <div className="google-calendar-action-btns">
        <Button
          className="add-google-calendar-btn"
          type="primary"
          onClick={handleLinkCalendar}
          block
        >
          Link Calendar
        </Button>
      </div>
      {calendars.length > 0 ? (
        <Table
          bordered
          pagination={
            calendars.length > 7 && { pageSize: 7, position: "bottomCenter" }
          }
          columns={columns}
          dataSource={calendars}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default GoogleCalendar;
