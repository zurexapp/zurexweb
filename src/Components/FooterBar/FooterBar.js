import React from "react";
import "./FooterBar.scss";
import paymentimg from "../../assets/payments.png.png";
import belowpaymentimg from "../../assets/belowpayment.png";
import { AiOutlineInstagram } from "react-icons/ai";
import { FaSnapchat, FaFacebookF, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import locationpng from "../../assets/Location.png";
import Messagepng from "../../assets/Message.png";
import callpng from "../../assets/Call.png";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuth } from "../../store/authSlice";
import { getTextString } from "../../assets/TextStrings";
import { useNavigate } from "react-router-dom";
import packageJson from "../../../package.json";

function FooterBar() {
  const { isAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const displayVersion = packageJson.version;

  // const logoutFunc = async () => {
  //   await AsyncStorage.removeItem("ac_zurex_web_client");
  //   dispatch(setAuth({ isAuth: null }));
  // };
  const logoutFunc = async () => {
    try {
      // Clearing client data from AsyncStorage
      await AsyncStorage.removeItem("ac_zurex_web_client");
      // Dispatching action to update authentication state
      dispatch(setAuth(false));
      // Logging out user from webengage
      window.webengage.user.logout();
      // Clearing user data from localStorage
      localStorage.removeItem("userid"); // Replace with your actual localStorage key
      // Redirecting to login page
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const navigate = useNavigate();
  const { isArabicLanguage } = useSelector((state) => state.auth);
  const textString = getTextString(isArabicLanguage);

  return (
    <div className={`wholeSection2 w-100 ${isArabicLanguage ? "rtl" : "ltr"}`}>
      <div style={{ width: "95%" }} className="widthissue marginIssue row">
      <div className={`col-12 col-md-5 col-lg-3 mb-4 d-flex align-items-start justify-content-between flex-column manageHeightIssue ${isArabicLanguage ? "rtl" : "ltr"}`}>
      <p className="apptxtStyle mb-0">{textString.footerMainTxt}</p>
      <br />
      <img
        src={paymentimg}
        style={{
          height: "1.875rem",
          objectFit: "contain",
          width: "100%",
          maxWidth: "340px",
        }}
        className="mt-2"
        alt="payments"
      />
      <div className="btnContainerSocial my-3">
        <a
          href="https://www.facebook.com/aczurex20"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button>
            <FaFacebookF />
          </button>
        </a>
        <a
          href="https://x.com/aczurex20"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button>
            <FaTwitter />
          </button>
        </a>
        <a
          href="https://www.instagram.com/aczurex20/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button>
            <AiOutlineInstagram />
          </button>
        </a>
        <a
          href="https://www.snapchat.com/add/zurex.sa"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button>
            <FaSnapchat />
          </button>
        </a>
      </div>
      <div className="w-100 d-flex align-items-center justify-content-start flex-row">
        <a
          href="https://zurex.sa"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={belowpaymentimg}
            style={{
              height: "1.5rem",
              objectFit: "contain",
              maxWidth: "80px",
            }}
            alt="payments"
          />
        </a>
        <span className="taxNumberTxt">
          {textString.taxtHeading}: <b>{textString.TaxNumTxt}</b>
        </span>
      </div>
    </div>
    
        <div className="col-12 col-md-7 col-lg-9 mb-4 showsamllWidth">
          <div className="row p-0">
            <div className="col-12 col-md-6 col-lg-2">
              <p className="headingSpan">{textString.anglesTxt}</p>
              <Link to="/" className="mycustomNavFootr">
                {textString.productbtmTxt}
              </Link>
              <Link to="/" className="mycustomNavFootr">
                {textString.mReqProductTxt}
              </Link>
              <Link to="/contact" className="mycustomNavFootr">
                {textString.contactNavTxt}
              </Link>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <p className="headingSpan">{textString.informationTxt}</p>
              <Link to="/FAQ" className="mycustomNavFootr">
                {textString.faqTxt}
              </Link>
              <Link to="/privacy-policy" className="mycustomNavFootr">
                {textString.privacyTxt}
              </Link>
              <Link className="mycustomNavFootr">{textString.termCondApp}</Link>

              <Link to="/about" className="mycustomNavFootr">
                {textString.aboutAppTxt}
              </Link>
              <Link className="mycustomNavFootr">
                {textString.wholeSaleOrderTxt}
              </Link>
            </div>
            <div className="col-12 col-md-6 col-lg-2">
              <p className="headingSpan">{textString.accountTxt}</p>
              {isAuth ? (
                <p
                  onClick={logoutFunc}
                  style={{ cursor: "pointer" }}
                  className="mycustomNavFootr"
                >
                  {textString.logoutNavTxt}
                </p>
              ) : (
                <Link to="/login" className="mycustomNavFootr">
                  {textString.loginNavTxt}
                </Link>
              )}

              <Link to="/orders" className="mycustomNavFootr">
                {textString.orderTxt}
              </Link>
            </div>
            <div className={`col-12 col-md-6 col-lg-5 ${isArabicLanguage ? "rtl" : "ltr"}`}>
            <p className="headingSpan">{textString.contactNavTxt}</p>
            <div className="footerContctUsItem">
              <img src={locationpng} alt="location" />
              <span>{textString.contactUsLocation}</span>
            </div>
            <div className="footerContctUsItem">
              <img src={callpng} alt="location" />
              <span>{textString.phoneTxt}</span>
            </div>
            <div className="footerContctUsItem">
              <img src={Messagepng} alt="location" />
              <span>info@zurex.sa</span>
            </div>
          </div>
          
          </div>
        </div>
      </div>
      <div className="copyrightdivtxt">
        {textString.copyrightTxt}, version {displayVersion}{" "}
      </div>
    </div>
  );
}

export default FooterBar;