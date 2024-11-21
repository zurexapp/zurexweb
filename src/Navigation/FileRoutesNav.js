import React, { useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import CartPage from "../Pages/CartPage";
import ErrorPage from "../Pages/ErrorPage";
import HomePage from "../Pages/HomePage";
import TipDescriptionPage from "../Pages/TipDescriptionPage";
import TipPage from "../Pages/TipPage";
import ProductDescriptionPage from "../Pages/ProductDescriptionPage";
import AboutPage from "../Pages/AboutPage";
// import Term-Conditions from "../Pages/Term-Conditions";
import TermsConditions from "../Pages/TermsConditions";
import PrivacyPolicy from "../Pages/PrivacyPolicy";



import FavoritePage from "../Pages/FavoritePage";
import HelpPage from "../Pages/HelpPage";
import LoginPage from "../Pages/LoginPage";
import ContactPage from "../Pages/ContactPage";
// import WalletPage from "../Pages/WalletPage";
import PaymentPage from "../Pages/PaymentPage";
import PaySuccessPage from "../Pages/PaySuccessPage";
import EnterCarDataPage from "../Pages/EnterCarDataPage";
import OrderPage from "../Pages/OrderPage";
import AddressPage from "../Pages/AddressPage";
import ProfilePage from "../Pages/ProfilePage"; 
import { useSelector } from "react-redux";
import PaymentError from "../Pages/PaymentError";
import SelectCarPage from "../Pages/SelectCarPage"; 
import IlmCarPlatePage from "../Pages/IlmCarPlatePage"; 
import RegistrationPage from "../Pages/RegistrationPage";

function FileRoutesNav() {
  const { pathname } = useLocation();
  const { isAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route path="/tips" element={<TipPage />} />
      <Route path="/enterData" element={<EnterCarDataPage />} />
      <Route path="/productInfo/:id" element={<ProductDescriptionPage />} />
      <Route path="/about" element={<AboutPage />} />


      <Route path="/term-conditions" element={<TermsConditions/>} />
      <Route path="/privacy-policy" element={<PrivacyPolicy/>} />



      <Route path="/favorite" element={<FavoritePage />} />
      <Route path="/FAQ" element={<HelpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/tip/:id" element={<TipDescriptionPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/paymentSuccess/:id" element={<PaySuccessPage />} />
      <Route path="/paymentFailed/:status" element={<PaymentError />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/orders" element={<OrderPage />} />
      <Route path="/selectCar" element={<SelectCarPage />} />
      <Route path="/ilmenterdata" element={<IlmCarPlatePage />} />
      <Route path="/registration" element={<RegistrationPage />} />

      <Route path="*" element={<ErrorPage />} />

     {/*  <Route
        path="/wallet"
        element={
          !isAuth ? (
            <Navigate to={"/login"} state={{ from: "/wallet" }} />
          ) : (
            <WalletPage />
          )
        }
      />*/}
      <Route
        path="/shippingInfo"
        element={
          !isAuth ? (
            <Navigate to={"/login"} state={{ from: "/shippingInfo" }} />
          ) : (
            <AddressPage />
          )
        }
      />
      <Route
      path="/pay"
      element={
        <PaymentPage />
        // !isAuth ? <Navigate to={"/login"} state={{ from: "/pay" }} /> : <PaymentPage />
      }
    />
      <Route
        path="/profile"
        element={
          !isAuth ? <Navigate to={"/login"} state={{ from: "/profile" }} /> : <ProfilePage />
        }
      />
      <Route  
        path="/orders"
        element={
          !isAuth ? <Navigate to={"/login"} state={{ from: "/orders" }} /> : <OrderPage />
        }
      />
    </Routes>
  );
}

export default FileRoutesNav;


// <Route
// path="/pay"
// element={
//   !isAuth ? <Navigate to={"/login"} state={{ from: "/pay" }} /> : <PaymentPage />
// }
// />