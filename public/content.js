const openPopup = () => {
  const whushFrameBox = document.createElement("div");
  whushFrameBox.style.width = "557px";
  whushFrameBox.style.height = "99vh";
  whushFrameBox.style.overflow = "hidden";
  whushFrameBox.style.top = "5px";
  whushFrameBox.style.right = "5px";
  whushFrameBox.style.position = "fixed";
  whushFrameBox.style.zIndex = "100000";
  whushFrameBox.style.display = "flex";
  whushFrameBox.id = "whush-chrome-extension-frame-box";

  let whushPopupContainer = document.createElement("iframe");
  whushPopupContainer.style.width = "515px";
  whushPopupContainer.style.height = "95vh";
  whushPopupContainer.style.boxShadow = "0 6px 12px 0 grey";
  whushPopupContainer.style.border = "none";
  whushPopupContainer.id = "whush-popup-container";
  whushPopupContainer.src = chrome.runtime.getURL("my_main.html");

  let whushFrameBoxCloseBtn = document.createElement("div");
  whushFrameBoxCloseBtn.innerHTML = "<span>X</span>";
  whushFrameBoxCloseBtn.id = "whush-chrome-extension-frame-box-close-btn";

  whushFrameBoxCloseBtn.onclick = function () {
    chrome.storage.sync.set({ isOpenedFromTop: false }, function () {
      console.log("Successfully set extension opened from top");
    });
    whushFrameBox.remove();
  };

  var whushOldFrameBox = document.getElementById(
    "whush-chrome-extension-frame-box"
  );
  if (whushOldFrameBox) {
    whushOldFrameBox.parentNode.removeChild(whushOldFrameBox);
  }

  whushFrameBox.appendChild(whushFrameBoxCloseBtn);
  whushFrameBox.appendChild(whushPopupContainer);
  document.body.appendChild(whushFrameBox);
};

const handleScreenshot = () => {
  chrome.storage.local.set({ isScreenshotTaken: false });
  html2canvas(document.body, {
    allowTaint: true,
    foreignObjectRendering: true,
    useCORS: true,
  }).then(function (canvas) {
    const canvasImgContentDecoded = canvas.toDataURL("image/jpeg", 0.5);
    chrome.storage.local.set({ screenshotContent: canvasImgContentDecoded });
    chrome.storage.local.set({ isScreenshotTaken: true });
  });
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "popup-modal") {
    openPopup();
  } else if (request.message === "openPopup") {
    const { newTask } = request;
    chrome.storage.sync.set({ newTask: newTask }, function () {
      console.log("Task is set successfully to" + newTask);
    });

    chrome.storage.sync.set({ isOpenedFromTop: true }, function () {
      console.log("Successfully set extension opened from top");
    });
    openPopup();
  } else if (request.message === "screenshot") handleScreenshot();
});
