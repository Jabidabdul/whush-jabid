import React, { useState } from "react";
import { Tooltip, Input } from "antd";
import "./GoogleTaskListItem.css";
import chrome from "./chrome";

const GoogleTaskListItem = (props) => {
  const [task, setTask] = useState(props.task);
  const [colorCode, setColorCode] = useState(props.colorCode || "transparent");

  const openGoogleCalendarTask = () => {
    chrome.tabs.create({ url: task.meeting_link });
  };
  const dateTime = new Date(task.start_time);
  const date = dateTime.toLocaleDateString().split("/").reverse().join("-");
  const time = dateTime.toLocaleTimeString();
  return (
    <>
      <Tooltip className="google-task-name-tooltip">
        <Input
          readOnly={true}
          value={task.event_summary}
          className="google-task-item-normal"
          style={{
            backgroundColor: `${colorCode}`,
          }}
        />
      </Tooltip>
      <div
        className="google-task-date-time"
        style={{
          backgroundColor: `${colorCode}`,
        }}
      >{`${date} ${time}`}</div>
      <div
        className="google-task-link-container"
        style={{
          backgroundColor: `${colorCode}`,
        }}
      >
        {task.meeting_link ? (
          <a
            className="google-calendar-task-link"
            onClick={openGoogleCalendarTask}
          >
            Link
          </a>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default GoogleTaskListItem;
