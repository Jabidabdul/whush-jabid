import React, { useEffect, useState } from "react";
import "./TaskDetails.css";
import { Button } from "antd";
import { EditFilled } from "@ant-design/icons";
import { setTaskInEditing } from "../actions/actions";
import { useDispatch } from "react-redux";
import { decode } from "js-base64";

const TaskDetails = (props) => {
  const dispatch = useDispatch();
  const [openTask, setOpenTask] = useState(props.openTaskDetails);
  const [attachmentData, setAttachmentData] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const attachmentUrl = openTask.attachment;
    const descriptionUrl = openTask.description;
    if (descriptionUrl) {
      fetch(`${descriptionUrl}`, {
        method: "GET",
      })
        .then((response) => response.text())
        .then((description) => {
          setDescription(decode(description));
        });
    }
    if (attachmentUrl) {
      fetch(`${attachmentUrl}`, {
        method: "GET",
      })
        .then((response) => response.text())
        .then((attachmentData) => {
          setAttachmentData(attachmentData.split("'")[1]);
        });
    }
  }, []);

  const handleEditFullTask = () => {
    dispatch(setTaskInEditing(openTask));
    props.handleBackToEventsList();
  };

  const priorityMap = {
    1: "Urgent",
    2: "High",
    3: "Medium",
    4: "Low",
  };

  return (
    <div className="task-details-container">
      <div className="back-to-events-list-btns-container">
        <Button
          className="back-to-events-list-btn"
          type="primary"
          onClick={props.handleBackToEventsList}
          block
        >
          X
        </Button>
        {openTask.status !== "done" ? (
          <Button
            onClick={handleEditFullTask}
            className="edit-full-task-btn"
            type="primary"
            blocks
          >
            <EditFilled />
          </Button>
        ) : (
          ""
        )}
      </div>
      <div className="task-detail-item">
        <div className="task-detail-item-label">Details &nbsp; :&nbsp;</div>
        <div className="task-detail-item-value"> {openTask.taskDetails}</div>
      </div>
      <div className="task-detail-item">
        <div className="task-detail-item-label">Assigned To &nbsp; :&nbsp;</div>
        <div className="task-detail-item-value">{openTask.assignedTo}</div>
      </div>
      <div className="task-detail-item">
        <div className="task-detail-item-label">Status &nbsp; :&nbsp;</div>
        <div className="task-detail-item-value">{openTask.status}</div>
      </div>
      <div className="task-detail-item">
        <div className="task-detail-item-label">Action Type &nbsp; :&nbsp;</div>
        <div className="task-detail-item-value">{openTask.actionType}</div>
      </div>
      <div className="task-detail-item">
        <div className="task-detail-item-label">Priority &nbsp; :&nbsp;</div>
        <div className="task-detail-item-value">
          {priorityMap[openTask.priority]}
        </div>
      </div>
      <div className="task-detail-item">
        <div className="task-detail-item-label">Date &nbsp; :&nbsp;</div>
        <div className="task-detail-item-value">{openTask.date}</div>
      </div>
      <div className="task-detail-item">
        <div className="task-detail-item-label">Time &nbsp; :&nbsp;</div>
        <div className="task-detail-item-value">{openTask.time}</div>
      </div>
      {attachmentData && (
        <div className="task-detail-item">
          <div className="task-detail-item-label">
            Attachment &nbsp; :&nbsp;
          </div>
          <div className="attachment-download-link">
            <a download="FILENAME.EXT" href={`${attachmentData}`} download>
              Download Attachment
            </a>
          </div>
        </div>
      )}
      {description && (
        <div className="task-detail-item-description">
          <div className="task-detail-item-description-label">
            Description &nbsp; :&nbsp;
          </div>
          <div
            className="task-advance-description-container"
            dangerouslySetInnerHTML={{ __html: `${description}` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
