import React, { useState, useEffect } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Select,
  DatePicker,
  TimePicker,
  Input,
  message,
  Tooltip,
} from "antd";

import {
  CaretDownOutlined,
  CaretRightOutlined,
  InfoCircleFilled,
} from "@ant-design/icons";
import { Button } from "antd";
import chrome from "../components/chrome";
import "./EditTask.css";
import AdvancedOptions from "./AdvancedOptions";
import {
  FetchTasks,
  setTaskInEditing,
  fetchDraftedTasks,
  setIsDraftedTaskOpen,
  setIsTaskDrafted,
} from "../actions/actions";
import {
  selectIsDraftedTaskOpen,
  selectIsTaskDrafted,
} from "../selectors/selectors";
import { encode, decode } from "js-base64";

const { Option } = Select;

function EditTask(props) {
  const task = props.task;
  const dispatch = useDispatch();
  const [action, setAction] = useState(task.actionType);
  const [taskDetails, setTaskDetails] = useState(task.taskDetails);
  const [date, setDate] = useState(task.date);
  const taskTimeArray = task.time.split(":");
  taskTimeArray.pop();
  const [time, setTime] = useState(taskTimeArray.join(":"));
  const [showAdvanceOptions, setShowAdvanceOptions] = useState(false);
  const [advancedDescription, setAdvancedDescription] = useState(undefined);
  const [fileList, setFileList] = useState(undefined);
  const [isActionDelegate, setIsActionDelegate] = useState(
    action.toLowerCase() === "delegate" ? true : false
  );
  const [isActionNotify, setIsActionNotify] = useState(
    action.toLowerCase() === "notify" ? true : false
  );
  const [placeHolderText, setPlaceHolderText] = useState("");
  const [assignedTo, setAssignedTo] = useState(task.assignedTo);
  const [priority, setPriority] = useState(task.priority);
  const [isScreenshotInProgress, setIsScreenshotInProgress] = useState(false);
  const isDraftedTaskOpen = useSelector(selectIsDraftedTaskOpen);
  const isTaskDrafted = useSelector(selectIsTaskDrafted);

  const priorityMap = {
    1: "Urgent",
    2: "High",
    3: "Medium",
    4: "Low",
  };

  useEffect(() => {
    if (isTaskDrafted) {
      updateDraftedTask();
      fetchDraftedTasks(dispatch);
      dispatch(setTaskInEditing({}));
      dispatch(setIsTaskDrafted(false));
    }
  });

  const updateDraftedTask = () => {
    if (taskDetails) {
      chrome.storage.sync.get(
        ["userId", "accessToken", "userEmail"],
        function (r) {
          const userId = r.userId;
          const token = r.accessToken;
          const assignedBy = r.userEmail;
          const filesBase64 = fileList && fileList.map((e) => e.base64);
          const files =
            filesBase64 && `[${filesBase64.map((e) => `'${e}'`).join(",")}]`;
          const DRAFT_TASK_URL = `https://whush.pro/api/api/updateDraftedTask/${task.id}`;
          const data = {
            assignedTo:
              action.toLowerCase() === "reminder" ? assignedBy : assignedTo,
            assignedBy: assignedBy,
            taskDetails: taskDetails,
            actionType: action,
            time: moment(time, "HH:mm").valueOf(),
            date: new Date(date).getTime() || new Date().getTime(),
            priority: priorityMap[priority],
            status: "active",
            userId: userId,
            description:
              (advancedDescription && encode(advancedDescription)) || null,
            attachment: files || null,
          };
          fetch(DRAFT_TASK_URL, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.message) {
                fetchDraftedTasks(dispatch);
              }
              if (data.errormessage) {
                console.log(data.errormessage);
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      );
    } else {
      message.error("Oops! Task details can't be empty");
    }
  };

  useEffect(() => {
    localStorage.removeItem("screenshotData");
    localStorage.removeItem("isScreenshotTaken");
    chrome.storage.local.remove("screenshotContent");
    chrome.storage.local.remove("isScreenshotTaken");
    const attachmentUrl = task.attachment;
    if (task.description) {
      fetch(`${task.description}`, {
        method: "GET",
      })
        .then((response) => response.text())
        .then((description) => {
          setAdvancedDescription(decode(description));
        });
    }
    if (attachmentUrl) {
      fetch(`${attachmentUrl}`, {
        method: "GET",
      })
        .then((response) => response.text())
        .then((attachmentData) => {
          const fileExtension = attachmentData
            .split("'")[1]
            .split(";")[0]
            .split("/")[1];

          const newFile = {
            uid: "-1",
            name: `attachment.${fileExtension}`,
            status: "done",
            base64: attachmentData.split("'")[1],
          };
          setFileList([newFile]);
        });
    }
  }, []);

  const removeDraftedTask = (id) => {
    const DELETE_TASK_URL = `https://whush.pro/api/api/deleteDraftedTask/${id}`;
    chrome.storage.sync.get(["accessToken"], function (r) {
      const token = r.accessToken;
      fetch(DELETE_TASK_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            fetchDraftedTasks(dispatch);
          }
          if (data.errormessage) {
            console.log(data.errormessage);
          }
        });
    });
  };

  const showSuccessMessage = (successMsg) => {
    message.success(successMsg);
  };

  const attachScreenshot = async () => {
    chrome.storage.local.get(["screenshotContent"], function (r) {
      const imageBase64 = r.screenshotContent;
      const newFile = {
        uid: "2",
        name: "attachment.jpeg",
        status: "done",
        base64: imageBase64,
      };
      showSuccessMessage("Successfully taken and attached the screenshot!");
      setFileList([newFile]);
    });
  };

  const setScreenshotData = async () => {
    const attachdScreenshotData = await attachScreenshot();
    chrome.storage.local.remove("screenshotContent", function () {
      console.log("Successfully removed the item");
    });
    chrome.storage.local.remove("isScreenshotTaken", function () {
      console.log("Successfully removed the isScreenshotTaken");
      localStorage.removeItem("isScreenshotTaken");
    });
  };

  const handleTakeScreenshot = async () => {
    setIsScreenshotInProgress(true);
    await chrome.tabs.query(
      { currentWindow: true, active: true },
      function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { message: "screenshot" });
      }
    );

    const getLocalStorageValue = () => {
      chrome.storage.local.get(["isScreenshotTaken"], function (r) {
        localStorage.setItem("isScreenshotTaken", r.isScreenshotTaken);
      });
    };

    let watchScreenshotState = () => {
      const result = localStorage.getItem("isScreenshotTaken");
      if (result == "true") {
        clearInterval(screenshotWatcher);
        setIsScreenshotInProgress(false);
        setScreenshotData();
      } else {
        getLocalStorageValue();
      }
    };

    const screenshotWatcher = setInterval(watchScreenshotState, 500);
  };

  const handleAdvancedDescription = (value) => {
    setAdvancedDescription(value);
  };

  const handleFileChange = ({ file, fileList }) => {
    if (file.status !== "uploading") {
      fileList.forEach(function (file, index) {
        let reader = new FileReader();
        reader.onload = (e) => {
          file.base64 = e.target.result;
        };
        reader.readAsDataURL(file.originFileObj);
      });
      setFileList(fileList);
    }
  };

  const toTitleCase = (string) => {
    return string[0].toUpperCase() + string.split("").slice(1).join("");
  };

  const placeholders = {
    delegate: "Whom to Delegate. Eg. abc@gmail.com",
    notify: "Whom to Notify. Eg. abc@gmail.com",
  };

  const handleAssignedTo = (event) => {
    setAssignedTo(event.target.value);
  };

  const handleTaskDetails = (event) => {
    setTaskDetails(event.target.value);
  };

  const handleChange = function (value) {
    const actionType = value.toLowerCase();
    setAction(actionType);
    if (actionType === "delegate") {
      setIsActionDelegate(true);
      return setPlaceHolderText(placeholders[actionType]);
    }
    if (actionType === "notify") {
      setIsActionNotify(true);
      return setPlaceHolderText(placeholders[actionType]);
    } else {
      setIsActionDelegate(false);
      return setIsActionNotify(false);
    }
  };

  const handlePriorityChange = (priority) => {
    const priorityNumber = parseInt(
      Object.keys(priorityMap).filter((e) => priorityMap[e] === priority)[0]
    );
    setPriority(priorityNumber);
  };

  const handleDateChange = (val) => {
    let date = new Date(val._d);
    let dateString = date.getTime();
    setDate(dateString);
  };

  const handleTimeChange = (val) => {
    const timeString = moment(val._d).format("HH:mm");
    setTime(timeString);
  };

  const handleCancelTaskEdit = () => {
    dispatch(setTaskInEditing({}));
  };

  const updateTask = function () {
    if (taskDetails) {
      chrome.storage.sync.get(
        ["userId", "userEmail", "accessToken"],
        function (r) {
          const assignedBy = r.userEmail;
          const token = r.accessToken;
          const userId = r.userId;
          const UPDATE_TASK_URL = "https://whush.pro/api/api/updateTask";
          const CREATE_TASK_URL = `https://whush.pro/api/api/createTask`;
          const URL = isDraftedTaskOpen ? CREATE_TASK_URL : UPDATE_TASK_URL;
          const METHOD = isDraftedTaskOpen ? "POST" : "PUT";
          const filesBase64 = fileList && fileList.map((e) => e.base64);
          const files =
            filesBase64 && `[${filesBase64.map((e) => `'${e}'`).join(",")}]`;
          const dateToSend = date.toString().split("").includes("-")
            ? new Date(date).getTime()
            : date;
          const data = {
            userId: userId,
            id: task.id,
            assignedTo: assignedTo || assignedBy,
            assignedBy: assignedBy || assignedBy,
            taskDetails: taskDetails,
            actionType: action,
            time: moment(time, "HH:mm").valueOf(),
            date: dateToSend,
            priority: priority,
            status: "active",
            description:
              (advancedDescription && encode(advancedDescription)) || null,
            attachment: files || null,
          };
          fetch(URL, {
            method: METHOD,
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.message) {
                if (isDraftedTaskOpen) {
                  removeDraftedTask(task.id);
                  dispatch(setIsDraftedTaskOpen(false));
                }
                dispatch(setTaskInEditing({}));
                FetchTasks(dispatch);
              }
              if (data.errormessage) {
                console.log(data.errormessage);
              }
            });
        }
      );
    } else {
      message.error("Oops! Task details can't be empty");
    }
  };

  const handleSaveTask = () => {
    updateTask(task);
  };

  return (
    <div style={{ display: "flex" }}>
      <Form className="card">
        <Form.Item className="item">
          <Input onChange={handleTaskDetails} defaultValue={taskDetails} />
        </Form.Item>
        <Form.Item className="item">
          <Select
            placeholder="Action"
            className="taskType"
            onChange={handleChange}
            value={toTitleCase(action)}
          >
            <Option value="Reminder">
              Reminder
              <Tooltip
                title="Remind yourself before 20 and 5 min before the scheduled time."
                className="action-type-tooltip"
              >
                <InfoCircleFilled />
              </Tooltip>
            </Option>
            <Option value="Delegate">
              Delegate
              <Tooltip
                title="Delegate the task to somebody else by providing their email address."
                className="action-type-tooltip"
              >
                <InfoCircleFilled />
              </Tooltip>
            </Option>
            <Option value="Notify">
              Notify
              <Tooltip
                title="Notify the task to someone else by providing their email address."
                className="action-type-tooltip"
              >
                <InfoCircleFilled />
              </Tooltip>
            </Option>
          </Select>
        </Form.Item>
        {isActionDelegate || isActionNotify ? (
          <Form.Item className="item">
            <Input
              onChange={handleAssignedTo}
              placeholder={placeHolderText}
              defaultValue={assignedTo}
            ></Input>
          </Form.Item>
        ) : (
          ""
        )}
        <Form.Item className="item">
          <Select
            placeholder="Priority"
            className="priority"
            onChange={handlePriorityChange}
            value={priorityMap[priority]}
          >
            <Option value="Urgent">Urgent</Option>
            <Option value="High">High</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Low">Low</Option>
          </Select>
        </Form.Item>
        <Form.Item className="item">
          <DatePicker
            defaultValue={moment(date, "YYYY-MM-DD")}
            onChange={handleDateChange}
            disabledDate={(current) => {
              return current && current < moment().startOf("day");
            }}
          />
        </Form.Item>
        <Form.Item className="item">
          <TimePicker
            format="HH:mm"
            value={moment(time, "HH:mm")}
            showNow={false}
            minuteStep={15}
            onChange={handleTimeChange}
            onSelect={handleTimeChange}
          />
        </Form.Item>
        <div className="advance-option-container">
          {showAdvanceOptions ? (
            <CaretDownOutlined onClick={() => setShowAdvanceOptions(false)} />
          ) : (
            <CaretRightOutlined onClick={() => setShowAdvanceOptions(true)} />
          )}
          Show Advanced Options
        </div>
        {showAdvanceOptions ? (
          <AdvancedOptions
            isScreenshotInProgress={isScreenshotInProgress}
            handleAdvancedDescription={handleAdvancedDescription}
            handleFileChange={handleFileChange}
            advancedDescription={advancedDescription}
            handleTakeScreenshot={handleTakeScreenshot}
            fileList={fileList}
          />
        ) : (
          ""
        )}
        <Form.Item className="action-btns-container">
          <Button
            className="cancel-task-edit-btn"
            type="primary"
            onClick={handleCancelTaskEdit}
            block
          >
            Cancel
          </Button>
          <Button
            className="save-task-btn"
            type="primary"
            onClick={handleSaveTask}
            block
          >
            Save Task
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default EditTask;
