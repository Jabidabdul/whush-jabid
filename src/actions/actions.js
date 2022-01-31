import chrome from "../components/chrome";

export const SET_TASKS = "SET_TASKS";
export const SET_NEW_TASK = "SET_NEW_TASK";
export const ADD_TASK_TO_LIST = "ADD_TASK_TO_LIST";
export const FETCH_TASKS = "FETCH_TASKS";
export const FETCH_TASKS_SUCCESS = "FETCH_TASKS_SUCCESS";
export const FETCH_TASKS_FAILURE = "FETCH_TASKS_FAILURE";
export const SET_IS_LOGGED_IN = "SET_IS_LOGGED_IN";
export const SET_HAS_ACCOUNT = "SET_HAS_ACCOUNT";
export const SET_TASK_IN_EDITING = "SET_TASK_IN_EDITING";
export const OPEN_TASK_DETAILS = "OPEN_TASK_DETAILS";
export const IS_SHARE_EXTENSION_MODAL_OPEN = "IS_SHARE_EXTENSION_MODAL_OPEN";
export const REVOKE_CALENDAR_ID = "REVOKE_CALENDAR_ID";
export const IS_REVOKE_GOOGLE_CALENDAR_MODAL_OPEN =
  "IS_REVOKE_GOOGLE_CALENDAR_MODAL_OPEN";
export const FETCH_GOOGLE_CALENDAR_TASKS_SUCCESS =
  "FETCH_GOOGLE_CALENDAR_TASKS_SUCCESS";
export const IS_USER_PROFILE_SETTING_OPEN = "IS_USER_PROFILE_SETTING_OPEN";
export const ACTIVE_USER_PROFILE_MENU = "ACTIVE_USER_PROFILE_MENU";
export const FETCH_DRAFTED_TASKS_SUCCESS = "FETCH_DRAFTED_TASKS_SUCCESS";
export const SET_IS_TASK_DRAFTED = "SET_IS_TASK_DRAFTED";
export const SET_IS_DRAFTED_TASK_OPEN = "SET_IS_DRAFTED_TASK_OPEN" ;

export const setTasks = (tasks) => {
  return {
    type: SET_TASKS,
    tasks,
  };
};

export const setNewTask = (newTask) => {
  return {
    type: SET_NEW_TASK,
    newTask,
  };
};

export const addNewTask = (newTask) => {
  return {
    type: ADD_TASK_TO_LIST,
    newTask,
  };
};

export const fetchTasksSuccess = (tasks) => {
  return {
    type: FETCH_TASKS_SUCCESS,
    tasks,
  };
};

export const fetchDraftedTasksSuccess = (draftedTasks) => {
  return {
    type: FETCH_DRAFTED_TASKS_SUCCESS,
    draftedTasks,
  };
};

export const fetchGoogleCalendarTasksSuccess = (googleCalendarTasks) => {
  return {
    type: FETCH_GOOGLE_CALENDAR_TASKS_SUCCESS,
    googleCalendarTasks,
  };
};

export const setTaskInEditing = (taskInEditing) => {
  return {
    type: SET_TASK_IN_EDITING,
    taskInEditing,
  };
};

export const setOpenTaskDetails = (openTask) => {
  return {
    type: OPEN_TASK_DETAILS,
    openTask,
  };
};

export const setIsLoggedIn = (isLoggedIn) => {
  return {
    type: SET_IS_LOGGED_IN,
    isLoggedIn,
  };
};

export const setHasAccount = (hasAccount) => {
  return {
    type: SET_HAS_ACCOUNT,
    hasAccount,
  };
};

export const setIsShareExtensionModalOpen = (isShareExtensionModalOpen) => {
  return {
    type: IS_SHARE_EXTENSION_MODAL_OPEN,
    isShareExtensionModalOpen,
  };
};

export const setIsRevokeGoogleCalendarModalOpen = (
  isRevokeGoogleCalendarModalOpen
) => {
  return {
    type: IS_REVOKE_GOOGLE_CALENDAR_MODAL_OPEN,
    isRevokeGoogleCalendarModalOpen,
  };
};

export const setRevokeCalendarId = (revokeCalendarId) => {
  return {
    type: REVOKE_CALENDAR_ID,
    revokeCalendarId,
  };
};

export const setIsUserProfileSettingOpen = (isUserProfileSettingOpen) => {
  return {
    type: IS_USER_PROFILE_SETTING_OPEN,
    isUserProfileSettingOpen,
  };
};

export const setActiveUserProfileMenu = (activeUserProfileMenu) => {
  return { type: ACTIVE_USER_PROFILE_MENU, activeUserProfileMenu };
};

export const setIsTaskDrafted = (isTaskDrafted) => {
  return { type: SET_IS_TASK_DRAFTED, isTaskDrafted };
};

export const setIsDraftedTaskOpen = (isDraftedTaskOpen) => {
  return { type: SET_IS_DRAFTED_TASK_OPEN, isDraftedTaskOpen };
};

const getAccessTokenFromRefresh = (dispatch) => {
  chrome.storage.sync.get(["userId", "refreshToken","userEmail"], function (r) {
    const FETCH_ACCESS_TOKEN_URL = `https://whush.pro/api/api/access-token`;
    fetch(FETCH_ACCESS_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "refresh-token": r.refreshToken,
      },
      body: JSON.stringify({
        id: r.userId,
        email: r.userEmail
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        chrome.storage.sync.set({ accessToken: data["x-access-token"] });
        FetchTasks(dispatch);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

export const FetchTasks = async (dispatch) => {
  await chrome.storage.sync.get(["userId", "accessToken"], function (r) {
    const userId = r.userId;
    const token = r.accessToken;
    if (userId && token) {
      const FETCH_TASKS_URL = `https://whush.pro/api/api/getTaskList/${userId}`;
      fetch(FETCH_TASKS_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Unauthorized!") {
            getAccessTokenFromRefresh(dispatch);
          } else {
            dispatch(fetchTasksSuccess(data));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

export const fetchGoogleCalendarTasks = (dispatch, flag) => {
  chrome.storage.sync.get(["userId", "accessToken"], function (r) {
    const userId = r.userId;
    const token = r.accessToken;
    if (userId && token) {
      const FETCH_TASKS_URL = `https://whush.pro/api/api/getEventsDetails/${userId}/${flag}`;
      fetch(FETCH_TASKS_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const googleCalendarTasks = data["googleCalendarEventList"];
          const googleCalendarColors = {};
          data["calendars"].map((calendar) => {
            googleCalendarColors[calendar.id] = calendar.color_code;
          });
          dispatch(
            fetchGoogleCalendarTasksSuccess({
              googleCalendarTasks,
              googleCalendarColors,
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

export const fetchDraftedTasks = async (dispatch) => {
  await chrome.storage.sync.get(["userId", "accessToken"], function (r) {
    const userId = r.userId;
    const token = r.accessToken;
    if (userId && token) {
      const FETCH_DRAFTED_TASKS_URL = `https://whush.pro/api/api/getDraftedTaskList/${userId}`;
      fetch(FETCH_DRAFTED_TASKS_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            dispatch(fetchDraftedTasksSuccess(data.message));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};
