import {Navbar} from "../../../components/v2components";
import React, {useEffect, useState} from "react";
import { Input } from "antd";
import {WhooshIcons} from "../../../assets";
import './SettingsPage.css';
import chrome from "../../../components/chrome";
import {useDispatch} from "react-redux";
import {fetchUserDetails, changeUserDetailsInAPI, fetchUserCalendars, changePasswordInAPI} from './services';
import {setIsLoggedIn, setIsRevokeGoogleCalendarModalOpen, setRevokeCalendarId} from "../../../actions/actions";
import BackButtonIcon from "../../../assets/v2assets/back-icon.svg";


export default function SettingsPage(props) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);


  const username = localStorage.getItem("username");
  const [fullName, setFullName] = useState("");
  useEffect(() => console.log(fullName), [fullName])
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [selectedOffDays, setSelectedOffDays] = useState(new Set());

  const [calendars, setCalendars] = useState([]);
  const handleRevokeCalendarAccess = (record) => {
    dispatch(setRevokeCalendarId(record.key));
    dispatch(setIsRevokeGoogleCalendarModalOpen(true));
  };
  const handleLinkCalendar = () => {
    chrome.tabs.create({ url: "https://whush.pro/calender" });
  };

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const handlePasswordChangeSuccess = () => {
    dispatch(setIsLoggedIn(false));

    chrome.storage.sync.remove("newTask", function () {
      console.log("New Task removed from chrome sync storage ****");
    });

    chrome.storage.sync.remove("accessToken", function () {
      console.log("Access Token removed from chrome sync storage ****");
    });
  };

  useEffect(() => {
    fetchUserDetails({setFullName, setMobileNumber, setEmail});
    fetchUserCalendars({setCalendars});
  }, []);

  const NotificationSettings = () => {
    const changeSelectedOffDays = (dayIndex) => {
      if(selectedOffDays.has(dayIndex)) {
        let newSet = new Set(selectedOffDays);
        newSet.delete(dayIndex);
        setSelectedOffDays(newSet);
      } else {
        let newSet = new Set(selectedOffDays);
        newSet.add(dayIndex);
        setSelectedOffDays(newSet);
      }
    }

    return <div className="notification-settings">
      <div className="notification-settings__do-not-disturb__label">Do Not Disturb</div>
      <div
        className="notification-settings__do-not-disturb__button button button--white"
        onClick={() => setSelectedOffDays(new Set([0, 1, 2, 3, 4, 5, 6]))}
      >
        <img src={WhooshIcons.BellIconPurple} style={{marginRight: 12}}/>
        Stop All Notifications
      </div>
      <div className="notification-settings__days-off">
        <div className="notification-settings__days-off-label">
          Do Not Disturb on my following OFF DAYS
        </div>
        <div className="notification-settings__days-off-select-container">
          <div
            className={`days-off__day--first button ${selectedOffDays.has(0) ? "button--dark" : "button--white"}`}
            onClick={() => changeSelectedOffDays(0)}
          >
            Mon
          </div>
          <div
            className={`days-off__day button ${selectedOffDays.has(1) ? "button--dark" : "button--white"}`}
            onClick={() => changeSelectedOffDays(1)}
          >
            Tue
          </div>
          <div
            className={`days-off__day button ${selectedOffDays.has(2) ? "button--dark" : "button--white"}`}
            onClick={() => changeSelectedOffDays(2)}
          >
            Wed
          </div>
          <div
            className={`days-off__day button ${selectedOffDays.has(3) ? "button--dark" : "button--white"}`}
            onClick={() => changeSelectedOffDays(3)}
          >
            Thu
          </div>
          <div
            className={`days-off__day button ${selectedOffDays.has(4) ? "button--dark" : "button--white"}`}
            onClick={() => changeSelectedOffDays(4)}
          >
            Fri
          </div>
          <div
            className={`days-off__day button ${selectedOffDays.has(5) ? "button--dark" : "button--white"}`}
            onClick={() => changeSelectedOffDays(5)}
          >
            Sat
          </div>
          <div
            className={`days-off__day--last button ${selectedOffDays.has(6) ? "button--dark" : "button--white"}`}
            onClick={() => changeSelectedOffDays(6)}
          >
            Sun
          </div>
        </div>
      </div>
    </div>
  }

  return <>
    {/*<Navbar setOverlay={() => {}}/>*/}
    <div className="settings-page page-content-padding">
      <div className="top-bar">
        <div className="top-bar__back-button" onClick={props.onClose}>
          <img className="top-bar__back-button__img" src={BackButtonIcon} />
        </div>
        <div className="top-bar__title">Settings</div>
      </div>
      <div className="settings-page__tabs">
        <div
          className={`settings-page__tabs__tab${activeTab === 0 ? ' active-tab' : ""}`}
          style={{marginRight: 25}}
          onClick={() => setActiveTab(0)}
        >
          Account
          <div style={{visibility: activeTab === 0 ? 'visible' : 'hidden'}} className="tab-underline-div" />
        </div>
        <div
          className={`settings-page__tabs__tab${activeTab === 1 ? ' active-tab' : ""}`}
          style={{marginRight: 25}}
          onClick={() => setActiveTab(1)}
        >
          Notifications
          <div className="tab-underline-div" style={{visibility: activeTab === 1 ? 'visible' : 'hidden'}}/>
        </div>
        <div
          className={`settings-page__tabs__tab${activeTab === 2 ? ' active-tab' : ""}`}
          onClick={() => setActiveTab(2)}
        >
          Change Password
          <div className="tab-underline-div" style={{visibility: activeTab === 2 ? 'visible' : 'hidden'}}/>
        </div>
      </div>

      <div className="account-settings" style={{display: activeTab === 0 ? undefined : 'none'}}>
        <div className="account-settings__label">Name</div>
        <div className="account-settings__input">
          <Input
            key={"name"}
            className="account-settings__input-field"
            type="name"
            placeholder="John Doe"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            required
          />
        </div>
        <div className="account-settings__label">Email</div>
        <div className="account-settings__input">
          <Input
            key={"email"}
            className="account-settings__input-field"
            type="text"
            placeholder="johndoe@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            disabled={true}
            required
          />
        </div>
        <div className="account-settings__label">Mobile Number</div>
        <div className="account-settings__input">
          <Input
            key={"mobile"}
            className="account-settings__input-field"
            type="number"
            placeholder="91-9123456789"
            onChange={(e) => setMobileNumber(e.target.value)}
            value={mobileNumber}
            required
          />
        </div>
        <div style={{margin: "20px 0"}}
             className="button button--dark"
             onClick={() => changeUserDetailsInAPI({fullName, mobileNumber})}
        >Save</div>
        <div className="account-settings__linked-calendars">
          <div className="account-settings__calendar-title">Linked Calendars</div>
          {calendars && calendars.map((account, index) => {
            return <div className="account-settings__calendar-account">
              <div className="account-settings__calendar-email">{account.email}</div>
              <div
                className="account-settings__calendar-remove small-button-animate"
                onClick={() => handleRevokeCalendarAccess(account)}
              >REMOVE</div>
            </div>
          })}
          <div
            className="account-settings__link-calendar-button button button--white"
            onClick={handleLinkCalendar}
          >
            <img src={WhooshIcons.GoogleIcon} style={{marginRight: 8}}/>
            Link Google Calendar
          </div>
        </div>
      </div>
      <div style={{display: activeTab === 1 ? undefined : "none"}}>
        <NotificationSettings />
      </div>
      <div className="account-settings" style={{display: activeTab === 2 ? undefined : 'none'}}>
        <div className="account-settings__label">Old Password</div>
        <div className="account-settings__input">
          <Input.Password
            key={"name"}
            className="account-settings__input-field"
            type="name"
            placeholder="Old Password"
            onChange={(e) => setOldPassword(e.target.value)}
            value={oldPassword}
            required
          />
        </div>
        <div className="account-settings__label">New Password</div>
        <div className="account-settings__input">
          <Input.Password
            key={"name"}
            className="account-settings__input-field"
            type="name"
            placeholder="New Password"
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            required
          />
        </div>
        <div className="account-settings__label">Confirm New Password</div>
        <div className="account-settings__input">
          <Input.Password
            key={"name"}
            className="account-settings__input-field"
            type="name"
            placeholder="Confirm New Password"
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            value={newPasswordConfirm}
            required
          />
        </div>
        <div
          className="button button--dark"
          style={{margin: "20px 0"}}
          onClick={() => changePasswordInAPI({
            oldPassword, newPassword, newPasswordConfirm, handlePasswordChangeSuccess,
          })}
        >
          Change Password
        </div>
      </div>
    </div>
  </>
}
