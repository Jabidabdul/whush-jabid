import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PlusCircleOutlined,
  ShareAltOutlined,
  WhatsAppOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Layout } from "antd";
import "./index.css";
import chrome from "../components/chrome";
import TasksList from "./TasksList.js";
import CreateTask from "./CreateTask.js";
import EditTask from "../components/EditTask";
import Login from "./Login";
import ProfileSetting from "../components/ProfileSetting";
import UserProfileMenu from "../components/UserProfileMenu";
import ShareWhushExtensionModal from "../components/ShareWhushExtensionModal";
import RevokeGoogleCalendarAccessModal from "../components/userMenus/RevokeGoogleCalendarAccessModal";
import Logo from "../assets/whush_logo.png";
import {DraftTasksPage, EditDraftTaskPage, EditTaskPage, NotificationPage} from './v2popup';

import {
  selectNewTask,
  selectIsLoggedIn,
  selectHasAccount,
  selectIsShareExtensionModalOpen,
  selectIsRevokeGoogleCalendarModalOpen,
  selectIsUserProfileSettingOpen,
  selectTaskInEditing,
} from "../selectors/selectors";
import {
  setIsLoggedIn,
  setHasAccount,
  setIsShareExtensionModalOpen,
  setIsRevokeGoogleCalendarModalOpen,
  setIsUserProfileSettingOpen,
  setNewTask,
  setActiveUserProfileMenu,
  setIsTaskDrafted,
} from "../actions/actions";
import {Navbar} from "../components/v2components";

const { Header, Content } = Layout;

function PopupPage(props) {
  const dispatch = useDispatch();
  const [overlay, setOverlay] = useState(false);
  const [navigationProps, setNavigationProps] = useState(null);
  const [onHomePage, setOnHomePage] = useState(false);

  const [draftsPageOpen, setDraftsPageOpen] = useState(false);
  const [draftEditPageOpen, setDraftEditPageOpen] = useState(false);
  const onClickDraftTask = (task) => {
    setDraftsPageOpen(false);
    setNavigationProps(task);
    setDraftEditPageOpen(true);
  }

  const [editTaskPageOpen, setEditTaskPageOpen] = useState(false);
  const onClickEditTask = (task) => {
    setNavigationProps(task);
    setEditTaskPageOpen(true);
  }

  const [notificationPageOpen, setNotificationPageOpen] = useState(false);

  const taskInEditing = useSelector(selectTaskInEditing);
  const isTaskNotEditing =
    Object.keys(taskInEditing).length === 0 ? true : false;
  const newTask = useSelector(selectNewTask);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const hasAccount = useSelector(selectHasAccount);
  const isUserProfileSettingOpen = useSelector(selectIsUserProfileSettingOpen);
  const [isNewTaskCreating, setIsNewTaskCreating] = useState(false);
  const isShareExtensionModalOpen = useSelector(
    selectIsShareExtensionModalOpen
  );
  const isRevokeGoogleCalendarModalOpen = useSelector(
    selectIsRevokeGoogleCalendarModalOpen
  );

  const handleUserProfileSettingOpen = () => {
    dispatch(setActiveUserProfileMenu("profile"));
    dispatch(setIsUserProfileSettingOpen(true));
  };

  const handleUserProfileSettingClose = () => {
    dispatch(setIsUserProfileSettingOpen(false));
  };

  const handleCancelCreateTask = () => {
    dispatch(setNewTask(""));
    chrome.storage.sync.remove("newTask", function () {
      console.log("New Task removed from chrome sync storage ****");
    });
  };

  const openWhatsappBotChat = () => {
    chrome.tabs.create({
      url: "https://wa.me/+14153014442?text=Hi",
    });
  };

  const openShareWhushExtensionModal = () => {
    dispatch(setIsShareExtensionModalOpen(true));
  };

  const handleCloseShareExtensionModal = () => {
    dispatch(setIsShareExtensionModalOpen(false));
  };

  const handleCloseRevokeGoogleCalendarModal = () => {
    dispatch(setIsRevokeGoogleCalendarModalOpen(false));
  };

  useEffect(() => {
    chrome.storage.sync.get(
      ["accessToken", "isOpenedFromTop", "username"],
      function (r) {
        const username = r.username;
        localStorage.setItem("username", username);
        const accessToken = r.accessToken;
        if (accessToken) {
          dispatch(setIsLoggedIn(true));
          dispatch(setHasAccount(true));
        }
        if (r.isOpenedFromTop) {
          window.close();
        }
      }
    );
    chrome.storage.sync.get(["isOpenedFromTop"], function (r) {
      if (r.isOpenedFromTop) {
        window.close();
      }
    });
  }, []);

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

  const handleCreateNewTask = () => {
    setIsNewTaskCreating(true);
  };

  const handleCancelCreateNewTask = () => {
    setIsNewTaskCreating(false);
  };

  const handleSaveDraftedTask = () => {
    dispatch(setIsTaskDrafted(true));
  };

  const renderAddTaskButton = () => {
    return (
      <button
        title="create task"
        className="add-task-btn"
        onClick={handleCreateNewTask}
      >
        <PlusCircleOutlined />
      </button>
    );
  };

  const renderDraftTaskButton = () => {
    return (
      <button
        title="draft task"
        className="draft-task-btn"
        onClick={handleSaveDraftedTask}
      >
        <ArrowLeftOutlined />
      </button>
    );
  };

  const renderContent = () => {
    if(hasAccount && isLoggedIn && notificationPageOpen) {
      return <>
        <Content className="list-container">
          <NotificationPage
            onClosePage={() => setNotificationPageOpen(false)}
          />
        </Content>
      </>
    } else if(hasAccount && isLoggedIn && draftEditPageOpen) {
      return <>
        <Content className="list-container">
          <EditDraftTaskPage
            onCancelCreateTask={handleCancelCreateTask}
            draft={navigationProps}
            onClosePage={() => setDraftEditPageOpen(false)}
          />
        </Content>
      </>
    } else if(hasAccount && isLoggedIn && editTaskPageOpen) {
      return <>
        <Content className="list-container">
          <EditTaskPage
            task={navigationProps}
            onClosePage={() => setEditTaskPageOpen(false)}
          />
        </Content>
      </>
    } else if(hasAccount && isLoggedIn && draftsPageOpen) {
      return <>
        {/*<div className="header-btns-container">{renderAddTaskButton()}</div>*/}
        <Content className="list-container">
          <DraftTasksPage
            onClickDraftTask={onClickDraftTask}
            onClosePage={() => setDraftsPageOpen(false)}
          />
        </Content>
      </>
    }
    else if (hasAccount && isLoggedIn && newTask) {
      return (
        <>
          {/*<div className="header-btns-container">{renderAddTaskButton()}</div>*/}
          <Content className="list-container">
            <CreateTask
              onCancelCreateTask={handleCancelCreateTask}
              newTask={newTask}
            />
          </Content>
        </>
      );
    } else if (isLoggedIn && isShareExtensionModalOpen) {
      return (
        <Content className="list-container">
          <ShareWhushExtensionModal
            onModalClose={handleCloseShareExtensionModal}
            shouldShowModal={isShareExtensionModalOpen}
          />
        </Content>
      );
    } else if (isLoggedIn && isRevokeGoogleCalendarModalOpen) {
      return (
        <Content className="list-container">
          <RevokeGoogleCalendarAccessModal
            onModalClose={handleCloseRevokeGoogleCalendarModal}
            shouldShowModal={isRevokeGoogleCalendarModalOpen}
          />
        </Content>
      );
    } else if (isLoggedIn && isNewTaskCreating) {
      return (
        <>
          {/*<div className="header-btns-container">*/}
          {/*  {renderAddTaskButton()}*/}
          {/*  {renderDraftTaskButton()}*/}
          {/*</div>*/}
          <Content className="list-container">
            <CreateTask onCancelCreateTask={handleCancelCreateNewTask} handleSaveDraftedTask={handleSaveDraftedTask} />
          </Content>
        </>
      );
    } else if (!isTaskNotEditing) {
      return (
        <>
          <div className="header-btns-container">{renderDraftTaskButton()}</div>
          <Content className="list-container">
            <EditTask task={taskInEditing} />
          </Content>
        </>
      );
    } else if (isLoggedIn && isUserProfileSettingOpen) {
      return (
        <>
          <Content className="list-container">
            <UserProfileMenu
              onLogout={handleLogout}
              onClose={handleUserProfileSettingClose}
            />
          </Content>
        </>
      );
    } else if (isLoggedIn && hasAccount) {
      return (
        <>
          {/*<div className="header-btns-container">{renderAddTaskButton()}</div>*/}
          <Content className="list-container">
            <TasksList {...{
              overlay,
              setOverlay,
              setDraftsPageOpen,
              handleCreateNewTask,
              onClickEditTask,
              setOnHomePage,
            }}/>
          </Content>
        </>
      );
    }
  };

  useEffect(() => {
    chrome.storage.sync.get(["newTask"], function (r) {
      const newTaskInStorage = r.newTask;
      if (newTask && newTask !== newTaskInStorage) {
        dispatch(setNewTask(""));
      } else if (!newTask && newTaskInStorage) {
        dispatch(setNewTask(newTaskInStorage));
      } else {
        chrome.storage.sync.remove("newTask", function () {});
      }
    });
  });

  return isLoggedIn ? (
    <Layout className="popup-layout">
      {/*<Header className="popup-header">*/}
      {/*  <div className="popup-header-icon">*/}
      {/*    <div className="popup-title">*/}
      {/*      <img height="50px" width="50px" src={Logo} />*/}
      {/*    </div>*/}
      {/*    <div className="popup-subtitle"> Whush! Get Tasks Done </div>*/}
      {/*  </div>*/}
      {/*  <div>*/}
      {/*    <ProfileSetting*/}
      {/*      username={localStorage.getItem("username") || "#"}*/}
      {/*      handleSettingOpen={handleUserProfileSettingOpen}*/}
      {/*      handleLogout={handleLogout}*/}
      {/*    />*/}
      {/*    <div className="whush-share-container">*/}
      {/*      <div className="whatsapp-bot-link-container">*/}
      {/*        <WhatsAppOutlined*/}
      {/*          style={{*/}
      {/*            fontSize: "20px",*/}
      {/*            padding: "6px",*/}
      {/*            background: "limegreen",*/}
      {/*            color: "white",*/}
      {/*            borderRadius: "10px",*/}
      {/*          }}*/}
      {/*          onClick={openWhatsappBotChat}*/}
      {/*        />*/}
      {/*        <div*/}
      {/*          style={{*/}
      {/*            color: "#222222",*/}
      {/*            textDecoration: "underline",*/}
      {/*            paddingLeft: "10px",*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          +1 (415) 523-8886*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*      <div*/}
      {/*        className="share-extension-container"*/}
      {/*        onClick={openShareWhushExtensionModal}*/}
      {/*      >*/}
      {/*        <ShareAltOutlined />*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</Header>*/}
      <Navbar {...{handleUserProfileSettingOpen, setNotificationPageOpen, overlay, setOverlay, onHomePage}}/>
      {renderContent()}
    </Layout>
  ) : (
    <Login />
  );
}

export default PopupPage;
