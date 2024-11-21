// src/components/TopBar/TopBar.js

import "./TopBar.scss";
import React, { useEffect, useState } from "react"; // Imported useEffect and useState for managing login status

import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import logoimg from "../../assets/logo.png";
// import { BsTelephone } from "react-icons/bs";
import {
  AiOutlineShoppingCart,
  AiOutlineHeart,
  // AiOutlineInstagram,
  AiOutlineUser,
} from "react-icons/ai";
// import { FaSnapchat } from "react-icons/fa";
import { getTextString } from "../../assets/TextStrings";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuth, toggleLanguage } from "../../store/authSlice";

function TopBar() {
  const { isAuth, isArabicLanguage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const textString = getTextString(isArabicLanguage);
  const navigate = useNavigate(); // Hook for navigation
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status


  useEffect(() => {
    const checkLoginStatus = async () => {
      const userToken = await AsyncStorage.getItem("userid");
      setIsLoggedIn(!!userToken);
    };
    checkLoginStatus();
  }, []);

  // const logoutFunc = async () => {
    
  //   try {
  //     // Clearing client data from AsyncStorage
  //     await AsyncStorage.removeItem("ac_zurex_web_client");
  //     // Dispatching action to update authentication state
  //     dispatch(setAuth(false));
  //     // Logging out user from webengage
  //     window.webengage.user.logout();
  //     // Clearing user data from localStorage
  //     localStorage.removeItem("userid"); // Replace with your actual localStorage key
  //     // Redirecting to login page
  //     navigate("/login");
  //   } catch (error) {
  //     console.error("Error logging out:", error);
  //   }
  // };

  // Function to handle cart click
  
  const logoutFunc = async () => {
    try {
      // Clearing client data from AsyncStorage
      await AsyncStorage.removeItem("ac_zurex_web_client");
      await AsyncStorage.removeItem("userid");
  
      // Removing specific items from localStorage
      const itemsToRemoveLocal = [
        "selectedDateRange",
        "ac-zurex-client-order-products",
        "aczurex_admin_login",
        "firebase:host:aczurex-d4b61-default-rtdb.firebaseio.com",
        "ac_Zurex_client_cart",
        "ac_Zurex_client_favorite",
        "preferences",
        "_grecaptcha"
      ];
      
      itemsToRemoveLocal.forEach(key => localStorage.removeItem(key));
  
      // Removing specific items from sessionStorage
      const itemsToRemoveSession = [
        "cars",
        "filteredProducts"
      ];
      
      itemsToRemoveSession.forEach(key => sessionStorage.removeItem(key));
  
      // Dispatching action to update authentication state
      dispatch(setAuth(false));
  
      // Logging out user from webengage
      window.webengage.user.logout();
  
      // Redirecting to login page
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  
  const handleCartClick = () => {
    if (!isLoggedIn) {
      navigate("/login"); // Redirect to login if not logged in
    } else {
      navigate("/cart"); // Navigate to cart if logged in
    }
  };

  // Function to handle favorite click
  const handleFavoriteClick = () => {
    if (!isLoggedIn) {
      navigate("/login"); // Redirect to login if not logged in
    } else {
      navigate("/favorite"); // Navigate to favorite if logged in
    }
  };

  const CustNavs = () => (
    <>
      <Nav.Link eventKey="1" className="text-center my-auto mx-1">
        <NavLink
          exact
          to="/"
          className={({ isActive }) =>
            !isActive ? "inActiveColor" : "activeColor"
          }
        >
          {textString.homeNavTxt}
        </NavLink>
      </Nav.Link>
      <Nav.Link eventKey="43" className="text-center my-auto mx-1">
        <NavLink
          to="/about"
          className={({ isActive }) =>
            !isActive ? "inActiveColor" : "activeColor"
          }
        >
          {textString.aboutNavTxt}
        </NavLink>
      </Nav.Link>


      <Nav.Link eventKey="2" className="text-center my-auto mx-1">
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            !isActive ? "inActiveColor" : "activeColor"
          }
        >
          {textString.contactNavTxt}
        </NavLink>
      </Nav.Link>
      <Nav.Link eventKey="3" className="text-center my-auto mx-1">
        <NavLink
          to="/FAQ"
          className={({ isActive }) =>
            !isActive ? "inActiveColor" : "activeColor"
          }
        >
          {textString.helpNavTxt}
        </NavLink>
      </Nav.Link>
      <Nav.Link eventKey="5" className="text-center my-auto mx-1">
        <NavLink
          to="/tips"
          className={({ isActive }) =>
            !isActive ? "inActiveColor" : "activeColor"
          }
        >
          {textString.tipsNavTxt}
        </NavLink>
      </Nav.Link>
      {isAuth && ( // Conditionally render orders link if user is authenticated
        <Nav.Link eventKey="7" className="text-center my-auto mx-1">
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              !isActive ? "inActiveColor" : "activeColor"
            }
          >
            {textString.orderNavTxt}
          </NavLink>
        </Nav.Link>
      )}
      {isAuth ? (
        <>
        {/*  <Nav.Link eventKey="6" className="text-center my-auto mx-1">
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                !isActive ? "inActiveColor" : "activeColor"
              }
            >
              {textString.walletNavTxt}
            </NavLink>
          </Nav.Link> */}
          <Nav.Link
            eventKey="10"
            className="text-cente my-auto mx-1"
            onClick={logoutFunc}
          >
            {textString.logoutNavTxt}
          </Nav.Link>
        </>
      ) : (
        <Nav.Link eventKey="4" className="text-center my-auto mx-1">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              !isActive ? "inActiveColor" : "activeColor"
            }
          >
            {textString.loginNavTxt}
          </NavLink>
        </Nav.Link>
      )}
    </>
  );

  return (
    <>
      <Navbar
        collapseOnSelect
        sticky="top"
        expand="lg"
        className="w-100 customColorTopBarBg"
      >
        <Container>
          <Navbar.Toggle
            className="customTogleBtn py-1"
            aria-controls="offcanvasNavbar-expand-lg"
          />
          <NavLink
            to="/"
            onClick={() => {
              const section = document.querySelector("#mainSection");
              section?.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest",
              });
            }}
            style={{ marginRight: "0px", width: "auto", background: "none" }}
            className="navbar-brand d-flex nillbtn h-100 allCenter py-1"
          >
            <img
              style={{ objectFit: "contain", height: "30px" }}
              className="logoImgResp"
              src={logoimg}
              alt="logo"
            />
          </NavLink>
          <Navbar.Offcanvas
            id="offcanvasNavbar-expand-lg"
            aria-labelledby="offcanvasNavbarLabel-expand-lg"
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
                {textString.offcanvasTitle}
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-center flex-grow-1">
                <CustNavs />
              </Nav>
              <div className="d-flex align-items-center justify-content-between flex-column flex-lg-row">
                <div className="d-flex align-items-center justify-content-center justify-content-lg-start flex-column flex-lg-row flex-grow-1">
                 <Nav.Link eventKey="8" className="text-center my-auto mx-1">
  <button
    onClick={handleCartClick} // onClick handler for cart button
    className="iconButtonCustom"
  >
    <AiOutlineShoppingCart />
  </button>
</Nav.Link>
<Nav.Link eventKey="9" className="text-center my-auto mx-1">
  <button
    onClick={handleFavoriteClick} // onClick handler for favorite button
    className="iconButtonCustom"
  >
    <AiOutlineHeart />
  </button>
</Nav.Link>

                  {isAuth && (
                    <Nav.Link
                      eventKey="11"
                      className="text-center my-auto mx-1 d-none d-lg-block"
                    >
                      <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                          !isActive
                            ? "iconButtonCustom inActiveColor"
                            : "iconButtonCustom activeColor"
                        }
                      >
                        <AiOutlineUser />
                      </NavLink>
                    </Nav.Link>
                  )}
                </div>
                <div className="d-flex align-items-center justify-content-center justify-content-lg-end flex-column flex-lg-row flex-grow-1">
                 {/* <button className="iconButtonCustom">
                    // <BsTelephone />
                  </button>
                  <button className="iconButtonCustom">
                    <AiOutlineInstagram />
                  </button>
                  <button className="iconButtonCustom">
                    <FaSnapchat />
                  </button>
                  */}
                  <button
                    className="iconButtonCustom"
                    onClick={() => dispatch(toggleLanguage())}
                  >
                    {isArabicLanguage ? "English" : "العربية"}
                  </button>
                </div>
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default TopBar;


  //     <Nav.Link eventKey="44" className="text-center my-auto mx-1">
  //     <NavLink
  //       to="/term-conditions"
  //       className={({ isActive }) =>
  //         !isActive ? "inActiveColor" : "activeColor"
  //       }
  //     >
  //       {textString.termsconditionTxt}
  //     </NavLink>
  //   </Nav.Link>
  //   <Nav.Link eventKey="45" className="text-center my-auto mx-1">
  //   <NavLink
  //     to="/privacy-policy"
  //     className={({ isActive }) =>
  //       !isActive ? "inActiveColor" : "activeColor"
  //     }
  //   >
  //  Privacy-Policy
  //   </NavLink>
  // </Nav.Link>