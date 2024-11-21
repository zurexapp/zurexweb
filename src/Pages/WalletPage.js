import React from "react";
import balanceImg from "../assets/balance.png";
import orderImg from "../assets/order.png";
import moneyIcon from "../assets/wallet.png";
import { useSelector } from "react-redux";
import { getTextString } from "../assets/TextStrings";

function WalletPage() {
  const { isAuth, mySupportServicesData } = useSelector((state) => state.auth);
  const { isArabicLanguage } = useSelector((state) => state.auth);
  const textString = getTextString(isArabicLanguage);

  return (
    <div className="container walletPage">
      <div className="w-100 mb-4 d-flex align-items-center justify-content-center flex-column">
        <div className="moneyIconContainer">
          <img
            src={moneyIcon}
            alt="money"
            style={{ width: "200px", marginBottom: "30px", marginTop: "70px" }}
          />
        </div>
      </div>
      <div className="row mt-4 mb-4">
        <div className="col-12 col-md-6 mb-3">
          <div className="walletCardDiv">
            <img src={balanceImg} alt="balance" />
            <p>{textString.balanceTxt}</p>
            <p className="priceTxt">
              {isAuth?.balance ? isAuth?.balance : 0} {textString.currencyTxt}
            </p>
          </div>
        </div>
        <div className="col-12 col-md-6 mb-3">
          <div className="walletCardDiv">
            <img src={orderImg} alt="order" />
            <p>{textString.supportServiceTxt}</p>
            <p className="priceTxt">
              {mySupportServicesData?.length
                ? mySupportServicesData?.length
                : 0}{" "}
              {textString.orderTxt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletPage;
