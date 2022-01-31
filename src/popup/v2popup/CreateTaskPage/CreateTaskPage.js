import React, {useEffect, useState} from "react";
import BackButtonIcon from '../../../assets/v2assets/back-icon.svg';
import './create-task-page.css';
import {Input, DatePicker, TimePicker, message, Upload, Spin} from "antd";
import moment from "moment";
import { Menu, Dropdown } from 'antd';
import RadioUnselected from '../../../assets/v2assets/radio-unselected.svg';
import RadioSelected from '../../../assets/v2assets/radio-selected.svg';
import CameraIcon from '../../../assets/v2assets/camera.svg';
import AttachIcon from '../../../assets/v2assets/attach-icon.svg';
import {UpOutlined, DownOutlined} from "@ant-design/icons";
import {PRIORITIES, TASK_TYPE} from "../../../constants";
import {fetchDraftedTasks, FetchTasks, setHasAccount, setIsTaskDrafted, setNewTask} from "../../../actions/actions";
import chrome from "../../../components/chrome";
import {encode} from "js-base64";
import {useDispatch, useSelector} from "react-redux";
import {selectIsTaskDrafted} from "../../../selectors/selectors";

export default function CreateTaskPage(props) {
  const [taskDetails, setTaskDetails] = useState(props.newTask || "");  // Task Title
  const isTaskDrafted = useSelector(selectIsTaskDrafted);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("00:00");
  const [taskType, setTaskType] = useState(TASK_TYPE.REMINDER);
  const [priority, setPriority] = useState(PRIORITIES.none);
  const [assignedTo, setAssignedTo] = useState("");
  const [fileList, setFileList] = useState(undefined);
  const [isScreenshotInProgress, setIsScreenshotInProgress] = useState(false);
  const [labelName, setLabelName] = useState(null);
  const [advancedDescription, setAdvancedDescription] = useState(undefined);
  const dispatch = useDispatch();
  const [showAdditionalInfo, setShowAdditionalIInfo] = useState(false);
  const [labelDropDownVisible, setLabelDropDownVisible] = useState(false);


  const handleTimeChange = (val) => {
    console.log(val);
    if(!val) {
      setTime("00:00");
    } else {
      const timeString = moment(val._d).format("HH:mm");
      setTime(timeString);
    }
  };

  const showSuccessMessage = (successMsg) => {
    message.success(successMsg);
  };

  useEffect(() => {
    localStorage.removeItem("screenshotData");
    localStorage.removeItem("isScreenshotTaken");
  }, []);

  useEffect(() => {
    if (isTaskDrafted) {
      saveDraftedTask();
      fetchDraftedTasks(dispatch);
      handleCreateTaskSuccess();
      dispatch(setIsTaskDrafted(false));
    }
  });

  const attachScreenshot = async () => {
    chrome.storage.local.get(["screenshotContent"], function (r) {
      const imageBase64 = r.screenshotContent;
      const newFile = {
        uid: "-1",
        name: "screenshot.jpeg",
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

  const handlePriorityChange = (priority) => {
    setPriority(priority);
  };

  const handleDateChange = (val) => {
    let date = new Date(val._d);
    let dateString = date.getTime();
    setDate(dateString);
  };

  const handleCreateTaskSuccess = () => {
    dispatch(setNewTask(""));
    props.onCancelCreateTask();
    FetchTasks(dispatch);
    chrome.storage.sync.remove("newTask", function () {
      console.log("Successfully removed the new task *******");
    });
  };

  const saveDraftedTask = () => {
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
          const DRAFT_TASK_URL = "https://whush.pro/api/api/createDraftedTask";
          const data = {
            assignedTo:
              taskType === "reminder" ? assignedBy : assignedTo,
            assignedBy: assignedBy,
            taskDetails: taskDetails,
            actionType: taskType,
            time: moment(time, "HH:mm").valueOf(),
            date: date || new Date().getTime(),
            priority: priority,
            status: "active",
            userId: userId,
            description:
              (advancedDescription && encode(advancedDescription)) || null,
            attachment: files || null,
          };
          fetch(DRAFT_TASK_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.message) {
                handleCreateTaskSuccess();
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
      // message.error("Oops! Task details can't be empty");
    }
  };

  const createNewTaskInAPI = function () {
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
          const CREATE_TASK_URL = "https://whush.pro/api/api/createTask";
          const data = {
            label: labelName,
            assignedTo:
              taskType === "reminder" ? assignedBy : assignedTo,
            assignedBy: assignedBy,
            taskDetails: taskDetails,
            actionType: taskType,
            time: moment(time, "HH:mm").valueOf(),
            date: date || new Date().getTime(),
            priority: priority,
            status: "active",
            userId: userId,
            description:
              (advancedDescription && encode(advancedDescription)) || null,
            attachment: files || null,
          };
          fetch(CREATE_TASK_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.message) {
                handleCreateTaskSuccess();
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

  const handleCreateTask = () => {
    createNewTaskInAPI();
  };

  const handleSaveDraftedTask = () => {
    dispatch(setIsTaskDrafted(true));
  };

  const closeCreateTaskWindow = () => {
    dispatch(setNewTask(""));
    props.onCancelCreateTask();
    FetchTasks(dispatch);
    chrome.storage.sync.remove("newTask", function () {
      console.log("Successfully removed the new task *******");
    });
  };

  const LabelMenu = () => {
    return <Menu>
      {/*<Menu.Item key="0">*/}
      {/*  <div onClick={() => setLabelDropDownVisible(false)}>1st menu item</div>*/}
      {/*</Menu.Item>*/}
      {/*<Menu.Item key="1">*/}
      {/*  <div onClick={() => setLabelDropDownVisible(false)}>2nd menu item</div>*/}
      {/*</Menu.Item>*/}
      <Menu.Divider />
      <Menu.Item key="3">
        <div className="label-dropdown-add-input">
        <Input
          className="task-input__input-field"
          style={{marginTop: 0, padding: 20, width: undefined}}
          type="text"
          placeholder="Add New Label"
          onChange={() => {}}
          required
        />
          <div className="button button--dark label-add-button">+</div>
        </div>
      </Menu.Item>
    </Menu>
  }

  return (
    <div className="page-content-padding create-task-page">
      <div className="top-bar">
        <div className="top-bar__back-button" onClick={closeCreateTaskWindow}>
          <img className="top-bar__back-button__img" src={BackButtonIcon} />
        </div>
        <div className="top-bar__title">Create Task</div>
        <div className="top-bar__draft-button" onClick={handleSaveDraftedTask}>Save As Draft</div>
      </div>
      <div className="task-input">
        <div className="task-input__task-name-label">Task Name</div>
        <div className="task-input__task-name-input">
          <Input
            className="task-input__input-field"
            type="email"
            placeholder="Get Groceries"
            onChange={e => setTaskDetails(e.target.value)}
            value={taskDetails}
            required
          />
        </div>

        <div className="task-input__radio-title">Task Type</div>
        <div className="task-input__radio-container">
          <div
            className="task-input__radio-input"
            onClick={() => setTaskType(TASK_TYPE.REMINDER)}
          >
            <img src={taskType === TASK_TYPE.REMINDER ? RadioSelected : RadioUnselected}/>
            <div className="task-input__radio-input__radio-label">Reminder</div>
          </div>
          <div
            className="task-input__radio-input"
            onClick={() => setTaskType(TASK_TYPE.NOTIFY)}
          >
            <img src={taskType === TASK_TYPE.NOTIFY ? RadioSelected : RadioUnselected}/>
            <div className="task-input__radio-input__radio-label">Notify</div>
          </div>
          <div
            className="task-input__radio-input"
            onClick={() => setTaskType(TASK_TYPE.DELEGATE)}
          >
            <img src={taskType === TASK_TYPE.DELEGATE ? RadioSelected : RadioUnselected}/>
            <div className="task-input__radio-input__radio-label">Delegate</div>
          </div>

        </div>
        <div style={{display: taskType === TASK_TYPE.NOTIFY || taskType === TASK_TYPE.DELEGATE ? undefined: "none"}}>
          <div className="task-input__add-people-label">{`${taskType === TASK_TYPE.NOTIFY ? "Notify" : "Delegate"} To`}</div>
          <div className="task-input__add-people-input">
            <Input
              className="task-input__input-field"
              type="email"
              placeholder="johndoe@gmail.com"
              onChange={e => setAssignedTo(e.target.value)}
              value={assignedTo}
              required
            />
          </div>
        </div>

        <div className="task-input__radio-title">Priority</div>
        <div className="task-input__radio-container">
          <div
            className="task-input__radio-input"
            onClick={() => setPriority(PRIORITIES.none)}
          >
            <img src={priority === PRIORITIES.none ? RadioSelected : RadioUnselected}/>
            <div className="task-input__radio-input__radio-label">None</div>
          </div>
          <div
            className="task-input__radio-input"
            onClick={() => setPriority(PRIORITIES.high)}
          >
            <img src={priority === PRIORITIES.high ? RadioSelected : RadioUnselected}/>
            <div className="task-input__radio-input__radio-label">High</div>
          </div>
          <div
            className="task-input__radio-input"
            onClick={() => setPriority(PRIORITIES.medium)}
          >
            <img src={priority === PRIORITIES.medium ? RadioSelected : RadioUnselected}/>
            <div className="task-input__radio-input__radio-label">Medium</div>
          </div>
          <div
            className="task-input__radio-input"
            onClick={() => setPriority(PRIORITIES.low)}
          >
            <img src={priority === PRIORITIES.low ? RadioSelected : RadioUnselected}/>
            <div className="task-input__radio-input__radio-label">Low</div>
          </div>
        </div>

        <div className="task-input__date-time">
          <div className="task-input__date">
            <div className="task-input__date-label">Date</div>
            <div className="task-input__date-input">
              <DatePicker
                placeholder="YYYY-MM-DD"
                className="ant-datepicker-custom"
                defaultValue={moment()}
                onChange={handleDateChange}
                disabledDate={(current) => {
                  return current && current < moment().startOf("day");
                }}
              />
            </div>
          </div>
          <div className="task-input__time">
            <div className="task-input__time-label">Time</div>
            <div className="task-input__time-input">
              <TimePicker
                placeholder="HH:MM"
                className="ant-timepicker-custom"
                format="HH:mm"
                value={moment(time, "HH:mm")}
                showNow={false}
                minuteStep={15}
                onChange={handleTimeChange}
                onSelect={handleTimeChange}
              />
            </div>
          </div>
        </div>

        <div
          className="additional-info"
          style={{display: showAdditionalInfo ? undefined : 'none'}}
        >
          <div className="additional-info__task-label">
            <div className="additional-info__task-label-label">Label Name</div>
            <div className="task-input__task-name-input">
              <Input
                className="task-input__input-field"
                type="label Name"
                placeholder="Label Name here"
                onChange={e => setLabelName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="additional-info__note-label">Note</div>
          <div>
            <Input.TextArea
              className="task-input__input-field additional-info__note-input"
              type="text"
              placeholder="Add additional information here"
              value={advancedDescription || ""}
              onChange={e => handleAdvancedDescription(e.target.value)}
              required
            />
          </div>

          <div className="attach-buttons">
            <div className="button button--white attach-buttons__attach-file attach-button-icon-relative">
              <Upload
                accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"
                maxCount={1}
                fileList={fileList}
                onChange={handleFileChange}
              >
                <img src={AttachIcon} className="attach-button-icon" />
                Add Attachment
              </Upload>
            </div>
            <div
              className="button button--white attach-buttons__screenshot attach-button-icon-relative"
              onClick={handleTakeScreenshot}>
              <img src={CameraIcon} className="attach-button-icon" />
              Screenshot
            </div>
          </div>

        </div>
        {isScreenshotInProgress ? <Spin /> : ""}

        <div className="action-buttons">
          <div
            className="button button--white action-buttons__additional-info"
            onClick={() => setShowAdditionalIInfo(true)}
            style={{display: showAdditionalInfo ? "none" : undefined}}
          >
            Additional Info
          </div>
          <div
            className="button button--dark action-buttons__create-task"
            onClick={handleCreateTask}
            style={{marginLeft: showAdditionalInfo ? 0 : undefined}}
          >
            Create Task
          </div>
        </div>
      </div>
    </div>
  );
}
