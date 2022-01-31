import React, { useState } from "react";
import { Popover, Avatar, List } from "antd";
import "./ProfileSetting.css";

const ProfileSetting = (props) => {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  const openSettings = () => {
    setVisible(false);
    props.handleSettingOpen();
  };

  const data = [
    {
      name: "Settings",
      onClick: openSettings,
    },
    {
      name: "Signout",
      onClick: props.handleLogout,
    },
  ];

  const content = (
    <div className="profile-setting-options">
      <List
        size="small"
        dataSource={data}
        renderItem={(item) => (
          <List.Item onClick={item.onClick} className="user-option">
            {item.name}
          </List.Item>
        )}
      />
    </div>
  );
  return (
    <div className="user-profile-with-setting">
      <Popover
        className="user-profile"
        content={content}
        trigger="click"
        placement="bottomRight"
        visible={visible}
        onVisibleChange={handleVisibleChange}
      >
        <Avatar style={{ backgroundColor: "white", color: "grey" }} size={40}>
          {props.username[0].toUpperCase()}
        </Avatar>
      </Popover>
    </div>
  );
};

export default ProfileSetting;
