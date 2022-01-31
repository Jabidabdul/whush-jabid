import {WhooshIcons} from "../../../assets";
import './navbar.css';
import {useEffect, useState} from "react";
import {Input, message} from "antd";
import {PoweroffOutlined} from "@ant-design/icons";
import {setIsLoggedIn} from "../../../actions/actions";
import chrome from "../../chrome";
import {useDispatch} from "react-redux";

const {Logo, ProfileIcon, WhatsappIcon, NotificationIcon, SettingIcon} = WhooshIcons;

export default function Navbar({overlay, setOverlay, onHomePage, ...props}) {
  const dispatch = useDispatch();
  const [inviteModalVisible, setInviteModalVisible] = useState(false);

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

  useEffect(() => {
    overlay || setInviteModalVisible(false);
  }, [overlay])

  useEffect(() => {
    setOverlay(inviteModalVisible);
  }, [setOverlay, inviteModalVisible])



  const InviteModal = () => {
    const [email, setEmail] = useState("");

    const showExtensionShareSuccessMessage = (successMsg) => {
      message.success(successMsg);
    };

    const handleSendExtensionEmailFailure = () => {
      message.error("Can't send Email. Something went wrong!");
    };

    const handleSendExtensionEmailSuccess = () => {
      showExtensionShareSuccessMessage(`Successfully sent email to ${email}`);
    };

    const sendEmail = () => {
      console.log("sending email to ", email)
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
            console.log(data)
            if (data.message) {
              handleSendExtensionEmailSuccess();
            }
            if (data.errormessage) {
              handleSendExtensionEmailFailure();
            }
            setOverlay(false);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
    };

    return <div className="invite-people-fixed" style={{display: inviteModalVisible ? undefined : 'none'}}>
      <div className="invite-people__container">
        <div className="invite-people__triangle-point" />
        <div className="invite-people">
          <div className="invite-people__text">Lets Invite Your Friend and help them manage time</div>
          <div className="invite-people__input">
            <Input
              className="invite-people__input__input-field"
              type="text"
              placeholder="johndoe@gmail.com"
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div
            className="invite-people__invite-button button button--dark"
            onClick={sendEmail}
          >Invite</div>
        </div>
      </div>
    </div>
  }

  return (
    <div className="navbar">
      <div className="navbar-overlay" style={{display: overlay ? undefined : "none"}} />
      <InviteModal/>
      <img src={Logo} className="navbar__app-logo" alt="logo" />
      <div className="navbar__navbar-buttons">
        <img
          className="navbar__navbar-buttons__navbar-button button-animate"
          src={WhatsappIcon}
          alt="logo"
          onClick={() => {
            chrome.tabs.create({
              url: "https://wa.me/+14153014442?text=Hi",
            })
          }}
        />
        <img
          className="navbar__navbar-buttons__navbar-button button-animate"
          src={NotificationIcon}
          onClick={() => props.setNotificationPageOpen && props.setNotificationPageOpen(true)}
          style={{display: onHomePage ? undefined : 'none'}}
        />
        <img
          className="navbar__navbar-buttons__navbar-button--setting"
          src={SettingIcon}
          onClick={props.handleUserProfileSettingOpen}
          style={{display: onHomePage ? undefined : 'none'}}
        />
        <img
          className="navbar__navbar-buttons__navbar-button button-animate"
          src={ProfileIcon}
          onClick={() => setInviteModalVisible(!inviteModalVisible)}
        />
        <PoweroffOutlined
          style={{fontSize: 25, color: 'white', paddingTop: 3}}
          className="navbar__navbar-buttons__navbar-button button-animate"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}
