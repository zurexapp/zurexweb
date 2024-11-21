import React, { useCallback, useEffect, useState, useMemo } from "react";
import logo from "../assets/logo.png";
import batteryImage from "../assets/battery.png";
import oilImage from "../assets/oil.png";
import tyreImage from "../assets/tyre.png";
import { FiTrash } from "react-icons/fi";
import CartPageImage from "../assets/cartpage.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setCartItems } from "../store/authSlice";
import { removeFromCart } from "../utils/cartUtils";
import { getTextString } from "../assets/TextStrings";
import { logAnalyticsEvent } from "../DataBase/databaseFunction";

function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, isAuth, isArabicLanguage } = useSelector(
    (state) => state.auth
  );
  const {
    filtersData,
    oilsData,
    tireData,
    batteryData,
    engineOilsData,
    engineOilPetrolData,
  } = useSelector((state) => state.project);
  const textString = getTextString(isArabicLanguage);

  const filteredDataFun = useCallback(
    (id, referance) => {
      console.log("Engine Oil Petrol Datassss:", engineOilPetrolData);
  
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
      
      // Add this log to see if selectedPrice and selectedPriceType are coming through
      if (finalData) {
        console.log("Selected Product Data:", finalData);
        console.log("Selected Price:", finalData.selectedPrice);
        console.log("Selected Price Type:", finalData.selectedPriceType);
      } else {
        console.log("No data found for ID:", id, "with reference:", referance);
      }
  
      return finalData;
    },
    [
      batteryData,
      filtersData,
      oilsData,
      tireData,
      engineOilsData,
      engineOilPetrolData,
    ]
  );
  const totalOriginalPrice = useMemo(() => {
    let total = 0;

    cartItems?.forEach((dat) => {
      const data = filteredDataFun(dat.id, dat.referance);

      if (data) {
        const originalPrice = data.originalPrice;

        if (typeof originalPrice === "number" && !isNaN(originalPrice)) {
          const quantity = parseInt(dat.quantity, 10);
          if (!isNaN(quantity)) {
            total += originalPrice * quantity;
          }
        }
      }
    });

    return total.toFixed(2); // Ensure the total is returned with two decimal places
  }, [cartItems, filteredDataFun]);

  const calculatePrice = useCallback(() => {
    let price = 0;
    cartItems?.forEach((dat) => {
      const data = filteredDataFun(dat.id, dat.referance);
      console.log("Fetched datasss:", data); // Log fetched data

      if (data) {
        const pricePerUnit = data.discountPrice
          ? data.discountPrice
          : data.originalPrice;

        if (typeof pricePerUnit === "number" && !isNaN(pricePerUnit)) {
          const quantity = parseInt(dat.quantity, 10);
          if (!isNaN(quantity)) {
            const newPriceData = parseFloat(pricePerUnit) * quantity;
            if (!isNaN(newPriceData)) {
              price += newPriceData;
            } else {
              console.warn(
                `NaN encountered for newPriceData with data:`,
                data,
                dat
              );
            }
          } else {
            console.warn(`NaN encountered for quantity with data:`, dat);
          }
        } else {
          console.warn(
            `Invalid data for ID: ${dat.id}, Referance: ${dat.referance}`,
            data
          );
        }
      }
    });
    return isNaN(price) ? 0 : price;
  }, [cartItems, filteredDataFun]);

  const calculateTotalDiscount = useCallback(() => {
    let totalDiscount = 0;

    cartItems?.forEach((dat) => {
      const data = filteredDataFun(dat.id, dat.referance);

      if (data && data.discountPrice && data.originalPrice) {
        const discountAmount = data.originalPrice - data.discountPrice;
        totalDiscount += discountAmount * parseInt(dat.quantity, 10);
      }
    });

    return parseFloat(totalDiscount.toFixed(2)); // Ensure the discount is a number
  }, [cartItems, filteredDataFun]);

  const totalDiscountAmount = useMemo(
    () => calculateTotalDiscount(),
    [calculateTotalDiscount]
  );
  const subTotal = useMemo(() => {
    let total = 0;

    cartItems?.forEach((dat) => {
      const data = filteredDataFun(dat.id, dat.referance);

      if (data) {
        // Use original price as the base for the calculation
        const originalPrice = data.originalPrice;
        const discountPrice = data.discountPrice;

        if (typeof originalPrice === "number" && !isNaN(originalPrice)) {
          const quantity = parseInt(dat.quantity, 10);
          if (!isNaN(quantity)) {
            // Base item price on the original price
            let priceForItem = originalPrice * quantity;

            // Subtract discount if applicable
            if (discountPrice && typeof discountPrice === "number") {
              const discount = (originalPrice - discountPrice) * quantity;
              priceForItem -= discount;
            }

            // Add item price (after discount) to the total
            total += priceForItem;
          }
        }
      }
    });

    // Add warranty charge if applicable
    if (isWarrantyAdded) {
      total += subscriptionPrice;
    }

    return parseFloat(total.toFixed(2)); // Ensure the total is returned with two decimal places
  }, [cartItems, filteredDataFun, isWarrantyAdded, subscriptionPrice]);

  const calculateTax = useCallback(() => {
    // Ensure the subtotal is a valid number
    const subTotalValue = parseFloat(subTotal);
    if (isNaN(subTotalValue)) {
      console.warn(`Invalid subTotal:`, subTotal);
      return "0.00"; // Return "0.00" if subtotal is invalid
    }

    // Calculate tax based on the subtotal (15%)
    const tax = subTotalValue * 0.15;

    // Return the calculated tax formatted to 2 decimal places
    return tax.toFixed(2);
  }, [subTotal]);

  const totalPrice = useMemo(() => calculatePrice(), [calculatePrice]);
  const tax = parseFloat(calculateTax());
  const totalPriceWithTaxAndServiceCharge = useMemo(
    () => totalPrice + tax + serviceCharge,
    [totalPrice, tax, serviceCharge]
  );

  // Calculate total with or without warranty
  const totalWithWarranty = useMemo(
    () =>
      isWarrantyAdded
        ? totalPriceWithTaxAndServiceCharge + subscriptionPrice
        : totalPriceWithTaxAndServiceCharge,
    [isWarrantyAdded, totalPriceWithTaxAndServiceCharge, subscriptionPrice]
  );

  const removeToCartsItem = async (indexId) => {
    const { referance, id } = cartItems[indexId];

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

        await logAnalyticsEvent("web_Cart_RemovedProduct", analyticsEventData);
      } else {
        console.log(
          `Item with ID ${id} not found in data array for reference ${referance}`
        );
      }
    } else {
      console.log(`Reference ${referance} is not mapped to any data array`);
    }

    removeFromCart(indexId, cartItems, dispatch, filteredDataFun);
  };

  const completeOrderFun = async () => {
    let processName = "otherProduct";

    // Determine the process name based on the items in the cart
    if (cartItems?.some((item) => item.referance === "btteries")) {
      processName = "battery";
    } else if (cartItems?.some((item) => item.referance === "Tyres")) {
      processName = "tyre";
    } else if (
      cartItems?.some(
        (item) =>
          item.referance === "Oils" ||
          item.referance === "engineOil" ||
          item.referance === "engineOilPetrol"
      )
    ) {
      processName = "oil";
    }

    // Create the order data object
    const orderData = {
      products: cartItems,
      processName: processName,
      Price: totalPrice,
      subTotal: subTotal,
      totalDiscountAmount: totalDiscountAmount,
      tax: tax,
      TotalPrice: isWarrantyAdded
        ? parseFloat(totalWithWarranty.toFixed(2)) // Total price with warranty if added
        : parseFloat(totalPriceWithTaxAndServiceCharge.toFixed(2)), // Total price without warranty
      serviceCharge: serviceCharge,
      subscriptionPrice: isWarrantyAdded ? subscriptionPrice : 0,
      totalWithWarranty: isWarrantyAdded ? parseFloat(totalWithWarranty.toFixed(2)) : 0,
    };

    // Log the order data
    console.log("Complete Order Data:", orderData);

    // Save the order data to localStorage
    await window.localStorage.setItem(
      "ac-zurex-client-order-products",
      JSON.stringify(orderData)
    );

    // Navigate to the shipping info page
    navigate("/shippingInfo");
  };
  useEffect(() => {
    const fetchCart = async () => {
      const asyncCartItem = await AsyncStorage.getItem("ac_Zurex_client_cart");
      if (asyncCartItem) {
        dispatch(setCartItems({ cartItems: JSON.parse(asyncCartItem) }));
      }
    };
    fetchCart();
  }, [dispatch]);
  useEffect(() => {
    if (cartItems && cartItems.length && calculatePrice() !== 0) {
      const pName = cartItems
        ?.map((dat) => filteredDataFun(dat.id, dat.referance)?.productNameEng)
        .filter((name) => name) // Filter out any undefined names
        .join(", ");
      window.webengage.track("Cart Viewed", {
        "Product details": cartItems,
        "Number of Products": cartItems.length,
        "product name": pName,
        "Total Amount": calculatePrice(),
      });
    }
  }, [calculatePrice, cartItems, filteredDataFun]);

  useEffect(() => {
    if (cartItems && cartItems.length && calculatePrice() !== 0) {
      const pName = cartItems
        ?.map((dat) => filteredDataFun(dat.id, dat.referance)?.productNameEng)
        .join(", ");
      window.webengage.track("Cart Updated", {
        "Product details": cartItems,
        "Number of Products": cartItems.length,
        "product name": pName,
        "Total Amount": calculatePrice(),
      });
    }
  }, [cartItems, filteredDataFun, calculatePrice]);

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  useEffect(() => {
    if (!tabbyLoaded && cartItems?.length > 0) {
      const script = document.createElement("script");
      script.src = "https://checkout.tabby.ai/tabby-promo.js";
      script.async = true;
      script.onload = () => {
        new window.TabbyPromo({
          selector: "#TabbyPromo",
          currency: "AED",
          price: totalPriceWithTaxAndServiceCharge,
          installmentsCount: 4,
          lang: isArabicLanguage ? "ar" : "en",
          source: "product",
          publicKey: "YOUR_PUBLIC_API_KEY",
          merchantCode: "YOUR_MERCHANT_CODE",
        });
        setTabbyLoaded(true);
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [
    cartItems,
    tabbyLoaded,
    isArabicLanguage,
    totalPriceWithTaxAndServiceCharge,
  ]);
  useEffect(() => {
    if (!tamaraLoaded && cartItems?.length > 0) {
    // Load the Tamara widget script dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.tamara.co/widget-v2/tamara-widget.js';
    script.defer = true;
      // Set up the Tamara widget configuration
      window.tamaraWidgetConfig = {
        lang: 'en', // 'en' for English, 'ar' for Arabic
        country: 'AE', // ISO code, e.g., 'AE' for UAE or 'SA' for Saudi Arabia
        publicKey: '656d06af-8126-41e3-abff-7ff4e600f965', // Replace with your actual Tamara public key
        amount:"totalPriceWithTaxAndServiceCharge",
        style: {
          fontSize: '14px',
          badgeRatio: 1,
        },
      };

  
    
      script.onload = () => {
        // Initialize the Tamara widget with the correct price and config
        window.tamaraWidgetConfig.amount = totalPriceWithTaxAndServiceCharge;
        window.TamaraWidgetV2.refresh(); // Ensure the widget refreshes when loaded

        setTamaraLoaded(true);
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [    cartItems,
    isArabicLanguage,
    totalPriceWithTaxAndServiceCharge,tamaraLoaded]);

  console.log("Tax Amount:", tax);
  console.log("Service Charge:", serviceCharge);
  console.log(
    "Total Price with Tax and Service Charge:",
    totalPriceWithTaxAndServiceCharge.toFixed(2)
  ); // Format as 2 decimal places if needed
  console.log("total With Warranty :", totalWithWarranty);

  return (
    <div className="container mt-4 cartPage">
      {cartItems && cartItems.length > 0 ? (
        <>
          <img src={logo} className="topLogoPagediv" alt="logo" />
          <h1 className="pageHeading">{textString.cartTxt}</h1>
          <div className="row mt-2 mb-4">
            {cartItems.map((dat, index) => {
              const data = filteredDataFun(dat.id, dat.referance);
              console.log("Engine Oil Petrol Datassss:", engineOilPetrolData);

              return (
                <div key={index} className="col-12 col-md-6 mb-4">
                  <div className="cartCardContainer d-flex align-items-center justify-content-center flex-column flex-md-row">
                    <img
                      src={
                        dat.referance === "Filters" || dat.referance === "Oils"
                          ? oilImage
                          : dat.referance === "btteries"
                          ? batteryImage
                          : dat.referance === "Tyres"
                          ? tyreImage
                          : logo
                      }
                      alt="product"
                    />
                    <div className="otherInfoContainer">
                      <p>
                        {!isArabicLanguage
                          ? data?.productNameEng
                          : data?.productNameArab}
                      </p>
                      <div className="lowerSideContainer">
                        <p>
                          {data?.discountPrice ? (
                            <>
                              {data?.originalPrice}*{dat?.quantity} ={" "}
                              <span
                                style={{
                                  textDecoration: "line-through",
                                  color: "blue",
                                }}
                              >
                                {data?.originalPrice * dat?.quantity}
                              </span>{" "}
                              <span
                                style={{
                                  color: "red",
                                  fontWeight: "bold",
                                }}
                              >
                                {data.discountPrice * dat?.quantity}{" "}
                                {textString.currencyTxt}
                              </span>
                            </>
                          ) : (
                            <>
                              {data?.originalPrice}*{dat?.quantity} ={" "}
                              {data?.originalPrice * dat?.quantity}{" "}
                              {textString.currencyTxt}
                            </>
                          )}
                        </p>

                        <button onClick={() => removeToCartsItem(index)}>
                          <FiTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
</>
      ) : (
        <>
          <h1 className="pageHeading">{textString.cartTxt}</h1>
          <div className="emptyCart">
            <img src={CartPageImage} className="cartImage" alt="Empty Cart" />
            <p>{textString.emptyCrtTxt}</p>
            <button onClick={() => navigate("/")} className="lastBtn">
              {textString.shopNowTxt}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;