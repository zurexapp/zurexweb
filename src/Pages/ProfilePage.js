// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import profileImage from "../assets/face.png";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { setAuth, fetchUserProfile, updateUserProfile } from "../store/authSlice";
// import { FaEdit, FaSave } from "react-icons/fa";

// function ProfilePage() {
//   const { isAuth, user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();

//   const [isEditing, setIsEditing] = useState({ name: false, email: false, phone: false });
//   const [editValues, setEditValues] = useState({
//     name: user?.name || "",
//     email: user?.userEmail || "",
//     phone: user?.phoneNumber || ""
//   });

//   useEffect(() => {
//     if (isAuth && isAuth.userId) {
//       dispatch(fetchUserProfile(isAuth.userId));
//     }
//   }, [isAuth, dispatch]);

//   useEffect(() => {
//     // Update editValues when user data changes
//     setEditValues({
//       name: user?.name || "",
//       email: user?.userEmail || "",
//       phone: user?.phoneNumber || ""
//     });
//   }, [user]);

//   const handleEditToggle = (field) => {
//     setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditValues((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async (field) => {
//     try {
//       await dispatch(updateUserProfile({
//         userId: isAuth.userId,
//         profileData: { [field]: editValues[field] }
//       }));
//       handleEditToggle(field); // Toggle editing mode off after save
//     } catch (error) {
//       console.error("Error updating profile:", error);
//     }
//   };

//   const logoutFunc = async () => {
//     // Perform logout actions
//     await AsyncStorage.removeItem("ac_zurex_web_client");
//     dispatch(setAuth({ isAuth: null }));
//   };

//   return (
//     <div className="container profilePage" style={{ marginBottom: "7rem", marginTop: "7rem" }}>
//       <div className="w-100 mb-4 d-flex align-items-center justify-content-center flex-column">
//         <div className="userImageContainer mb-3">
//           <img src={profileImage} alt="user" style={{ width: "200px", marginBottom: "30px" }} />
//           <h2>Profile Details</h2> {/* Added heading for profile details */}
//         </div>
//         <div className="mb-3 d-flex align-items-center">
//           {isEditing.name ? (
//             <>
//               <input
//                 type="text"
//                 name="name"
//                 value={editValues.name}
//                 onChange={handleInputChange}
//                 className="form-control mr-2"
//               />
//               <button onClick={() => handleSave("name")} className="btn btn-link">
//                 <FaSave />
//               </button>
//             </>
//           ) : (
//             <>
//               <p className="usernamePara">
//                 {user?.name ? user.name : "Name not provided"}
//               </p>
//               <button onClick={() => handleEditToggle("name")} className="btn btn-link ml-2">
//                 <FaEdit />
//               </button>
//             </>
//           )}
//         </div>
//         <div className="mb-3 d-flex align-items-center">
//           {isEditing.email ? (
//             <>
//               <input
//                 type="text"
//                 name="email"
//                 value={editValues.email}
//                 onChange={handleInputChange}
//                 className="form-control mr-2"
//               />
//               <button onClick={() => handleSave("userEmail")} className="btn btn-link">
//                 <FaSave />
//               </button>
//             </>
//           ) : (
//             <>
//               <p className="userDetails">
//                 {user?.userEmail ? user.userEmail : "Email not provided"}
//               </p>
//               <button onClick={() => handleEditToggle("email")} className="btn btn-link ml-2">
//                 <FaEdit />
//               </button>
//             </>
//           )}
//         </div>
//         <div className="mb-3 d-flex align-items-center">
//           {isEditing.phone ? (
//             <>
//               <input
//                 type="text"
//                 name="phone"
//                 value={editValues.phone}
//                 onChange={handleInputChange}
//                 className="form-control mr-2"
//               />
//               <button onClick={() => handleSave("phoneNumber")} className="btn btn-link">
//                 <FaSave />
//               </button>
//             </>
//           ) : (
//             <>
//               <p className="userDetails">
//                 {user?.phoneNumber ? user.phoneNumber : "Phone number not provided"}
//               </p>
//               <button onClick={() => handleEditToggle("phone")} className="btn btn-link ml-2">
//                 <FaEdit />
//               </button>
//             </>
//           )}
//         </div>
//         <button onClick={logoutFunc} className="customLogoutBtn btn btn-danger mt-4">
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ProfilePage;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import profileImage from "../assets/face.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuth, fetchUserProfile, updateUserProfile } from "../store/authSlice";
import { FaEdit, FaSave } from "react-icons/fa";
import {  useNavigate } from "react-router-dom";
import { getTextString } from "../assets/TextStrings";


function ProfilePage() {
  const { isAuth, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { isArabicLanguage } = useSelector((state) => state.auth);
      const textString = getTextString(isArabicLanguage);

  const [isEditing, setIsEditing] = useState({ name: false, email: false });
  const [editValues, setEditValues] = useState({
    name: user?.name || "",
    email: user?.userEmail || ""
  });

  useEffect(() => {
    if (isAuth && isAuth.userId) {
      dispatch(fetchUserProfile(isAuth.userId));
    }
  }, [isAuth, dispatch]);

  useEffect(() => {
    // Update editValues when user data changes
    setEditValues({
      name: user?.name || "",
      email: user?.userEmail || ""
    });
     // Log the user's name, email, and phone number
     console.log("Name:", user?.name);
     console.log("Email:", user?.userEmail);
     console.log("Phone Number:", user?.phoneNumber); 
  },
   [user]);

  const handleEditToggle = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (field) => {
    try {
      await dispatch(updateUserProfile({
        userId: isAuth.userId,
        profileData: { [field]: editValues[field] }
      }));
      handleEditToggle(field); // Toggle editing mode off after save
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // const logoutFunc = async () => {
  //   // Perform logout actions
  //   await AsyncStorage.removeItem("ac_zurex_web_client");
  //   dispatch(setAuth({ isAuth: null }));
  // };
  const navigate = useNavigate(); // Hook for navigation

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

  return (
    <div className="container profilePage" style={{ marginBottom: "7rem", marginTop: "7rem" }}>
      <div className="w-100 mb-4 d-flex align-items-center justify-content-center flex-column">
        <div className="userImageContainer mb-3">
          <img src={profileImage} alt="user" style={{ width: "200px", marginBottom: "30px" }} />
          <h2>{textString.profileTxt}</h2> {/* Added heading for profile details */}
        </div>
        <div className="mb-3 d-flex align-items-center">
          {isEditing.name ? (
            <>
              <input
                type="text"
                name="name"
                value={editValues.name}
                onChange={handleInputChange}
                className="form-control mr-2"
              />
              <button onClick={() => handleSave("name")} className="btn btn-link">
                <FaSave />
              </button>
            </>
          ) : (
            <>
              <p className="usernamePara">
                {user?.name ? user.name : "Name not provided"}
              </p>
              <button onClick={() => handleEditToggle("name")} className="btn btn-link ml-2">
                <FaEdit />
              </button>
            </>
          )}
        </div>
        <div className="mb-3 d-flex align-items-center">
          {isEditing.email ? (
            <>
              <input
                type="text"
                name="email"
                value={editValues.email}
                onChange={handleInputChange}
                className="form-control mr-2"
              />
              <button onClick={() => handleSave("userEmail")} className="btn btn-link">
                <FaSave />
              </button>
            </>
          ) : (
            <>
              <p className="userDetails">
                {user?.userEmail ? user.userEmail : "Email not provided"}
              </p>
              <button onClick={() => handleEditToggle("email")} className="btn btn-link ml-2">
                <FaEdit />
              </button>
            </>
          )}
        </div>
        <button onClick={logoutFunc} className="customLogoutBtn btn btn-danger mt-4">
          {textString.logoutNavTxt}
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
