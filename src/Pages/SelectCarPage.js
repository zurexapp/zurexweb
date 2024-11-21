import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../index.scss";
import { getTextString } from "../assets/TextStrings";

import {useSelector } from "react-redux";


const SelectCarPage = () => {
  const navigate = useNavigate();
    // Use useSelector to get the current language state from Redux
    const { isArabicLanguage } = useSelector((state) => state.auth);

    // Get the text strings based on the current language
    const textString = getTextString(isArabicLanguage);

  return (
    <>
      <div className="btn w-100 homeBtnMainDivWala mt-2" style={{marginBottom:"40px"}}>
        {textString.selectcarmethod}
      </div>

      <p className="text-center mt-4" style={{ fontSize: '1.5rem' }}>
      {textString.selectcarHead}
    </p>
      <div className="container hompage mb-16" >
        <div
          onClick={() => navigate("/ilmenterdata")}
          className="btn w-100 homeBtnSec mt-4"
          style={{marginBottom:"60px"}}
        >
          {textString.enterCarILM}
        </div>

        <div
          onClick={() => navigate("/enterData")}
          className="btn w-100 homeBtnSec mt-4"
          style={{ marginBottom: "170px" }}
        >
          {textString.enterCarManual}
        </div>
      </div>
    </>
  );
};

export default SelectCarPage;
