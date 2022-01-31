import React, {useState} from "react";
import {Button, Menu} from "antd";
import "./UserProfileMenu.css";
import {
  LeftOutlined,
  LogoutOutlined,
  CalendarOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { selectActiveUserProfileMenu } from "../selectors/selectors";
import { setActiveUserProfileMenu } from "../actions/actions";
import ChangePassword from "./userMenus/ChangePassword";
import EditUserProfile from "./userMenus/EditUserProfile";
import GoogleCalendar from "./userMenus/GoogleCalendar";
import UserProfile from "./userMenus/UserProfile";
import { useDispatch, useSelector } from "react-redux";
import {SettingsPage} from "../popup/v2popup";

const UserProfileMenu = (props) => {
  const dispatch = useDispatch();
  const activeUserProfileMenu = useSelector(selectActiveUserProfileMenu);
  const content = {
    profile: <UserProfile />,
    editProfile: <EditUserProfile />,
    googleCalendar: <GoogleCalendar />,
    changePassword: <ChangePassword />,
    signout: "",
  };

  const handleMenuClick = (event) => {
    if (event.key === "signout") {
      props.onLogout();
    } else dispatch(setActiveUserProfileMenu(event.key));
  };

  return <>
    <SettingsPage onClose={props.onClose} />
    {/*<div className="use-profile-menu">*/}
    {/*  <div className="back-to-task-list-link">*/}
    {/*    <LeftOutlined/>*/}
    {/*    <a href="#" onClick={props.onClose} className="back-link-text">*/}
    {/*      Back to tasks list*/}
    {/*    </a>*/}
    {/*  </div>*/}
    {/*  <div className="user-menu">*/}
    {/*    <Menu*/}
    {/*      className="user-menu-left-panel"*/}
    {/*      selectedKeys={[activeUserProfileMenu]}*/}
    {/*      onClick={handleMenuClick}*/}
    {/*      mode="inline"*/}
    {/*      theme="light"*/}
    {/*    >*/}
    {/*      <Menu.Item key="profile" icon={<UserOutlined/>}>*/}
    {/*        View Profile*/}
    {/*      </Menu.Item>*/}
    {/*      <Menu.Item key="editProfile" icon={<SettingOutlined/>}>*/}
    {/*        Edit Profile*/}
    {/*      </Menu.Item>*/}
    {/*      <Menu.Item key="changePassword" icon={<SettingOutlined/>}>*/}
    {/*        Change Password*/}
    {/*      </Menu.Item>*/}
    {/*      <Menu.Item key="googleCalendar" icon={<CalendarOutlined/>}>*/}
    {/*        Google Calendar*/}
    {/*      </Menu.Item>*/}
    {/*      <Menu.Item key="signout" icon={<LogoutOutlined/>}>*/}
    {/*        Signout*/}
    {/*      </Menu.Item>*/}
    {/*    </Menu>*/}
    {/*    <div className="menu-details">{content[activeUserProfileMenu]}</div>*/}
    {/*  </div>*/}
    {/*</div>*/}
    }
  </>
};
export default UserProfileMenu;
