import React, { useState } from "react";
import { Modal, Input, message } from "antd";
import chrome from "./chrome";

const ShareWhushExtensionModal = (props) => {
  const [email, setEmail] = useState("");
  const closeModal = () => {
    props.onModalClose();
  };

  const showExtensionShareSuccessMessage = (successMsg) => {
    message.success(successMsg);
  };

  const handleSendExtensionEmailFailure = () => {
    message.error("Can't send Email. Something went wrong!");
  };

  const handleSendExtensionEmailSuccess = () => {
    showExtensionShareSuccessMessage(`Successfully sent email to ${email}`);
    props.onModalClose();
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const sendEmail = () => {
    chrome.storage.sync.get(["accessToken"], function (r) {
      const token = r.accessToken;

      const SEND_EXTENTION_EMAIL_URL = `https://whush.pro/api/api/send-extension-mail`;
      fetch(SEND_EXTENTION_EMAIL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({ email: email }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            handleSendExtensionEmailSuccess();
          }
          if (data.errormessage) {
            handleSendExtensionEmailFailure();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  };

  return (
    <Modal
      title="Share Whush with your Friends"
      onOk={sendEmail}
      onCancel={closeModal}
      visible={props.shouldShowModal}
      okButtonProps={{
        style: { color: "white", backgroundColor: "#222222", border: "none" },
      }}
    >
      <Input
        placeholder="Email of the person to share"
        onChange={handleEmailChange}
      />
    </Modal>
  );
};

export default ShareWhushExtensionModal;
