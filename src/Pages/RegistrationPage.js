import React, { useState } from "react";
// import { textString } from "../assets/TextStrings";
import logo from "../assets/logo.png";
import {
  postDataWithRef,
  getChildNodeCount,
  checkIsUserExist,
} from "../DataBase/databaseFunction";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTextString } from "../assets/TextStrings";
import { logAnalyticsEvent } from "../DataBase/databaseFunction";


import {useSelector } from "react-redux";

function RegistrationPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPrivacyPolicyChecked, setIsPrivacyPolicyChecked] = useState(false);
  const { isArabicLanguage } = useSelector((state) => state.auth);
  const textString = getTextString(isArabicLanguage);

  const phoneCode = "+966";

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const onRegister = async () => {
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!username) {
      toast.error("Username cannot be empty");
      return;
    }

    if (phoneNumber.length !== 9) {
      toast.error("Phone number must be exactly 9 digits");
      return;
    }
    const userExists = await checkIsUserExist(phoneCode + phoneNumber);
    if (userExists) {
      toast.error("User already exists with this phone number");
      return;
    }
    if (!isPrivacyPolicyChecked) {
      toast.error("You must agree to the privacy policy to register");
      return;
    }

    const dataToPost = {
      name: username,
      phoneNumber: `${phoneCode}${phoneNumber}`,
      balance: 0,
      userEmail: email,
      createdAt: new Date().toISOString(),
    };

    try {
      const today = new Date();
      const day = today.getDate().toString().padStart(2, "0");
      console.log(day);
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const year = today.getFullYear().toString().slice(-2);
      const createdDate = `${year}${month}${day}`;
      let userCount = await getChildNodeCount("user");
      userCount++;
      const userId = `CUS${createdDate}${userCount
        .toString()
        .padStart(6, "0")}`;
      console.log(userId);
      await postDataWithRef("user", userId, { ...dataToPost }).then(
        async (data) => {
          await AsyncStorage.setItem(
            "ac_zurex_web_client",
            `${dataToPost.phoneNumber}`
          );
          await AsyncStorage.setItem("userid", userId);
          dispatch(setAuth({ isAuth: dataToPost }));
          toast.success("Account Created and Logged in Successfully");
          console.log("Registered user ID:", dataToPost.phoneNumber,dataToPost.userEmail);

          
        
          await logAnalyticsEvent("web_User_Registration",
            {phoneNumber:dataToPost.phoneNumber,
            userEmail:dataToPost.userEmail,
})
          navigate("/");
        }
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container my-5 loginPage">
      <img src={logo} className="topLogoPagediv" alt="logo" />
      <div className="legendContainer">
        <div id="recaptcha-container"></div>

        <p className="legendTitle">{textString.registrationNavTxt}</p>
        <p className="welcomeTxt">{textString.welcomeTxt}</p>
        <p className="loginFirstTxt">{textString.registerFirstTxt}</p>

        <div className="loginInputDiv">
          <input
            type="email"
            placeholder={textString.emailplaceholderTxt}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="sideContainer"></div>
        </div>
        <div className="loginInputDiv">
          <input
            type="text"
            placeholder={textString.usernameTxt}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="sideContainer"></div>
        </div>
        <div className="loginInputDiv">
          <input
            placeholder="59xxxxxxx"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            maxLength="9"
          />
          <div className="sideContainer">{phoneCode}</div>
        </div>
        <div className="privacyPolicyDiv">
          <input
            type="checkbox"
            checked={isPrivacyPolicyChecked}
            onChange={() => setIsPrivacyPolicyChecked(!isPrivacyPolicyChecked)}
          />
          <label>
         {textString.privacyTxt1}{" "}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            {textString.privacyTxt2}
            </a>{" "}
            {textString.privacyTxt3}{" "}
            <a href="/terms-of-use" target="_blank" rel="noopener noreferrer">
            {textString.privacyTxt4}
            </a>
          </label>
        </div>

        <button onClick={onRegister} className="signUpButton mt-4">
          {textString.signUpTxt}
        </button>
      </div>
    </div>
  );
}

export default RegistrationPage;
