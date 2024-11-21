import React from "react";
import { useSelector } from "react-redux";
import { getTextString } from "../assets/TextStrings";
import logo from "../assets/logo.png";

function AboutPage() {
  const { isArabicLanguage } = useSelector((state) => state.auth);
  const textString = getTextString(isArabicLanguage);
  const aboutArray = textString.aboutUsArray;

  return (
    <div className="container aboutPage mt-2">
      <img src={logo} className="topLogoPagediv" alt="logo" />
      {aboutArray &&
        aboutArray?.map((dat) => (
          <div className={`${isArabicLanguage ? "rtl" : "ltr"}`} key={dat.id}> 
            <h2 className="reasonHeading">{dat?.title}</h2>
            <p className="reasonPara">{dat.subHeading}</p>
          </div>
        ))}
    </div>
  );
}

export default AboutPage;
