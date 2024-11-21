import React from "react";
import successIcon from "../assets/pay-error.png";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getTextString } from "../assets/TextStrings";
import {useSelector } from "react-redux";


function PaymentError() {
  const { status } = useParams();
  const navigate = useNavigate();
  const { isArabicLanguage } = useSelector((state) => state.auth);
  const textString = getTextString(isArabicLanguage);
  const [searchParams] = useSearchParams();
  const pg = searchParams.get('pg')

  return (
    <div className="container my-4 errorPage">
      <img src={successIcon} alt="success" />
      <p>
        {status === "failed"
          ? pg && pg === "tabby"
            ? textString.tabbyPaymentFailed
            : textString.paymentFailedTxt
          : status === "cancel"
          ? pg && pg === "tabby"
            ? textString.tabbyPaymentCancel
            : textString.paymentCancelTxt
          : ""}
      </p>
      <button onClick={() => navigate("/cart")}>{textString.okTxt}</button>
    </div>
  );
}

export default PaymentError;
