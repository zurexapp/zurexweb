import React from "react";
import { useSelector } from "react-redux";
import { getTextString } from "../assets/TextStrings";
import logo from "../assets/logo.png";

function HelpPage() {
  const { isArabicLanguage } = useSelector((state) => state.auth);
  const textString = getTextString(isArabicLanguage);
  const helpArray = textString.helpArray;

  return (
    <div className="container helpPage mt-2">
      <img src={logo} className="topLogoPagediv" alt="logo" />
      {helpArray &&
        helpArray?.map((dat) => (
          <div className={`${isArabicLanguage ? "rtl" : "ltr"}`} key={dat.id}>
            <h2 className="reasonHeading">{dat?.title}</h2>
            <p className="reasonPara">{dat.subHeading}</p>
          </div>
        ))}
    </div>
  );
}

export default HelpPage;
