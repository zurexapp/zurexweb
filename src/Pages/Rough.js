import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import batteryImage from "../assets/battery.png";
import oilImage from "../assets/oil.png";
import tyreImage from "../assets/tyre.png";
import Carousel from "react-bootstrap/Carousel";
// import { textString } from "../assets/TextStrings";
import { FaStar } from "react-icons/fa";
import { getTextString } from "../assets/TextStrings";
import {
  //AiOutlineInstagram,
  //AiOutlineStar,
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineShoppingCart,
  AiOutlineHeart,
} from "react-icons/ai";
//import { FaSnapchat, FaFacebookF, FaTwitter } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { setCartItems, setFavoriteItems } from "../store/authSlice";
import { logAnalyticsEvent } from "../DataBase/databaseFunction";

function ProductDescriptionPage() {
  const dispatch = useDispatch();
  const {
    filtersData,
    oilsData,
    tireData,
    batteryData,
    engineOilsData,
    engineOilPetrolData,
    clientCarsData,
  } = useSelector((state) => state.project);
  const { cartItems, favoriteItems } = useSelector((state) => state.auth);
  const [productData, setproductData] = useState(null);
  const { id } = useParams();
  const [itemTotal, setitemTotal] = useState(1);
  const [selectedPriceType, setSelectedPriceType] = useState("original"); // State to manage price type selection
  const [selectedPrice, setSelectedPrice] = useState(productData?.originalPrice);

  const navigate = useNavigate();
  const { isArabicLanguage } = useSelector((state) => state.auth);
  const textString = getTextString(isArabicLanguage);

  useEffect(() => {
    const filteredDataFun = () => {
      console.log("Engine Oil Petrol Datassss:", engineOilPetrolData);
      const responce = id.split("_@_");
      const productId = responce[2];
      const referance = responce[1];
      const productName = responce[0];
      console.log(productName);
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
      const finalData = finalizingDataType?.find((dat) => dat.id === productId);
      setproductData(finalData);
    };
    filteredDataFun();
  }, [
    filtersData,
    oilsData,
    tireData,
    batteryData,
    id,
    engineOilsData,
    engineOilPetrolData,
  ]);
  console.log(productData);
  const filterData = []?.filter((dat) => dat?.title?.replace(/ /g, "_") === id);
  const result = filterData?.length > 0 ? filterData[0] : {};
  const imgArray = useMemo(() => {
    return productData?.images?.length
      ? productData.images.map((image) => ({ imglInk: image.imgLink }))
      : [
          { imglInk: oilImage },
          { imglInk: batteryImage },
          { imglInk: oilImage },
          { imglInk: tyreImage },
          { imglInk: batteryImage },
        ];
  }, [productData]);

  const [tabbyLoaded, setTabbyLoaded] = useState(false);
  const [tamaraLoaded, setTamaraLoaded] = useState(false);
  // const [installmentAmount, setInstallmentAmount] = useState(0);

  useEffect(() => {
    if (!tabbyLoaded && productData) {
      const script = document.createElement("script");
      script.src = "https://checkout.tabby.ai/tabby-promo.js";
      script.async = true;
      script.onload = () => {
        const priceToUse = productData?.discountPrice
          ? productData.discountPrice
          : productData.originalPrice;
        console.log("Tabby Promo Price:", priceToUse);

        new window.TabbyPromo({
          selector: "#TabbyPromo",
          currency: "AED",
          price: priceToUse,
          installmentsCount: 4,
          lang: "en",
          source: "product",
          publicKey: "YOUR_PUBLIC_API_KEY", // Replace with your actual Public API Key
          merchantCode: "YOUR_MERCHANT_CODE", // Replace with your actual Merchant Code
        });
        setTabbyLoaded(true);
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [productData, tabbyLoaded]);


  useEffect(() => {
    if (!tamaraLoaded && productData) {
      const priceToUse = productData?.discountPrice || productData?.originalPrice;

      // // Calculate the installment amount for Tamara (Split in 4 payments)
      // const installment = (priceToUse / 4).toFixed(2);
      // setInstallmentAmount(installment);

      // Set up the Tamara widget configuration
      window.tamaraWidgetConfig = {
        lang: 'en', // Language for the widget
        country: 'AE', // Country code
        publicKey: 'YOUR_TAMARA_PUBLIC_KEY', // Replace with your actual Tamara public key
        amount: priceToUse, // Use the correct amount for the widget
        style: {
          fontSize: '14px',
          badgeRatio: 1,
          
        },
      };

      // Load the Tamara widget script dynamically
      const script = document.createElement('script');
      script.src = 'https://cdn.tamara.co/widget-v2/tamara-widget.js';
      script.defer = true;
      script.onload = () => {
        window.TamaraWidgetV2.refresh(); // Ensure the widget refreshes when loaded
        setTamaraLoaded(true);
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [productData, tamaraLoaded]);


// Handle price type change
const handlePriceTypeChange = (type) => {
  setSelectedPriceType(type);
  setSelectedPrice(type === "original" ? productData?.originalPrice : productData?.commercialPrice);
};

  // const isArabic = false;
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if the product is already in favorites on component mount
  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(
          "ac_Zurex_client_favorite"
        );
        const favoriteList = storedFavorites ? JSON.parse(storedFavorites) : [];
        const isProductInFavorite = favoriteList.some(
          (item) => item.id === productData?.id
        );
        setIsFavorite(isProductInFavorite);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    checkIfFavorite();
  }, [productData?.id]);

  const addToFavoriteFun = async () => {
    try {
      // Prevent adding the product again if it's already in favorites
      if (isFavorite) {
        toast.info(textString.favoriteToastTxt2);
        return;
      }

      const newFavoriteItems =
        favoriteItems?.length > 0
          ? [
              ...favoriteItems,
              {
                referance: productData?.referance,
                quantity: 1,
                id: productData?.id,
              },
            ]
          : [
              {
                referance: productData?.referance,
                quantity: 1,
                id: productData?.id,
              },
            ];

      // Save updated items to AsyncStorage
      await AsyncStorage.setItem(
        "ac_Zurex_client_favorite",
        JSON.stringify(newFavoriteItems)
      );

      // Ensure favorite items are updated in Redux store
      dispatch(setFavoriteItems({ favoriteItems: newFavoriteItems }));

      // Track event with webengage
      await window.webengage.track("Added To Favourites", {
        "product name": productData?.productNameEng,
        Category: productCat,
        Currency: textString.currencyTxt,
        Price: productData?.originalPrice,
        "Product ID": productData?.id,
        "Brand Name": productData?.productNameEng,
        Quantity: itemTotal,
        Image: imgArray[0].imglInk
          ? imgArray[0].imglInk?.includes("http")
            ? [imgArray[0].imglInk]
            : [`${window.location.origin}${imgArray[0].imglInk}`]
          : [""],
      });

      // Update the local state to reflect that the product is in favorites
      setIsFavorite(true);

      // Show success toast
      toast.success(textString.favoriteToastTxt1);
    } catch (error) {
      console.error("Error adding product to favorites:", error);
      toast.error("Failed to add product to favorites");
    }
  };

  const addToCartsItem = async () => {
    // Prepare the new cart items
    const newCartItems =
      cartItems?.length > 0
        ? [
            ...cartItems,
            {
              referance: productData?.referance,
              quantity: itemTotal,
              id: productData?.id,
              priceType: selectedPriceType,
              price: selectedPrice,
            },
          ]
        : [
            {
              referance: productData?.referance,
              quantity: itemTotal,
              id: productData?.id,
              priceType: selectedPriceType,
              price: selectedPrice,
            },
          ];

    // Save the new cart items to AsyncStorage
    await AsyncStorage.setItem(
      "ac_Zurex_client_cart",
      JSON.stringify(newCartItems)
    );

    // Track the add to cart event with webengage
    window.webengage.track(textString.addToCartTxt, {
      "product name": productData?.productNameEng,
      Category: productCat,
      Currency: textString.currencyTxt,
      // Price: productData?.originalPrice,
    Price: selectedPrice,

      "Product ID": productData?.id,
      "Brand Name": productData?.productNameEng,
      Quantity: itemTotal,
      Image: imgArray[0].imglInk
        ? imgArray[0].imglInk?.includes("http")
          ? [imgArray[0].imglInk]
          : [`${window.location.origin}${imgArray[0].imglInk}`]
        : [""],
    });

    // Determine the analytics parameter for add to cart
    const referenceToParamMap = {
      btteries: "batteryName",
      engineOil: "engineOilName",
      engineOilPetrol: "engineOilName",
      tyres: "tireName",
    };

    // Get the analytics parameter based on the product reference
    if (referenceToParamMap[productData?.referance]) {
      // Get the analytics parameter based on the product reference
      const analyticsParam = referenceToParamMap[productData?.referance];

      // Prepare the analytics event data
      const analyticsEventData = {
        [analyticsParam]: productData?.productNameEng,
      };

      await logAnalyticsEvent("web_Product_Added_To_Cart", analyticsEventData);
    }
 // Save in localStorage or Redux
 await localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    // Update the cart items in the Redux store
    dispatch(setCartItems({ cartItems: newCartItems }));

    // Navigate to the cart page
    navigate("/cart");

    // Show a success message
    toast.success("Product added to Cart");
  };

  useEffect(() => {
    // Define an async function inside the useEffect
    const fetchData = async () => {
      if (
        window &&
        imgArray?.length > 0 &&
        productData?.productNameEng &&
        productData?.originalPrice
      ) {
        if (
          productData?.referance === "engineOil" ||
          productData?.referance === "engineOilPetrol"
        ) {
          setitemTotal(
            clientCarsData?.oilCapacity ? clientCarsData?.oilCapacity : 1
          );
        }

        window.webengage.track("Product Viewed", {
          "Product Name": productData?.productNameEng,
          Price: productData?.originalPrice,
          Currency: textString.currencyTxt,
          Image: imgArray[0].imglInk
            ? imgArray[0].imglInk?.includes("http")
              ? [imgArray[0].imglInk]
              : [`${window.location.origin}${imgArray[0].imglInk}`]
            : [""],
        });

        let analyticsParam = "";
        switch (productData?.referance) {
          case "btteries":
            analyticsParam = "batteryName";
            break;
          case "engineOil":
          case "engineOilPetrol":
            analyticsParam = "engineOilName";
            break;
          case "tyres":
            analyticsParam = "tireName";
            break;
          default:
            analyticsParam = "productName";
            break;
        }

        const analyticsEventData = {
          [analyticsParam]: productData?.productNameEng,
        };

        await logAnalyticsEvent("web_Product_Viewed", analyticsEventData);
      }
    };

    fetchData();
  }, [imgArray, productData, clientCarsData, textString.currencyTxt]);

  const productCat = useMemo(() => {
    // if (!productData?.referance) return ""; // Handle cases where referance might be undefined
    // const referance = productData.referance.toLowerCase();
    const referance = productData?.referance?.toLowerCase() || "";

    if (referance.includes("oils") || referance.includes("filters")) {
      return textString.oilFilterTxt;
    }
    if (
      referance.includes("engineoil") ||
      referance.includes("engineoilpetrol")
    ) {
      return textString.oilFilterTxt;
    }
    if (referance.includes("btteries")) {
      return textString.batteryTxt;
    }
    if (referance.includes("tyres")) {
      return textString.tireTxt;
    }

    return ""; // Default return value if no condition is met
  }, [
    productData,
    textString.oilFilterTxt,
    textString.batteryTxt,
    textString.tireTxt,
  ]);

  return (
    <div className="container my-5 productDescriptionPage">
      <div className="row">
        <div className="col-12 col-md-6 h-100 d-flex align-items-center justify-content-between flex-column">
          <Carousel
            variant="dark"
            className="my-4 crouselCustomClassNew"
            fade
            controls={false}
            interval={4500}
          >
            {productData?.images?.length > 0
              ? productData?.images?.map((dat, index) => (
                  <Carousel.Item key={index}>
                    <div className="crouselImg">
                      <img src={dat?.imgLink} alt="productimg" />
                    </div>
                  </Carousel.Item>
                ))
              : imgArray?.map((dat, index) => (
                  <Carousel.Item key={index}>
                    <div className="crouselImg">
                      <img src={dat?.imgLink} alt="productimg" />
                    </div>
                  </Carousel.Item>
                ))}
          </Carousel>
          <div
            id="TabbyPromo"
            className="tabby-promo"
            style={{ marginTop: "32px" }}
          ></div>
          <div>
             {/* Tamara Installment Widget Section */}
        {/* Custom installment message and Tamara widget */}
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            border: '1px solid #EAEAEA',
            padding: '16px',
            borderRadius: '8px',
            width: '100%',
            // marginTop: '16px',
            // backgroundColor: '#F9F9F9',
          }}
        >
          {/* Tamara Widget */}
          <tamara-widget
            type="tamara-summary"
            inline-type="2"
            amount={productData?.discountPrice || productData?.originalPrice}
            inline-variant="text"
          ></tamara-widget>
        </div>
      </div>

        </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="productHeaderDiv flex-column flex-md-row">
            <div className="infoContainer">
              <h5>
                {isArabicLanguage
                  ? productData?.productNameArab
                  : productData?.productNameEng}
              </h5>
              <p>
                {textString.categoryBtnTxt}::
                {productCat}
              </p>
              <div className="ratingDiv">
                {Array(5)
                  .fill()
                  .map((index) => (
                    <FaStar />
                  ))}
              </div>
            </div>

            <div
              className={`priceContainer align-items-start align-items-md-end ${
                isArabicLanguage ? "rtl" : "ltr"
              }`}
            >
              {productData?.discountPrice ? (
                <span style={{ display: "flex", alignItems: "center" }}>
                  {/* Original Price (strikethrough) */}
                  <span
                    style={{
                      textDecoration: "line-through",
                      // marginLeft: isArabicLanguage ? "3px" : "0",
                      color: "#333",
                      fontSize: isArabicLanguage ? "0.8em" : "0.8em", // Adjust font size based on language
                      fontWeight: isArabicLanguage ? "bold" : "normal", // Bolder font for Arabic
                    }}
                  >
                    {productData?.originalPrice} {textString.currencyTxt}
                  </span>

                  {/* Discount Price */}
                  <span
                    style={{
                      color: "red",
                      marginLeft: isArabicLanguage ? "0px" : "3px", // Adjust margin based on language
                      fontSize: isArabicLanguage ? "0.8em" : "1em", // Adjust font size based on language
                      fontWeight: isArabicLanguage ? "bold" : "normal", // Bolder font for Arabic
                    }}
                  >
                    {productData?.discountPrice} {textString.currencyTxt}
                  </span>
                </span>
              ) : (
                // If no discount, only show original price
                <span
                  style={{
                    fontSize: isArabicLanguage ? "1em" : "1.2em", // Adjust font size for original price
                    fontWeight: isArabicLanguage ? "bold" : "normal", // Bolder font for Arabic
                  }}
                >
                  {productData?.originalPrice} {textString.currencyTxt}
                </span>
              )}
            </div>
          </div>
          <div className="productMoreInfoDiv my-5">
            <p className={isArabicLanguage ? "rtl" : "ltr"}>
              {productData?.productDescArab && productData?.productDescEng
                ? isArabicLanguage
                  ? productData?.productDescArab
                  : productData?.productDescEng
                : ""}
            </p>
            <ul>
              {productData?.productDiemensions ? (
                productData?.productDiemensions?.map((dat, index) => (
                  <li key={index}>
                    <div className="w-100 d-flex align-items-center justify-content-between flex-row">
                      <div>
                        {isArabicLanguage ? dat?.nameArab : dat?.nameEng}/
                      </div>
                      <div>{dat?.value ? dat?.value : productData?.id}</div>
                    </div>
                  </li>
                ))
              ) : (
                <li>
                  <div className="w-100 d-flex align-items-center justify-content-between flex-row">
                    <div>{textString.itemNumTxt}/</div>
                    <div>{productData?.id}</div>
                  </div>
                </li>
              )}
            </ul>
            <p className={`lowerRedPara ${isArabicLanguage ? "rtl" : "ltr"}`}>
              {result?.title?.toLowerCase()?.includes("oil")
                ? textString.oilFilterTxt
                : result?.title?.toLowerCase()?.includes("battery")
                ? textString.batteryTxt
                : result?.title?.toLowerCase()?.includes("tyre")
                ? textString.tireTxt
                : ""}
            </p>
          </div>

             {/* Conditional rendering of buttons */}
             {productData?.referance === "Filters" && (
              <div className="priceTypeSelector">
              <button
                onClick={() => handlePriceTypeChange("original")}
                className={`btn ${selectedPriceType === "original" ? "btn-primary" : "btn-outline-primary"}`}
              >
                Original Price
              </button>
              <button
                onClick={() => handlePriceTypeChange("commercial")}
                className={`btn ${selectedPriceType === "commercial" ? "btn-primary" : "btn-outline-primary"}`}
              >
                Commercial Price
              </button>
            
              <div className="selectedPriceDisplay mt-3">
                <p>Selected Price: {selectedPrice} {textString.currencyTxt}</p>
              </div>
            </div>
            )}


          <div className="row mb-4">
            <div className="col-xs-12 col-md-8 mb-2">
              <div className="d-flex align-items-center justify-content-center flex-row inlineBtnRow">
                <button
                  onClick={() => {
                    if (itemTotal > 1) {
                      setitemTotal(itemTotal - 1);
                    } else {
                      alert("Least quantity reached");
                    }
                  }}
                >
                  <AiOutlineMinus />
                </button>
                {itemTotal}
                <button onClick={() => setitemTotal(itemTotal + 1)}>
                  <AiOutlinePlus />
                </button>
              </div>
            </div>
            <div className="col-xs-12 col-md-4 mb-2">
              <div
                className="PriceCalct"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isArabicLanguage ? "flex-start" : "flex-end", // Adjust alignment based on language
                  direction: isArabicLanguage ? "rtl" : "ltr", // Apply text direction
                  fontSize: isArabicLanguage ? "3em" : "3em", // Larger font size for Arabic
                  fontWeight: isArabicLanguage ? "bold" : "normal", // Bolder font for Arabic language
                }}
              >
                {productData?.discountPrice ? (
                  <span
                    className="priceDisplay"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "1.2em", // Set a base font size for better readability
                    }}
                  >
                    <span
                      className="originalPrice"
                      style={{
                        textDecoration: "line-through",
                        marginLeft: isArabicLanguage ? "3px" : "0",
                        marginRight: isArabicLanguage ? "0" : "0px",
                        color: "#333",
                        fontSize: isArabicLanguage ? "0.4em" : "0.5em", // Larger font size for Arabic
                        fontWeight: isArabicLanguage ? "bold" : "normal", // Bolder font for Arabic language
                      }}
                    >
                      {productData?.originalPrice * itemTotal}{" "}
                      {textString.currencyTxt}
                    </span>
                    <span
                      className="discountPrice"
                      style={{
                        color: "red",
                        fontSize: isArabicLanguage ? "0.5em" : "0.7em", // Larger font size for Arabic
                        fontWeight: isArabicLanguage ? "bold" : "normal", // Bolder font for Arabic language
                      }}
                    >
                      {productData?.discountPrice * itemTotal}{" "}
                      {textString.currencyTxt}
                    </span>
                  </span>
                ) : (
                  <span
                    className="originalPrice"
                    style={{
                      fontSize: isArabicLanguage ? "0.5em" : "0.7em", // Larger font size for Arabic
                      fontWeight: isArabicLanguage ? "bold" : "normal", // Bolder font for Arabic language // Adjust font size when no discount is available
                    }}
                  >
                       {selectedPriceType === "original"
                      ? productData?.originalPrice * itemTotal
                      : productData?.commercialPrice * itemTotal}{" "}
                    {textString.currencyTxt}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-2 d-flex align-items-center justify-content-center">
              <button onClick={addToCartsItem} className="button firstBtn">
                <AiOutlineShoppingCart /> {textString.addToCartTxt}
              </button>
            </div>
            <div className="col-12 col-md-6 mb-2 d-flex align-items-center justify-content-center">
              <button
                onClick={addToFavoriteFun}
                className={`button lastBtn ${
                  isFavorite ? "button firstBtn" : "favorite-btn-inactive"
                }`} // Apply the appropriate class for button color change
                // disabled={isFavorite} // Disable the button if it's already a favorite
              >
                <AiOutlineHeart />
                {isFavorite
                  ? textString.addedFavriteTxt
                  : textString.addFavriteTxt}
              </button>

              {/* Add ToastContainer to display toasts */}
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDescriptionPage;
