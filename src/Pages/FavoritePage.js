// import React from "react";
// import { textString } from "../assets/TextStrings";
// import batteryImage from "../assets/battery.png";
// import oilImage from "../assets/oil.png";
// import tyreImage from "../assets/tyre.png";
// import { FaHeart } from "react-icons/fa";
// import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
// import { useDispatch, useSelector } from "react-redux";
// import logo from "../assets/logo.png";
// import { toast } from "react-toastify";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { setFavoriteItems } from "../store/authSlice";

// function FavoritePage() {
//   const { favoriteItems } = useSelector((state) => state.auth);
//   const { filtersData, oilsData, tireData, batteryData, engineOilsData } =
//     useSelector((state) => state.project);
//   const filteredDataFun = (id, referance) => {
//     const finalizingDataType =
//       referance === "Filters"
//         ? filtersData
//         : referance === "Tyres"
//         ? tireData
//         : referance === "btteries"
//         ? batteryData
//         : referance === "Oils"
//         ? oilsData
//         : referance === "engineOil"
//         ? engineOilsData
//         : [];
//     const finalData = finalizingDataType?.find((dat) => dat.id === id);
//     return finalData;
//   };

//   const dispatch = useDispatch();
//   const removeToFavoriteFun = async (indexId) => {
//     const newFavoriteItems = favoriteItems?.filter(
//       (dat, ind) => ind !== indexId
//     );
//     await AsyncStorage.setItem(
//       "ac_Zurex_client_favorite",
//       JSON.stringify(newFavoriteItems)
//     );
//     dispatch(setFavoriteItems({ favoriteItems: newFavoriteItems }));

//     toast.success("Product added to favorites");
//   };

//   const isArabic = false;
//   return (
//     <div className="container mt-4 cartPage">
//       <h1 className="pageHeading mb-4">{textString.favriteTxt}</h1>
//       {favoriteItems && favoriteItems?.length > 0 ? (
//         <>
//           <div className="row mt-4 mb-4">
//             {favoriteItems?.map((dat, index) => {
//               const data = filteredDataFun(dat.id, dat.referance);
//               return (
//                 <div key={index} className="col-12 col-md-6 col-lg-3 mb-4">
//                   <div className="cartCardContainerNew d-flex align-items-center justify-content-center flex-column">
//                     <img
//                       src={
//                         dat.referance === "Filters" || dat.referance === "Oils"
//                           ? oilImage
//                           : dat.referance === "btteries"
//                           ? batteryImage
//                           : dat.referance === "Tyres"
//                           ? tyreImage
//                           : logo
//                       }
//                       alt="product"
//                     />
//                     <div className="otherInfoContainer">
//                       <p>
//                         {!isArabic
//                           ? data?.productNameEng
//                           : data?.productNameArab}
//                       </p>
//                       <div className="lowerSideContainer">
//                         <p className="lowerPara">
//                           {data?.originalPrice} {textString.currencyTxt}
//                         </p>
//                         <button onClick={() => removeToFavoriteFun(index)}>
//                           <FaHeart />
//                         </button>
//                       </div>
//                       <button className="addToCartBtn">
//                         <AiOutlineShoppingCart /> {textString.addToCartTxt}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </>
//       ) : (
//         <>
//           <div className="emptyCart">
//             <div className="emptyCart">
//               <AiOutlineHeart size={250} color="lightgrey" />
//               <p>{textString.emptyFvrtTxt}</p>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default FavoritePage;

import React, { useEffect } from "react";
// import { textString } from "../assets/TextStrings";
import batteryImage from "../assets/battery.png";
import oilImage from "../assets/oil.png";
import tyreImage from "../assets/tyre.png";
import { FaHeart } from "react-icons/fa";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setFavoriteItems } from "../store/authSlice";
import { addToCart } from "../utils/cartUtils"; // Import the addToCart utility function
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { getTextString } from "../assets/TextStrings";
import { logAnalyticsEvent } from "../DataBase/databaseFunction";
function FavoritePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  // const { isArabicLanguage } = useSelector((state) => state.auth);
  const { isAuth, isArabicLanguage } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!isAuth) {
      navigate("/login"); // Redirect to login page if not authenticated
    }
  }, [isAuth, navigate]);
  

  const textString = getTextString(isArabicLanguage);
  const { favoriteItems, cartItems } = useSelector((state) => state.auth); // Get cartItems from the state
  const { filtersData, oilsData, tireData, batteryData, engineOilsData , engineOilPetrolData} =
    useSelector((state) => state.project);

  const filteredDataFun = (id, referance) => {
    const finalizingDataType =
      referance === "Filters"
        ? filtersData
        : referance === "Tyres"
        ? tireData
        : referance === "btteries"
        ? batteryData
        : referance === "Oils"
        ? oilsData
        : referance === "engineOil"
        ? engineOilsData
        : referance === "engineOilPetrol"
        ? engineOilPetrolData
        : [];
    const finalData = finalizingDataType?.find((dat) => dat.id === id);
    return finalData;
  };

  const removeToFavoriteFun = async (indexId) => {
    
    const newFavoriteItems = favoriteItems?.filter(
      (dat, ind) => ind !== indexId
    );
   
    
    await AsyncStorage.setItem(
      "ac_Zurex_client_favorite",
      JSON.stringify(newFavoriteItems)
    );
    const{referance,id}=favoriteItems[indexId];
    dispatch(setFavoriteItems({ favoriteItems: newFavoriteItems }));
   
    
    const referenceToDataMap = {
      btteries: batteryData,
      engineOil: engineOilsData,
      engineOilPetrol: engineOilPetrolData,
      Tyres: tireData,
    };

    const referncesToMap = {
      btteries: "batteryName",
      engineOil: "engineOilName",
      engineOilPetrol: "engineOilName",
      Tyres: "tireName",
    };
    if (referncesToMap[referance]) {
      const dataArray = referenceToDataMap[referance];
  
      const dataItem = dataArray.find((dat) => dat.id === id);

      if (dataItem) {
        
        const itemName = dataItem.productNameEng;
        
      const analyticsParam = referncesToMap[referance];
  
      const analyticsEventData = {
        [analyticsParam]: itemName,
      };
      
      
  await logAnalyticsEvent("web_whisList_RemovedProduct", analyticsEventData);
    } else {
      console.log(`Item with ID ${id} not found in data array for reference ${referance}`);
    }
  } else {
    console.log(`Reference ${referance} is not mapped to any data array`);
  }
     
    toast.success("Product removed from favorites");
  };

  const handleAddToCart = (productData, itemTotal = 1, indexId) => {
    removeToFavoriteFun(indexId).then(() => {
      addToCart(productData, itemTotal, cartItems, dispatch, navigate);
    });
  };

  const isArabic = false;
  return (
    <div className="container mt-4 cartPage">
      <h1 className="pageHeading mb-4">{textString.favriteTxt}</h1>
      {favoriteItems && favoriteItems?.length > 0 ? (
        <>
          <div className="row mt-4 mb-4">
            {favoriteItems?.map((dat, index) => {
              const data = filteredDataFun(dat.id, dat.referance);
              return (
                <div key={index} className="col-12 col-md-6 col-lg-3 mb-4">
                  <div className="cartCardContainerNew d-flex align-items-center justify-content-center flex-column">
                    <img
                      src={
                        dat.referance === "Filters" || dat.referance === "Oils" ||  dat.referance === "engineOilPetrol"
                          ? oilImage
                          : dat.referance === "btteries"
                          ? batteryImage
                          : dat.referance === "Tyres"
                          ? tyreImage
                          // : dat.referance === "engineOilPetrol"
                          // ? engineOilPetrolI // Added condition for engineOilPetrol
                          : logo
                      }
                      alt="product"
                    />
                    <div className="otherInfoContainer">
                      <p>
                        {!isArabic
                          ? data?.productNameEng
                          : data?.productNameArab}
                      </p>
                      <div className="lowerSideContainer">
                        <p className="lowerPara">
                          {data?.originalPrice} {textString.currencyTxt}
                        </p>
                        <button onClick={() => removeToFavoriteFun(index)}>
                          <FaHeart />
                        </button>
                      </div>
                      <button
                        className="addToCartBtn"
                        onClick={() => handleAddToCart(data, 1, index)}
                      >
                        <AiOutlineShoppingCart /> {textString.addToCartTxt}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="emptyCart">
            <div className="emptyCart">
              <AiOutlineHeart size={250} color="lightgrey" />
              <p>{textString.emptyFvrtTxt}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default FavoritePage;
