import React, { useState } from "react";
import { Input, Button, Form, message } from "antd";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoggedIn, setHasAccount, FetchTasks } from "../actions/actions";
import { selectHasAccount, selectIsLoggedIn } from "../selectors/selectors";
import Signup from "./Signup";
import chrome from "../components/chrome";
import WhushLogo from "../assets/whush_logo_dark.png";
import FacebookLogo from "../assets/facebook_logo.png";
import GoogleLogo from "../assets/google_logo.png";
import LinkedinLogo from "../assets/linkedin_logo.png";

const Inputdata = ({otp_or_password}) =>{

  const input_email_mobile = React.useRef();
  const input_otp_password = React.useRef();
  const [isOtpSent, setIsOtpSent] = React.useState(false);

  React.useEffect(()=>{
    input_otp_password.current.value="";
  },[otp_or_password])

  function isNumeric(val) {
    return /^-?\d+$/.test(val);
  }

  function ValidateEmail(inputText){
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(inputText.match(mailformat)){
    return true;
    }
    return false;
  }

  

  const handleSubmit=(e)=>{
    e.preventDefault();
    if(otp_or_password == '1'){
      if(!input_email_mobile.current.value) {
        input_email_mobile.current.focus();
        return 
      }
      if(!input_otp_password.current.value){
        input_otp_password.current.focus();
        return;
      }
      const email_phone = input_email_mobile.current.value;
      const password = input_otp_password.current.value;

      if(ValidateEmail(email_phone)){
        console.log('Email entered is: ', email_phone )
        console.log('Password entered is: ', password )
        return
      }
      if(email_phone.length >= 10 && isNumeric(email_phone.slice(1))){
        if(email_phone.length == 10) {
          alert("Add country code");
          return
        }
        if(email_phone.slice(0,1) === '+'){
          console.log('Phone number entered is',email_phone.slice(1));
          console.log('Password entered is: ', password )
          return
        }
      }
      alert("Enter email or number correctly");
    }
    else{
      if(!input_email_mobile.current.value) {
        input_email_mobile.current.focus();
        return 
      }
      const email_phone = input_email_mobile.current.value;
      if(ValidateEmail(email_phone)){
        console.log('Email entered is: ', email_phone )
        setIsOtpSent(true);
        return
      }
      if(email_phone.length >= 10 && isNumeric(email_phone.slice(1))){
        if(isNumeric(email_phone.length == 10)){
          alert("Add country code");
          return
        }
        if(email_phone.slice(0,1) === '+'){
          console.log('Phone number entered is: ',email_phone);
          setIsOtpSent(true);
          return
        }
      }
      alert("Enter email or number correctly");
    } 
  }

  const handleVerifyOtp=(e)=>{
    e.preventDefault();
    if(!input_otp_password.current.value){
      input_otp_password.current.focus();
      return
    }
    const otp_or_pass_entered = input_otp_password.current.value;
    console.log('OTP entered is: ',otp_or_pass_entered);
  }
  
  const handleChangeNumber=()=>{
    setIsOtpSent(false);
    input_email_mobile.current.focus();
  }

  return (
  <div style={{ width:'100%'}}>

        <form className="d-flex" style={{ width:'100%',
          flexDirection:'column', alignItems:'center'}}>

              {otp_or_password === '0' && isOtpSent && <a style={{textAlign:'right',
              width:'100%', fontSize:'12px', color:'blue',
              textDecoration:'underline', cursor:'pointer'}}
               onClick={handleChangeNumber}>Edit</a>}

              <input className="login-input-field" type='text'
              style={{width:'100%', margin:'5px',paddingLeft:'10px'}} 
              placeholder="Email or Phone(Inc. Code eg: +919876543210)"
              ref = {input_email_mobile}
              disabled={otp_or_password === '0' && ( isOtpSent ? 'disabled' : '')}
              />

               {isOtpSent &&  <p>OTP is sent</p> }
              
              <input className="login-input-field" type={otp_or_password === '1' ? 'password' : 'number'}
              style={{width:'100%', margin:'5px',paddingLeft:'10px'}} 
              placeholder={otp_or_password === '1' ? 'Password' : 'Enter OTP'}
              ref={input_otp_password}
              disabled={otp_or_password === '0' && ( isOtpSent ? '' : 'disabled')}
              />
              
              <button className="login-btn" id=""
              style={{width:'100%', margin:'8px', background:'#7061d1', border:'none', outline:'none'}} 
              onClick={isOtpSent ?  handleVerifyOtp : handleSubmit}>{otp_or_password === '0' ? (isOtpSent ? "Login" : "Send OTP") : 'Login' }</button>

        </form>
  </div>
    
  )
}

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const hasAccount = useSelector(selectHasAccount);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [otp_or_password, setOtp_or_password] = React.useState('1');

  

  const showLoginSuccessMessage = () => {
    message.success("You are logged in Successfully!!");
  };

  const setUserDetailsInChromeStorage = (data) => {
    chrome.storage.sync.set({ accessToken: data.accessToken }, function () {
      console.log("Token is set successfully ****");
    });

    chrome.storage.sync.set({ refreshToken: data.refreshToken }, function () {
      console.log("Refresh token is set successfully ****");
    });

    chrome.storage.sync.set({ userId: data.id }, function () {
      console.log("User Id is set successfully ****");
    });

    chrome.storage.sync.set({ userEmail: data.email }, function () {
      console.log("Email Id is set successfully ****");
    });

    chrome.storage.sync.set({ username: data.fullname }, function () {
      console.log("UserName is set successfully ****");
    });
  };

  const redirectToSignup = () => {
    dispatch(setHasAccount(false));
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const showLoginError = (msg) => {
    message.error(msg);
  };

  const onFinish = async () => {
    const LOGIN_URL = "https://whush.pro/api/api/auth/signin";
    await fetch(LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => {
        if (res.status === 401) {
          dispatch(setIsLoggedIn(false));
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.accessToken) {
          localStorage.setItem("username", data.fullname);
          showLoginSuccessMessage();
          dispatch(setIsLoggedIn(true));
          setUserDetailsInChromeStorage(data);
          FetchTasks(dispatch);
        }
        if (data && !data.accessToken) {
          showLoginError(data.message);
        }
      });
  };

  return hasAccount && !isLoggedIn ? (
    <div className="login-form-container" >
      <Form className="login-form" onFinish={onFinish} style={{height:'600px'}}>
        <div className="login-header-container" style={{display:'flex', justifyContent:'center', alignItems:'center',flexDirection:'column'}}>
          <div className="login-whush-logo-container">
            <img width="62px" height="52px" src={WhushLogo} />
          </div>
          <div>
            <h3 className="login-with-label">Login with:</h3>
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
        <div style={{display:'flex',width:'100%', justifyContent:'space-around',
         flexWrap:'wrap', marginTop:'10px'}}>
          <div style={{}}>
            <div class="form-check" style={{width:''}}>
              <input class="form-check-input"
              type="radio" name="radio_button"
              id="email_password" value="1"
              onChange={()=>setOtp_or_password('1')} defaultChecked
              />
              <label class="form-check-label" for="email_password">
              Using Password
              </label>
            </div>
          </div>
          
          <div style={{width:''}}>
            <div class="form-check" style={{width:''}}>
              <input class="form-check-input" 
              type="radio" name="radio_button" 
              id="email_otp" value="2" 
              onChange={()=>setOtp_or_password('0')}
              />
              <label class="form-check-label" for="email_otp">
              Using OTP
              </label>
            </div>
          </div>
       </div>
        <div className="d-flex" id='inputs'style={{width:'100%', marginTop:'10px',
          flexDirection:'column', alignItems:'center'}}>
          <Inputdata otp_or_password={otp_or_password}/>
        </div>

        {
          <div className="create-account-link">
            New To Whush ?<a className="signup-link-login-page" onClick={redirectToSignup}>&nbsp; SignUp</a>
          </div>
        }
      </Form>
    </div>
  ) : (
    <Signup />
  );
};

export default Login;
