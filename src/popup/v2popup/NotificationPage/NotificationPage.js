import {Navbar} from "../../../components/v2components";
import React, {useState} from "react";
import './notification-page.css';
import {WhooshIcons} from "../../../assets";
import BackButtonIcon from "../../../assets/v2assets/back-icon.svg";

const NOTIFICATION_TYPES = {
  INVITATION: "INVITATION",
  DEADLINE: "DEADLINE",
  MEETING: "MEETING",
}

const NOTIFICATION_ICONS = {
  [NOTIFICATION_TYPES.INVITATION]: WhooshIcons.CollabGroupIcon,
  [NOTIFICATION_TYPES.DEADLINE]: WhooshIcons.InfoCircle,
  [NOTIFICATION_TYPES.MEETING]: WhooshIcons.CalendarBlue,
}

const NOTIFICATIONS = [
  {
    title: 'Notification Title 1',
    type: NOTIFICATION_TYPES.INVITATION,
    text: 'Hold tight... Coming soon.. ',
  },
  {
    title: 'Task Deadline 1',
    type: NOTIFICATION_TYPES.DEADLINE,
    text: 'Hold tight... Coming soon..',
  },
  {
    title: 'Meeting Notification',
    type: NOTIFICATION_TYPES.MEETING,
    text: 'Hold tight... Coming soon..',
  },
  {
    title: 'Notification Title 2',
    type: NOTIFICATION_TYPES.INVITATION,
    text: 'Hold tight... Coming soon..',
  }
]

export default function NotificationPage(props) {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  return <div>
    <div className="notification-page">
      <div className="notification-top-bar">
        <div className="top-bar__back-button" onClick={props.onClosePage}>
          <img className="top-bar__back-button__img" src={BackButtonIcon} />
        </div>
        <div className="notification-top-bar__title">Notifications</div>
        <div className="notification-top-bar__clear-all">Clear All</div>
      </div>
      <div className="notifications">
        {!notifications.length && <div className="notification-page__no-notification">Coming Soon...</div>}
        {notifications && notifications.map((notification, index) => {
          return <div className="notifications__notification" key={index}>
            <div className="notifications__notification__icon-title">
              <img
                src={NOTIFICATION_ICONS[notification.type]}
                style={{height: 26, width: 26, marginRight: 10}}
              />
              {notification.title}
            </div>
            <div className="notifications__notification__description">{notification.text}</div>
            <div className="notifications__notification__buttons">
              {notification.type === NOTIFICATION_TYPES.INVITATION && <div className="invitation-buttons">
                <div className="invitation-buttons__accept button button--dark">Accept</div>
                <div className="invitation-buttons__decline button">Decline</div>
              </div>}
              {notification.type === NOTIFICATION_TYPES.DEADLINE && <></>}
              {notification.type === NOTIFICATION_TYPES.MEETING && <div className="join-meeting-button button button--dark">
                Join Meeting
              </div>}
            </div>
            <div className="notifications__notification__divider"/>
          </div>
        })}
      </div>
    </div>
  </div>
}
