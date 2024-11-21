import React, { useEffect } from "react";
import successIcon from "../assets/successpay.png";
// import { textString } from "../assets/TextStrings";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch} from "react-redux";
import { getTextString } from "../assets/TextStrings";
import {useSelector } from "react-redux";

import {
  UpdateOrderWithId,
  checkIsOrderExist,
} from "../DataBase/databaseFunction";
import { clearCart } from "../utils/cartUtils"; // Import the clearCart function
// import { setCartItems } from "../store/authSlice";

function PaySuccessPage() {
  const { id } = useParams();
  console.log("Payment successful, Order ID:", id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isArabicLanguage } = useSelector((state) => state.auth);
  const textString = getTextString(isArabicLanguage);
  // const { cartItems } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("You entered PaySuccessPage");
    clearCart(dispatch);

    if (id?.length > 0) {
      checkIsOrderExist(id)
        .then((data) => {
          if (data?.orderStatus === "paymentWaiting") {
            UpdateOrderWithId(id, { orderStatus: "pending" })
              .then(() => {
                console.log("Order status updated to pending");
              })
              .catch((e) => console.log(e));
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [id, dispatch]); // Only depends on id and dispatch

  return (
    <div className="container my-4 successPage">
      <img src={successIcon} alt="success" />
      <p>{textString.successDoneTxt}</p>
      <p> {textString.orderIdTxt}</p>
      <p>{id}</p>
      <button onClick={() => navigate("/")}>{textString.okTxt}</button>
    </div>
  );
}

export default PaySuccessPage;
