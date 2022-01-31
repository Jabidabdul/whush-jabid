import React, { useState } from "react";
import { Input, Button, Form, message } from "antd";
import "./Signup.css";
import { setHasAccount } from "../actions/actions";
import { useDispatch } from "react-redux";
import WhushLogo from "../assets/whush_logo_dark.png";
import FacebookLogo from "../assets/facebook_logo.png";
import GoogleLogo from "../assets/google_logo.png";
import LinkedinLogo from "../assets/linkedin_logo.png";

const Signup = () => {
  const dispatch = useDispatch();
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobilenumber, setMobilenumber] = useState("");
  const [password, setPassword] = useState("");

  const showSignupSuccessMessage = () => {
    message.success("Please confirm you email by clicking on link received in email!!!");
  };

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleMobileNumberChange = (event) => {
    setMobilenumber(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const redirectToLogin = () => {
    dispatch(setHasAccount(true));
  };

  const onFinish = async () => {
    const SIGNUP_URL = "https://whush.pro/api/api/auth/signup";
    const res = await fetch(SIGNUP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullname,
        email,
        mobilenumber,
        password,
        roles: ["admin", "moderator"],
      }),
    });

    const data = await res.json();

    if (res.status !== 200 || !data) {
      window.alert("INVALID REGISTRATION");
      console.log("INVALID REGISTRATION");
    } else {
      showSignupSuccessMessage();
      dispatch(setHasAccount(true));
    }
  };

  return (
    <div className="signup-form-container">
      <Form className="signup-form" onFinish={onFinish}>
        <div className="login-header-container">
          <div className="login-whush-logo-container">
            <img width="62px" height="52px" src={WhushLogo} />
          </div>
          <div>
            <h3 className="login-with-label">SignUp with:</h3>
          </div>
          <div className="sso-login-icons-container">
            <img width="40px" height="40px" src={GoogleLogo} />
            <img
              width="40px"
              height="40px"
              style={{ marginLeft: "32px" }}
              src={FacebookLogo}
            />
            <img
              width="40px"
              height="40px"
              style={{ marginLeft: "32px" }}
              src={LinkedinLogo}
            />
          </div>
        </div>
        <Form.Item name="fullname" className="signup-user-input">
          <label className="login-input-label">Name</label>
          <Input
            className="login-input-field"
            placeholder="Full Name"
            onChange={handleFullNameChange}
            required
          />
        </Form.Item>
        <Form.Item name="email" className="signup-user-input">
          <label className="login-input-label">Email</label>
          <Input
            className="login-input-field"
            type="email"
            placeholder="Email"
            onChange={handleEmailChange}
            required
          />
        </Form.Item>
        <Form.Item name="mobilenumber" className="signup-user-input">
          <label className="login-input-label">Mobile Number</label>
          <Input
            className="login-input-field"
            type="number"
            placeholder="Incl. Country code e.g, +14143334444"
            onChange={handleMobileNumberChange}
            required
          />
        </Form.Item>
        <Form.Item name="password" className="signup-user-input">
          <label className="login-input-label">Password</label>
          <Input.Password
            className="login-input-field"
            placeholder="Min 8 chars, 1 upper, 1 lower & 1 special char"
            onChange={handlePasswordChange}
            required
          />
        </Form.Item>
        <Form.Item
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button htmlType="submit" className="signup-btn">
            SignUp
          </Button>
        </Form.Item>
        {
          <div className="create-account-link">
            Already Have an account ?{" "}
            <a className="signup-link-login-page" onClick={redirectToLogin}>
              &nbsp; Login
            </a>
          </div>
        }
      </Form>
    </div>
  );
};

export default Signup;
