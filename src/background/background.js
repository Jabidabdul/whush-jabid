function getword(info, tab) {
  chrome.storage.sync.remove("newTask", function () {
    console.log("Successfully removed the new task *******");
  });

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        message: "openPopup",
        newTask: info.selectionText,
      },
      function () {
        console.log("Successfully opened the popup");
      }
    );
  });
}

chrome.contextMenus.create({
  title: "Add To Whush",
  contexts: ["selection"],
  onclick: getword,
});

chrome.runtime.onInstalled.addListener(installScript);

function installScript(details) {
  console.log("Installing content script in all tabs.");
  let params = {
    currentWindow: true,
  };
  chrome.tabs.query(params, function gotTabs(tabs) {
    let contentjsFile = chrome.runtime.getManifest().content_scripts[0].js[0];
    let screenshotLibraryFile =
      chrome.runtime.getManifest().content_scripts[0].js[1];
    const contentCssFile =
      chrome.runtime.getManifest().content_scripts[0].css[0];
    for (let index = 0; index < tabs.length; index++) {
      chrome.tabs.executeScript(
        tabs[index].id,
        {
          file: contentjsFile,
        },
        (result) => {
          const lastErr = chrome.runtime.lastError;
          if (lastErr) {
            console.error(
              "tab: " +
                tabs[index].id +
                " lastError: " +
                JSON.stringify(lastErr)
            );
          }
        }
      );
      chrome.tabs.executeScript(
        tabs[index].id,
        {
          file: screenshotLibraryFile,
        },
        (result) => {
          const lastErr = chrome.runtime.lastError;
          if (lastErr) {
            console.error(
              "tab: " +
                tabs[index].id +
                " lastError: " +
                JSON.stringify(lastErr)
            );
          }
        }
      );
      chrome.tabs.insertCSS(
        tabs[index].id,
        { file: contentCssFile },
        (result) => {
          console.log(result);
        }
      );
    }
  });
}

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "popup-modal" });
  });
});
