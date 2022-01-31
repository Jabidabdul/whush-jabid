import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import chrome from "../components/chrome";
import moment from "moment";
import "./CreateTask.css";
import { encode } from "js-base64";
import { FetchTasks, setNewTask } from "../actions/actions";
import AdvancedOptions from "../components/AdvancedOptions";
import {
  Form,
  Select,
  DatePicker,
  TimePicker,
  Input,
  Button,
  message,
  Tooltip,
} from "antd";
import {
  CaretDownOutlined,
  CaretRightOutlined,
  InfoCircleFilled,
} from "@ant-design/icons";
import { setIsTaskDrafted, fetchDraftedTasks } from "../actions/actions";
import { selectIsTaskDrafted } from "../selectors/selectors";
import {CreateTaskPage} from "./v2popup";

const { Option } = Select;

function CreateTask(props) {
  const [action, setAction] = useState("Reminder");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(moment().format("HH:mm"));
  const [taskDetails, setTaskDetails] = useState(props.newTask || "");
  const [isActionDelegate, setIsActionDelegate] = useState(false);
  const [isActionNotify, setIsActionNotify] = useState(false);
  const [placeHolderText, setPlaceHolderText] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("High");
  const [showAdvanceOptions, setShowAdvanceOptions] = useState(false);
  const dispatch = useDispatch();
  const [advancedDescription, setAdvancedDescription] = useState(undefined);
  const [fileList, setFileList] = useState(undefined);
  const [isScreenshotInProgress, setIsScreenshotInProgress] = useState(false);
  const isTaskDrafted = useSelector(selectIsTaskDrafted);

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

  const priorityMap = {
    Urgent: 1,
    High: 2,
    Medium: 3,
    Low: 4,
  };

  const placeholders = {
    delegate: "Whom to Delegate. Eg. abc@gmail.com",
    notify: "Whom to Notify. Eg. abc@gmail.com",
  };

  const handleAssignedTo = (event) => {
    setAssignedTo(event.target.value);
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
    setPriority(priority);
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
              action.toLowerCase() === "reminder" ? assignedBy : assignedTo,
            assignedBy: assignedBy,
            taskDetails: taskDetails,
            actionType: action,
            time: moment(time, "HH:mm").valueOf(),
            date: date || new Date().getTime(),
            priority: priorityMap[priority],
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
      message.error("Oops! Task details can't be empty");
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
            assignedTo:
              action.toLowerCase() === "reminder" ? assignedBy : assignedTo,
            assignedBy: assignedBy,
            taskDetails: taskDetails,
            actionType: action,
            time: moment(time, "HH:mm").valueOf(),
            date: date || new Date().getTime(),
            priority: priorityMap[priority],
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

  return <CreateTaskPage {...props}/>
    //   <div style={{display: "flex"}}>
    //     <Form className="card">
    //       <Form.Item className="item">
    //         <Input
    //           placeholder="Task Details Eg. Fill electricity bill"
    //           onChange={(event) => setTaskDetails(event.target.value)}
    //           value={taskDetails}
    //         />
    //       </Form.Item>
    //       <Form.Item className="item">
    //         <Select
    //           placeholder="Action"
    //           className="taskType"
    //           defaultValue="Reminder"
    //           onChange={handleChange}
    //         >
    //           <Option value="Reminder">
    //             Reminder
    //             <Tooltip
    //               title="Remind yourself before 20 and 5 min before the scheduled time."
    //               className="action-type-tooltip"
    //             >
    //               <InfoCircleFilled/>
    //             </Tooltip>
    //           </Option>
    //           <Option value="Delegate">
    //             Delegate
    //             <Tooltip
    //               title="Delegate the task to somebody else by providing their email address."
    //               className="action-type-tooltip"
    //             >
    //               <InfoCircleFilled/>
    //             </Tooltip>
    //           </Option>
    //           <Option value="Notify">
    //             Notify
    //             <Tooltip
    //               title="Notify the task to someone else by providing their email address."
    //               className="action-type-tooltip"
    //             >
    //               <InfoCircleFilled/>
    //             </Tooltip>
    //           </Option>
    //         </Select>
    //       </Form.Item>
    //       {isActionDelegate || isActionNotify ? (
    //         <Form.Item className="item">
    //           <Input
    //             onChange={handleAssignedTo}
    //             placeholder={placeHolderText}
    //           ></Input>
    //         </Form.Item>
    //       ) : (
    //         ""
    //       )}
    //       <Form.Item className="item">
    //         <Select
    //           placeholder="Priority"
    //           className="priority"
    //           defaultValue="Urgent"
    //           onChange={handlePriorityChange}
    //         >
    //           <Option value="Urgent">Urgent</Option>
    //           <Option value="High">High</Option>
    //           <Option value="Medium">Medium</Option>
    //           <Option value="Low">Low</Option>
    //         </Select>
    //       </Form.Item>
    //       <Form.Item className="item">
    //         <DatePicker
    //           defaultValue={moment()}
    //           onChange={handleDateChange}
    //           disabledDate={(current) => {
    //             return current && current < moment().startOf("day");
    //           }}
    //         />
    //       </Form.Item>
    //       <Form.Item className="item">
    //         <TimePicker
    //           format="HH:mm"
    //           value={moment(time, "HH:mm")}
    //           showNow={false}
    //           minuteStep={15}
    //           onChange={handleTimeChange}
    //           onSelect={handleTimeChange}
    //         />
    //       </Form.Item>
    //       <div className="advance-option-container">
    //         {showAdvanceOptions ? (
    //           <CaretDownOutlined onClick={() => setShowAdvanceOptions(false)}/>
    //         ) : (
    //           <CaretRightOutlined onClick={() => setShowAdvanceOptions(true)}/>
    //         )}
    //         Show Advanced Options
    //       </div>
    //       {showAdvanceOptions ? (
    //         <AdvancedOptions
    //           isScreenshotInProgress={isScreenshotInProgress}
    //           handleAdvancedDescription={handleAdvancedDescription}
    //           handleFileChange={handleFileChange}
    //           advancedDescription={advancedDescription}
    //           handleTakeScreenshot={handleTakeScreenshot}
    //           fileList={fileList}
    //         />
    //       ) : (
    //         ""
    //       )}
    //       <Form.Item className="create-action-btns-container">
    //         <Button
    //           className="cancel-create-task-btn"
    //           type="primary"
    //           onClick={props.onCancelCreateTask}
    //           block
    //         >
    //           Cancel
    //         </Button>
    //         <Button
    //           className="create-task-btn"
    //           type="primary"
    //           onClick={handleCreateTask}
    //           block
    //         >
    //           Create Task
    //         </Button>
    //       </Form.Item>
    //     </Form>
    //   </div>
    // )}
}

export default CreateTask;
