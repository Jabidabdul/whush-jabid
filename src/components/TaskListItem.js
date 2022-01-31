import React, { useState, useRef, useEffect } from "react";
import { Input, Checkbox } from "antd";
import { EditFilled, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import "./TaskListItem.css";
import chrome from "./chrome";
import useDoubleClick from "use-double-click";
import { setTaskInEditing, setOpenTaskDetails } from "../actions/actions";
import { useDispatch } from "react-redux";
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";

const TaskListItem = ({ children, ellipsis, ...props }) => {
  const buttonRef = useRef();
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip();
  const dispatch = useDispatch();
  const [isTaskEditing, setIsTaskEditing] = useState(false);
  const [task, setTask] = useState(props.task);
  const [showToolTip, setShowToolTip] = useState(false);
  const handleEditFullTask = () => {
    dispatch(setTaskInEditing(task));
  };

  useEffect(() => {
    if (task.taskDetails.length > 43) {
      setShowToolTip(true);
    }
  });

  const onChange = (e) => {
    const status = e.target.checked ? "done" : "active";
    if (props.taskType === "overdue") {
      props.handleOverdueTaskUpdateStatus(task.id, status);
    } else {
      props.updateTaskStatus(task.id, status);
    }
  };

  const handleTaskChange = (e) => {
    setTask({
      ...task,
      id: task.id,
      taskDetails: e.target.value,
    });
  };

  const handleTaskDoubleClick = () => {
    setIsTaskEditing(true);
  };

  const handleOpenTaskDetails = () => {
    dispatch(setOpenTaskDetails(task));
  };

  useDoubleClick({
    onSingleClick: (e) => {
      if (!isTaskEditing) handleOpenTaskDetails();
    },
    onDoubleClick: (e) => {
      if (!isTaskEditing && !task.delegatestatus && task.status !== "done") {
        handleTaskDoubleClick();
        setIsTaskEditing(true);
      }
    },
    ref: buttonRef,
    latency: 250,
  });

  const updateTask = () => {
    chrome.storage.sync.get(["accessToken"], function (r) {
      const token = r.accessToken;
      const UPDATE_TASK_URL = "https://whush.pro/api/api/updateTask";
      fetch(UPDATE_TASK_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({ ...task }),
      });
    });
  };

  const handleTaskSaveAndCancelEditing = (e) => {
    setTask({
      ...task,
      id: task.id,
      taskDetails: e.target.value,
    });
    setIsTaskEditing(false);
    updateTask(task);
  };

  const renderIcon = () => {
    if (task.delegatestatus && task.delegatestatus === "0") {
      return <CloseOutlined style={{ fontSize: "18px", color: "red" }} />;
    }
    if (
      task.delegatestatus &&
      task.delegatestatus === "1" &&
      task.status !== "done"
    ) {
      return <CheckOutlined style={{ fontSize: "18px", color: "green" }} />;
    } else {
      return (
        <Checkbox
          key={task.id}
          className="task-done-checkbox"
          checked={task.status === "done" ? true : false}
          onChange={onChange}
        />
      );
    }
  };

  return (
    <>
      {renderIcon()}
      <div className="task-name-tooltip" ref={buttonRef}>
        <div className="task-tooltip" ref={setTriggerRef}>
          <Input
            readOnly={isTaskEditing ? false : true}
            onChange={handleTaskChange}
            onBlur={handleTaskSaveAndCancelEditing}
            value={task.taskDetails}
            className={isTaskEditing ? "task-edit" : "task-item-normal"}
          />
        </div>
        {visible && showToolTip && !isTaskEditing && (
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
      <div className="task-date-time">{`${task.date} ${task.time}`}</div>
      <div className="task-action-items-btn-container">
        {task.status !== "done" ? (
          <EditFilled onClick={handleEditFullTask} />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default TaskListItem;
