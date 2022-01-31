import {
  SET_TASKS,
  SET_NEW_TASK,
  ADD_TASK_TO_LIST,
  FETCH_TASKS_SUCCESS,
  SET_IS_LOGGED_IN,
  SET_HAS_ACCOUNT,
  SET_TASK_IN_EDITING,
  FETCH_GOOGLE_CALENDAR_TASKS_SUCCESS,
  OPEN_TASK_DETAILS,
  IS_SHARE_EXTENSION_MODAL_OPEN,
  IS_REVOKE_GOOGLE_CALENDAR_MODAL_OPEN,
  REVOKE_CALENDAR_ID,
  IS_USER_PROFILE_SETTING_OPEN,
  ACTIVE_USER_PROFILE_MENU,
  FETCH_DRAFTED_TASKS_SUCCESS,
  SET_IS_TASK_DRAFTED,
  SET_IS_DRAFTED_TASK_OPEN,
} from "../actions/actions";

const initialState = {};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TASKS:
      return {
        ...state,
        tasks: action.tasks,
      };
    case SET_NEW_TASK:
      return {
        ...state,
        newTask: action.newTask,
      };
    case ADD_TASK_TO_LIST:
      return {
        ...state,
        tasks: [...state.tasks, action.newTask],
      };
    case FETCH_TASKS_SUCCESS:
      return {
        ...state,
        tasks: action.tasks,
      };

    case FETCH_GOOGLE_CALENDAR_TASKS_SUCCESS:
      return {
        ...state,
        googleCalendarTasks: action.googleCalendarTasks,
      };
    case SET_IS_LOGGED_IN:
      return {
        ...state,
        isLoggedIn: action.isLoggedIn,
      };
    case SET_HAS_ACCOUNT:
      return {
        ...state,
        hasAccount: action.hasAccount,
      };
    case SET_TASK_IN_EDITING:
      return {
        ...state,
        taskInEditing: action.taskInEditing,
      };
    case OPEN_TASK_DETAILS:
      return {
        ...state,
        openTask: action.openTask,
      };
    case IS_SHARE_EXTENSION_MODAL_OPEN:
      return {
        ...state,
        isShareExtensionModalOpen: action.isShareExtensionModalOpen,
      };
    case REVOKE_CALENDAR_ID:
      return {
        ...state,
        revokeCalendarId: action.revokeCalendarId,
      };
    case IS_REVOKE_GOOGLE_CALENDAR_MODAL_OPEN:
      return {
        ...state,
        isRevokeGoogleCalendarModalOpen: action.isRevokeGoogleCalendarModalOpen,
      };
    case IS_USER_PROFILE_SETTING_OPEN:
      return {
        ...state,
        isUserProfileSettingOpen: action.isUserProfileSettingOpen,
      };
    case ACTIVE_USER_PROFILE_MENU:
      return {
        ...state,
        activeUserProfileMenu: action.activeUserProfileMenu,
      };
    case FETCH_DRAFTED_TASKS_SUCCESS:
      return {
        ...state,
        draftedTasks: action.draftedTasks,
      };
    case SET_IS_TASK_DRAFTED:
      return {
        ...state,
        isTaskDrafted: action.isTaskDrafted,
      };
    case SET_IS_DRAFTED_TASK_OPEN:
      return {
        ...state,
        isDraftedTaskOpen: action.isDraftedTaskOpen,
      };
    default:
      return state;
  }
}

export default rootReducer;
