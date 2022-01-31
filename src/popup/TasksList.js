import React, { Fragment, useEffect, useState } from "react";
import {Progress, List, Collapse, Layout, message, Button} from "antd";
import {
  selectTasks,
  selectGoogleCalendarTasks,
  selectOpenTask,
  selectIsUserProfileSettingOpen,
  selectDraftedTasks,
} from "../selectors/selectors";
import { useDispatch, useSelector } from "react-redux";
import { ReloadOutlined, SettingOutlined } from "@ant-design/icons";
import {
  FetchTasks,
  fetchGoogleCalendarTasks,
  setOpenTaskDetails,
  setIsUserProfileSettingOpen,
  setIsLoggedIn,
  setActiveUserProfileMenu,
  fetchDraftedTasks,
} from "../actions/actions";
import TaskListItem from "../components/TaskListItem";
import GoogleTaskListItem from "../components/GoogleTaskListItem";
import DraftedTaskListItem from "../components/DraftedTaskListItem";
import "./TasksList.css";
import TaskDetails from "./TaskDetails";
import UserProfileMenu from "../components/UserProfileMenu";
import chrome from "../components/chrome";
import {HomePage} from "./v2popup";

const { Content } = Layout;
const { Panel } = Collapse;

function TasksList({setOverlay, overlay, setDraftsPageOpen, handleCreateNewTask, ...props}) {
  const [testNewUI, setTestNewUI] = useState(true);
  const dispatch = useDispatch();
  const userTasks = useSelector(selectTasks);
  const googleCalendarTasks =
    useSelector(selectGoogleCalendarTasks)["googleCalendarTasks"] || [];
  const googleCalendarColors =
    useSelector(selectGoogleCalendarTasks)["googleCalendarColors"] || {};
  const currentTasks = userTasks.currentTask || [];
  const overdueTasks = userTasks.overDueTask || [];
  const futureTasks = userTasks.futureTask || [];
  const delegatAndNotifiedTasks = userTasks.delegatAndNotified || [];
  const draftedTasks = useSelector(selectDraftedTasks) || [
    {
      id: 98029,
      assignedTo: "maheshsovani2012@gmail.com",
      assignedBy: "maheshsovani2012@gmail.com",
      taskDetails: "Testing the drafted task flow",
      actionType: "reminder",
      priority: 2,
      date: "2021-09-15",
      time: "08:16",
      status: "active",
      delegatestatus: null,
      taskLinkto: null,
      description: null,
      attachment: null,
      userId: 1,
    },
  ];
  const [calendarSynced, setCalendarSynced] = useState(false);
  const openTaskDetails = useSelector(selectOpenTask);
  const isTaskDetailsOpen =
    Object.keys(openTaskDetails).length === 0 ? false : true;
  const [doneTaskPercent, setDoneTaskPercent] = useState(0);
  const [showOverdueTaskUndo, setShowOverdueTaskUndo] = useState(undefined);
  const isUserProfileSettingOpen = useSelector(selectIsUserProfileSettingOpen);


  // console.log("currentTasks", currentTasks);
  // console.log("overdueTasks", overdueTasks);
  // console.log("futureTasks", futureTasks);
  // console.log("delegatAndNotifiedTasks", delegatAndNotifiedTasks);
  // console.log("draftedTasks", draftedTasks);
  // console.log("googleCalendarTasks", googleCalendarTasks);


  const updateTaskStatus = async (taskId, status) => {
    console.log("Delete the other task  : " + taskId, status);
    await chrome.storage.sync.get(["accessToken"], function (r) {
      const token = r.accessToken;
      const UPDATE_TASK_URL = "https://whush.pro/api/api/taskstatus";
      fetch(UPDATE_TASK_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({ id: taskId, status: status }),
      }).then((data) => {
        handleRefreshTasksList();
      });
    });
  };

  const handleOverdueTaskUndo = (event) => {
    event.stopPropagation();
    localStorage.setItem("isUndoOverdueTaskEnabled", false);
    setShowOverdueTaskUndo(false);
  };

  const handleOverdueTaskUpdateStatus = (taskId, status) => {
    setShowOverdueTaskUndo(true);
    localStorage.setItem("isUndoOverdueTaskEnabled", true);
    setTimeout(() => {
      if (localStorage.getItem("isUndoOverdueTaskEnabled") == "true") {
        setShowOverdueTaskUndo(false);
        localStorage.removeItem("isUndoOverdueTaskEnabled");
        updateTaskStatus(taskId, status);
      } else {
        localStorage.removeItem("isUndoOverdueTaskEnabled");
        setShowOverdueTaskUndo(false);
      }
    }, 6000);
  };

  const calculateDoneTaskPercentage = () => {
    const doneTasks = currentTasks.filter((e) => e.status === "done");
    return Math.round((doneTasks.length / currentTasks.length) * 100);
  };

  useEffect(() => {
    setDoneTaskPercent(calculateDoneTaskPercentage());
  });

  useEffect(() => {
    FetchTasks(dispatch);
    setDoneTaskPercent(calculateDoneTaskPercentage());
    fetchDraftedTasks(dispatch);
    fetchGoogleCalendarTasks(dispatch, "false");
  }, []);

  const handleBackToEventsList = () => {
    dispatch(setOpenTaskDetails({}));
  };

  const handleRefreshTasksList = () => {
    FetchTasks(dispatch);
    setDoneTaskPercent(calculateDoneTaskPercentage());
  };

  const handleRefreshCalendarTasks = (event) => {
    event.stopPropagation();
    fetchGoogleCalendarTasks(dispatch, "true");
    message.success("Successfully refreshed calendar(s)!");
    setCalendarSynced(true);
  };

  const handleUserProfileSettingClose = () => {
    dispatch(setIsUserProfileSettingOpen(false));
  };

  const handleUserProfileSettingOpen = () => {
    dispatch(setActiveUserProfileMenu("googleCalendar"));
    dispatch(setIsUserProfileSettingOpen(true));
  };

  const handleLogout = () => {
    dispatch(setIsLoggedIn(false));
    localStorage.removeItem("reduxState");
    localStorage.removeItem("username");

    chrome.storage.sync.remove("newTask", function () {
      console.log("New Task removed from chrome sync storage ****");
    });

    chrome.storage.sync.remove("userId", function () {
      console.log("User Id removed from chrome sync storage ****");
    });

    chrome.storage.sync.remove("accessToken", function () {
      console.log("Access Token removed from chrome sync storage ****");
    });

    chrome.storage.sync.remove("reduxState", function () {
      console.log("Redux state removed from chrome sync storage ****");
    });

    chrome.storage.sync.remove("userEmail", function () {
      console.log("User Email removed from chrome sync storage****");
    });

    chrome.storage.sync.remove("username", function () {
      console.log("UserName removed from chrome sync storage********");
    });
  };

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

  const renderTaskList = () => {
    return <HomePage
      {...{futureTasks,
        currentTasks,
        overdueTasks,
        delegatAndNotifiedTasks,
        draftedTasks,
        googleCalendarTasks,
        setOverlay,
        overlay,
        setDraftsPageOpen,
        handleCreateNewTask,
        googleCalendarColors,
        ...props
      }}
    />
    // (
    //   <div className="tasks-list">
    //     <Button onClick={() => setTestNewUI(!testNewUI)}>SWITCH</Button>
    //     <Collapse defaultActiveKey={["todaysTasks"]}>
    //       <Panel header="Future Tasks" key="futureTasks">
    //         <List
    //           className="demo-loadmore-list"
    //           itemLayout="horizontal"
    //           key="futureTasksList"
    //           dataSource={futureTasks}
    //           renderItem={(item) => {
    //             return (
    //               <List.Item
    //                 id={item.id}
    //                 key={`${item.id}_${item.status}_${item.taskDetails}`}
    //                 className={`listItem-${item.status}`}
    //               >
    //                 <TaskListItem
    //                   key={item.id}
    //                   task={item}
    //                   updateTaskStatus={updateTaskStatus}
    //                 />
    //               </List.Item>
    //             );
    //           }}
    //         />
    //       </Panel>
    //       <Panel
    //         header={
    //           <div className="todays-tasks-panel-header">
    //             <label>Today's Task</label>
    //             <Progress
    //               className="task-done-progress-bar"
    //               percent={doneTaskPercent}
    //             />
    //           </div>
    //         }
    //         key="todaysTasks"
    //       >
    //         <List
    //           className="demo-loadmore-list"
    //           itemLayout="horizontal"
    //           key="todaysTasksList"
    //           dataSource={currentTasks}
    //           renderItem={(item) => {
    //             return (
    //               <List.Item
    //                 id={item.id}
    //                 key={`${item.id}_${item.status}_${item.taskDetails}`}
    //                 className={`listItem-${item.status}`}
    //               >
    //                 <TaskListItem
    //                   key={item.id}
    //                   task={item}
    //                   updateTaskStatus={updateTaskStatus}
    //                 />
    //               </List.Item>
    //             );
    //           }}
    //         />
    //       </Panel>
    //       <Panel
    //         header={
    //           <div className="google-calendar-tasks-panel-header">
    //             <label>Google Calendar Tasks</label>
    //             <div className="google-task-header-action-container">
    //               <SettingOutlined
    //                 className="google-task-settings-icon"
    //                 onClick={handleUserProfileSettingOpen}
    //               />
    //               {!calendarSynced ? (
    //                 <ReloadOutlined
    //                   className="reload-google-tasks-icon"
    //                   onClick={handleRefreshCalendarTasks}
    //                 />
    //               ) : (
    //                 ""
    //               )}
    //             </div>
    //           </div>
    //         }
    //         key="googleCalendarTasks"
    //       >
    //         {googleCalendarTasks.length > 0 ? (
    //           <List
    //             className="demo-loadmore-list"
    //             itemLayout="horizontal"
    //             key="googleCalendarTaskList"
    //             dataSource={googleCalendarTasks}
    //             renderItem={(item) => (
    //               <List.Item
    //                 key={`${item.event_summary}_${item.meeting_link}_${item.start_time}`}
    //                 className={`listItem-active`}
    //               >
    //                 <GoogleTaskListItem
    //                   colorCode={googleCalendarColors[item["calendarId"]]}
    //                   task={item}
    //                 />
    //               </List.Item>
    //             )}
    //           />
    //         ) : (
    //           ""
    //         )}
    //       </Panel>
    //       <Panel header="Delegate And Notify Tasks" key="4">
    //         <List
    //           className="demo-loadmore-list"
    //           itemLayout="horizontal"
    //           key="delegateAndNotifyTasksList"
    //           dataSource={delegatAndNotifiedTasks}
    //           renderItem={(item) => {
    //             return (
    //               <List.Item
    //                 key={`${item.id}_${item.status}_${item.taskDetails}`}
    //                 id={item.id}
    //                 className={`listItem-${item.status}`}
    //               >
    //                 <TaskListItem
    //                   key={item.id}
    //                   task={item}
    //                   updateTaskStatus={updateTaskStatus}
    //                 />
    //               </List.Item>
    //             );
    //           }}
    //         />
    //       </Panel>
    //       <Panel
    //         header={
    //           showOverdueTaskUndo ? (
    //             <div className="overdue-tasks-panel-header">
    //               <label>Overdue Tasks</label>
    //               <div>
    //                 Task moved to done Tasks
    //                 <a
    //                   className="overdue-task-undo-link"
    //                   onClick={handleOverdueTaskUndo}
    //                 >
    //                   Undo
    //                 </a>
    //               </div>
    //             </div>
    //           ) : (
    //             <Fragment onClick={(event) => event.stopPropagation()}>
    //               Overdue Tasks
    //             </Fragment>
    //           )
    //         }
    //         key="delegateAndNotifiedTasks"
    //       >
    //         <List
    //           className="demo-loadmore-list"
    //           itemLayout="horizontal"
    //           key="overdueTasksList"
    //           dataSource={overdueTasks}
    //           renderItem={(item) => {
    //             return (
    //               <List.Item
    //                 key={`${item.id}_${item.status}_${item.taskDetails}`}
    //                 id={item.id}
    //                 className={`listItem-${item.status}`}
    //               >
    //                 <TaskListItem
    //                   taskType="overdue"
    //                   task={item}
    //                   handleOverdueTaskUpdateStatus={
    //                     handleOverdueTaskUpdateStatus
    //                   }
    //                 />
    //               </List.Item>
    //             );
    //           }}
    //         />
    //       </Panel>
    //       {draftedTasks.length > 0 ? (
    //         <Panel header="Drafted Tasks" key="draftedTasks">
    //           <List
    //             className="demo-loadmore-list"
    //             itemLayout="horizontal"
    //             key="draftedTasksList"
    //             dataSource={draftedTasks}
    //             renderItem={(item) => {
    //               return (
    //                 <List.Item
    //                   id={item.draftedtasks.id}
    //                   key={`${item.draftedtasks.id}_${item.draftedtasks.status}_${item.draftedtasks.taskDetails}`}
    //                   className={`listItem-${item.status}`}
    //                 >
    //                   <DraftedTaskListItem
    //                     key={item.draftedtasks.id}
    //                     task={item.draftedtasks}
    //                     removeTask={(taskId) => removeDraftedTask(taskId)}
    //                   />
    //                 </List.Item>
    //               );
    //             }}
    //           />
    //         </Panel>
    //       ) : (
    //         ""
    //       )}
    //     </Collapse>
    //   </div>
    // );
  };

  const renderDetails = () => {
    if (isUserProfileSettingOpen) {
      return (
        <Content className="list-container">
          <UserProfileMenu
            onLogout={handleLogout}
            onClose={handleUserProfileSettingClose}
          />
        </Content>
      );
    } else if (isTaskDetailsOpen) {
      return (
        <TaskDetails
          openTaskDetails={openTaskDetails}
          handleBackToEventsList={handleBackToEventsList}
        />
      );
    }
    return renderTaskList();
  };
  return renderDetails();
}

export default TasksList;
