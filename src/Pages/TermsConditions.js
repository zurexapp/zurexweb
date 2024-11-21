import React from "react";
import { useSelector } from "react-redux";
import { getTextString } from "../assets/TextStrings";
import logo from "../assets/logo.png";

function TermsConditionsPage() {
  const { isArabicLanguage } = useSelector((state) => state.auth);
  const textString = getTextString(isArabicLanguage);
  const termsArray = textString.termsConditionsArray;

  return (
    <div className="container termsPage mt-2">
      <img src={logo} className="topLogoPagediv" alt="logo" />
      {termsArray &&
        termsArray?.map((dat) => (
          <div key={dat.id}>
            <h2 className="reasonHeading">{dat?.title}</h2>
            <p className="reasonPara">{dat.subHeading}</p>
          </div>
        ))}
    </div>
  );
}

export default TermsConditionsPage;
