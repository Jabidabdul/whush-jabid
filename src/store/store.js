import { applyMiddleware, createStore, compose } from "redux";
import rootReducer from "../reducers/reducers";
import thunk from "redux-thunk";
import chrome from "../components/chrome";

const initialState = {
  tasks: [],
  newTask: "",
  isLoggedIn: false,
  hasAccount: true,
  taskInEditing: {},
  googleCalendarTasks: {},
  draftedTasks: [],
  openTask: {},
  isShareExtensionModalOpen: false,
  isRevokeGoogleCalendarModalOpen: false,
  revokeCalendarId: "",
  isUserProfileSettingOpen: false,
  isTaskDrafted: false,
  isDraftedTaskOpen: false,
  activeUserProfileMenu: "profile",
};

chrome.storage.sync.get(["reduxState"], function (r) {
  const reduxState = localStorage.getItem("reduxState");
  if (r.reduxState && !reduxState) {
    localStorage.setItem("reduxState", r.reduxState);
  }
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  (localStorage.getItem("reduxState") &&
    JSON.parse(localStorage.getItem("reduxState"))) ||
    initialState,
  composeEnhancer(applyMiddleware(thunk))
);

store.subscribe(() => {
  const stateInLocalStorage = localStorage.getItem("reduxState");
  if (!stateInLocalStorage) {
    chrome.storage.sync.set(
      { reduxState: JSON.stringify(store.getState()) },
      function () {
        console.log("State successfully stored to chrome sync storage ****");
      }
    );
  }
});

export default store;
