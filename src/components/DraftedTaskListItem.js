import React, { useState, useRef, useEffect } from "react";
import { EditFilled, CloseOutlined } from "@ant-design/icons";
import "./DraftedTaskListItem.css";
import {
  setTaskInEditing,
  setOpenTaskDetails,
  setIsDraftedTaskOpen,
} from "../actions/actions";
import { useDispatch } from "react-redux";
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";

const DraftedTaskListItem = ({ children, ellipsis, ...props }) => {
  const buttonRef = useRef();
  const { getArrowProps, getTooltipProps, setTooltipRef, visible } =
    usePopperTooltip();
  const dispatch = useDispatch();
  const [task, setTask] = useState(props.task);
  const [showToolTip, setShowToolTip] = useState(false);

  const handleEditFullTask = () => {
    dispatch(setIsDraftedTaskOpen(true));
    dispatch(setTaskInEditing(task));
  };

  useEffect(() => {
    if (task.taskDetails.length > 43) {
      setShowToolTip(true);
    }
  });

  const handleOpenTaskDetails = () => {
    dispatch(setOpenTaskDetails(task));
  };

  return (
    <div className="drafted-task-container">
      <div className="drafted-task-details" ref={buttonRef}>
        <div onClick={handleOpenTaskDetails}>{task.taskDetails}</div>
        {visible && showToolTip && (
          <div
            ref={setTooltipRef}
            {...getTooltipProps({
              className: "tooltip-container whush-tooltip-container",
            })}
          >
            <div
              {...getArrowProps({
                className: "tooltip-arrow whush-tooltip-arrow",
              })}
            />
            {task.taskDetails}
          </div>
        )}
      </div>
      <div>{`${task.date} ${task.time}`}</div>
      <div className="drafted-task-actions-container">
        <EditFilled onClick={handleEditFullTask} />
        <CloseOutlined
          style={{ fontSize: "18px", color: "red" }}
          onClick={() => props.removeTask(task.id)}
        />
      </div>
    </div>
  );
};

export default DraftedTaskListItem;
