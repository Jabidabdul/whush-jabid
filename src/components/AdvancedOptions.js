import React, { useEffect, useState } from "react";
import { Button, Space, Upload, Spin } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UploadOutlined } from "@ant-design/icons";
import "./AdvancedOptions.css";

const AdvancedOptions = (props) => {
  const [isScreenshotInProgress, setIsScreenshotInProgress] = useState(
    props.isScreenshotInProgress
  );

  useEffect(() => {
    setIsScreenshotInProgress(props.isScreenshotInProgress);
  });

  return (
    <div className="upload-file-and-editor-container">
      <Upload
        accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"
        maxCount={1}
        fileList={props.fileList}
        onChange={props.handleFileChange}
      >
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
      <Space size="middle">
        <Button
          className="take-screenshot-btn"
          onClick={props.handleTakeScreenshot}
        >
          Take screenshot
        </Button>
        {isScreenshotInProgress ? <Spin /> : ""}
      </Space>
      <ReactQuill
        theme="snow"
        value={props.advancedDescription || ""}
        onChange={props.handleAdvancedDescription}
      />
    </div>
  );
};

export default AdvancedOptions;
