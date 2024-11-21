import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import OtpInput from "react-otp-input";
import {
  checkIsUserExist,
  nonAuth,
  postData,
} from "../DataBase/databaseFunction";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toast } from "react-toastify";
import { useNavigate, useLocation, Link } from "react-router-dom"; 
import { getTextString } from "../assets/TextStrings";
import { logAnalyticsEvent } from "../DataBase/databaseFunction";
function LoginPage() {
  const history = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isArabicLanguage } = useSelector((state) => state.auth);
  const textString = getTextString(isArabicLanguage);
  const { isAuth } = useSelector((state) => state.auth);
  const [loginLayout, setLoginLayout] = useState(true);
  const [otp, setOtp] = useState("");
  const phoneCode = "+966";
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Clear recaptchaVerifier on component mount
    window.recaptchaVerifier = null;
  }, []);

  const onCaptchVerify = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new nonAuth.RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("Captcha verification successful");
          },
          "expired-callback": () => {
            console.log("Captcha expired");
          },
        }
      );
    }
  };

  const onSignup = () => {
    setIsLoading(true); // Set loading state to true
    onCaptchVerify();
    const appVerifier = window.recaptchaVerifier;
    const formattedPhoneNumber = `${phoneCode}${phoneNumber}`;
    nonAuth()
      .signInWithPhoneNumber(formattedPhoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        toast.success(textString.otpTxt);

        setLoginLayout(false);
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setIsLoading(false); // Set loading state back to false
      });
  };

const onOTPVerify = async () => {
  setIsLoading(true); // Set loading state to true
  try {
    const res = await window.confirmationResult.confirm(otp);
    const userData = await checkIsUserExist(`${res.user.phoneNumber}`);

    if (userData) {
      toast.success(textString.loginsuccessTxt);
      dispatch(setAuth({ isAuth: userData }));
      console.log(`111111111111111`,userData.phoneNumber,userData.userEmail);
      
      await AsyncStorage.setItem("ac_zurex_web_client", `${userData.phoneNumber}`);
      await AsyncStorage.setItem("userid", userData.userId);
      
      
      await logAnalyticsEvent("web_User_Login",{phoneNumber:userData.phoneNumber,
        userEmail:userData.userEmail,
        device_type: "Web"})
      
      navigate("/");
    } else {
      const dataToPost = {
        name: "client default username",
        phoneNumber: `${phoneCode}${phoneNumber}`,
        userImage: "",
        balance: 0,
        userEmail: "client default email",
      };
      await postData("user", { ...dataToPost });
      await AsyncStorage.setItem("ac_zurex_web_client", `${dataToPost.phoneNumber}`);
      dispatch(setAuth({ isAuth: dataToPost }));
      toast.success("Account Created and Logged in Successfully");
      console.log("Logged in user ID:", dataToPost.phoneNumber);
      // Navigate after the toast is shown
      navigate("/");
    }
  } catch (err) {
    toast.error(err.message);
  } finally {
    setIsLoading(false); // Set loading state back to false
  }
};

  

  const onLogout = () => {
    // Clear AsyncStorage, Redux state, etc.
    AsyncStorage.removeItem("ac_zurex_web_client");
    dispatch(setAuth(null)); // Clear authentication state
    setPhoneNumber(""); // Reset phone number state
    setOtp(""); // Reset OTP state
    setLoginLayout(true); // Reset login layout state
    window.recaptchaVerifier = null; // Clear the recaptchaVerifier
  };

  useEffect(() => {
    if (isAuth && isAuth.phoneNumber) {
      if (history.state && history.state.from) {
        navigate(history.state.from);
      } else {
        navigate("/cart");
      }
    }
  }, [isAuth, history.state, navigate]);

  return (
    <div className="container my-5 loginPage">
      <img src={logo} className="topLogoPagediv" alt="logo" />
      <div className="legendContainer">
        <div id="recaptcha-container"></div>
        <p className="legendTitle">
          {loginLayout ? textString.loginNavTxt : textString.codeActiveTxt}
        </p>
        <p className="welcomeTxt">{textString.welcomeTxt}</p>
        <p className="loginFirstTxt">
          {loginLayout ? textString.loginFirstTxt : textString.activCodeTxt}
        </p>
        {loginLayout ? (
          <>
            <div className="loginInputDiv">
              <input
                placeholder="59xxxxxxx"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <div className="sideContainer">{phoneCode}</div>
            </div>
            <button onClick={onSignup} disabled={isLoading}>
              {isLoading ? textString.sendingBtnTxt : textString.sendBtnTxt}
            </button>
          </>
        ) : (
          <>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              inputType="number"
              renderSeparator={<div style={{ marginLeft: "10px" }} />}
              inputStyle={{
                width: "4rem",
                height: "4rem",
                borderRadius: "10px",
                border: "1px solid #003978",
                outline: "0px",
                fontSize: "1.7rem",
                color: "#003978",
              }}
              containerStyle={{ marginBottom: "3rem", marginTop: "2.5rem" }}
              renderInput={(props) => <input {...props} />}
            />
        <button onClick={onOTPVerify} disabled={isLoading}>
  {isLoading ? textString.signInnnTxt : textString.signInTxt}
</button>

          </>
        )}
        {isAuth && (
          <button onClick={onLogout} className="logoutButton">
            Logout
          </button>
        )}
        {loginLayout && (
          <p className="createAccountTxt mt-4">
            {textString.donthaveAccTxt}?{" "}
            <Link to="/registration" className="createAccountLink">
              {textString.creatAccTxt}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
