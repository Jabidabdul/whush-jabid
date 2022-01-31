import chrome from "../../../components/chrome";

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
