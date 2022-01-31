import chrome from "../../../components/chrome";
import {fetchDraftedTasks, fetchDraftedTasksSuccess} from "../../../actions/actions";

export const fetchDraftTasks = ({setDraftTasks}) => {
  chrome.storage.sync.get(["userId", "accessToken"], function (r) {
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
            setDraftTasks(data.message.map(r => r.draftedtasks));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

export const removeDraftedTask = async (id) => {
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

        }
        if (data.errormessage) {
          console.log(data.errormessage);
        }
      });
  });
};
