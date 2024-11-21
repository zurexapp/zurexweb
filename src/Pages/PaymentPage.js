import React, { useCallback, useEffect, useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import logo from "../assets/logo.png";
// import { textString } from "../assets/TextStrings";
import payment2 from "../assets/tabysect.png";
import payment3 from "../assets/tamarasect.png";
import payment5 from "../assets/newthr.png";
import payment6 from "../assets/card.jpg";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";

import { fetchUserProfile } from "../store/authSlice";
import {
  // alrajhi_create_session,
  alrajhi_payment_page,
  alrahhi_transportal_id,
  alrahhi_transportal_pwd,
  alrahhi_terminal_resource_key,
  getCreatedDate,
  aesEncrypt,
  alrahhi_local_create_session,
  alrajhi_webhook,
  tabby_authToken,
  tabby_checkout,
  tabby_payment_details,
  // tabby_payment_capture,
} from "../utils/CommonUtils"; // Import your utils
import {
  setCheckOutData,
  // setCurentOrderProductData,
  setOrderProcessName,
} from "../store/orderProcessSlice";

// import CryptoJS from 'react-native-crypto-js';

import {
  postDataWithRef,
  getChildNodeCount,
  getEmployDataWithJobrole,
  getPaymentStatusByOrderId,
  getMYOrders,
  logAnalyticsEvent,
} from "../DataBase/databaseFunction";
// import CryptoJS from "crypto-js";
import { getTextString } from "../assets/TextStrings";
import AsyncStorage from "@react-native-async-storage/async-storage";

const textcolor = "#5E5E5E";
const maincolor = "#15488A";

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ctx = useRef({}).current;

  const [validate_payment, setValidatePayment] = useState();
  const [totalAmount, setTotalAmount] = useState(0); // Default to 0 or some initial value

  const [selectInput, setselectInput] = useState(0);
  const {
    filtersData,
    oilsData,
    tireData,
    batteryData,
    engineOilsData,
    engineOilPetrolData,
  } = useSelector((state) => state.project);
  const { orderProcessName, curentOrderProductData, checkOutData } =
    useSelector((state) => state.orderProcess);
  const { isAuth, cartItems, user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isAuth && isAuth.userId) {
      dispatch(fetchUserProfile(isAuth.userId));
    }
  }, [isAuth, dispatch]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTabbyModal, setShowTabbyModal] = useState(false);
  const [userOrders, setuserOrders] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [hasNavigatedToCancel, setHasNavigatedToCancel] = useState(false);
  const { isArabicLanguage } = useSelector((state) => state.auth);
  const textString = getTextString(isArabicLanguage);
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderTotalPrice, setOrderTotalPrice] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [subscription, setSubscription] = useState(0);
  const [tabbyPaymentAvailable, setTabbyPaymentAvailable] = useState(true); // Track if Tabby payment is available
  const [tabbyErrorMessage, setTabbyErrorMessage] = useState(""); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Ensure isAuth and userId are available before fetching orders
        if (isAuth && isAuth.userId) {
          console.log(isAuth.userId, "00000000");

          const myOrders = await getMYOrders(isAuth.userId);
          setuserOrders(myOrders);
        } else {
          console.log("User is not authenticated yet.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [isAuth]);
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

  useEffect(() => {
    const fetchOrderProcessName = async () => {
      try {
        const orderData = await window.localStorage.getItem(
          "ac-zurex-client-order-products"
        );
        console.log("Raw orderData from localStorage:", orderData);

        if (orderData) {
          const parsedOrderData = JSON.parse(orderData);
          console.log("Parsed orderData:", parsedOrderData);

          // Use correct keys from parsedOrderData
          const TotalPrice = parsedOrderData.TotalPrice || 0;
          const fetchedSubtotal = parsedOrderData.subTotal || 0; // Corrected key
          const fetchedDiscount = parsedOrderData.totalDiscountAmount || 0; // Corrected key
          const fetchedTax = parsedOrderData.tax || 0;
          const fetchedSubscription = parsedOrderData.subscriptionPrice || 0; // Corrected key

          // Log each value for debugging
          console.log("TotalPrice:", TotalPrice);
          console.log("Subtotal:", fetchedSubtotal);
          console.log("Discount:", fetchedDiscount);
          console.log("Tax:", fetchedTax);
          console.log("Subscription:", fetchedSubscription);

          // Set the states
          setOrderTotalPrice(TotalPrice);
          setSubtotal(fetchedSubtotal);
          setDiscount(fetchedDiscount);
          setTax(fetchedTax);
          setSubscription(fetchedSubscription);

          // Dispatching the order process name
          console.log("Order Process Name:", parsedOrderData.processName);
          dispatch(
            setOrderProcessName({
              orderProcessName: parsedOrderData.processName,
            })
          );
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchOrderProcessName();
  }, [dispatch]);

  console.log("Checkout Datass1 ", checkOutData);

  const calculatePrice = useCallback(() => {
    let price = 0;
    let originalPriceTotal = 0;
    // let updatedCheckOutData = []; // Array to store updated checkout data
    const subscriptionFee = 100; // Example subscription fee, replace with actual logic if needed
    const isSubscriptionApplicable = true; // Example condition, replace with actual check

    // Debugging: Log the entire cartItems array
    console.log("Cart Items:", cartItems);

    cartItems?.forEach((dat, index) => {
      // Fetch data based on item id and reference
      const data = filteredDataFun(dat.id, dat.referance);

      // Debugging: Log each iteration and fetched data
      console.log(`Iteration ${index + 1}:`, {
        id: dat.id,
        referance: dat.referance,
      });
      console.log("Fetched data:", data); // Debug log

      if (
        data &&
        (typeof data.originalPrice === "number" ||
          typeof data.discountPrice === "number")
      ) {
        // Use discountPrice if available, otherwise fallback to originalPrice
        const priceToUse =
          typeof data.discountPrice === "number" && data.discountPrice > 0
            ? data.discountPrice
            : data.originalPrice;

        const newPriceData =
          parseFloat(priceToUse) * parseInt(dat.quantity, 10);

        // Accumulate the original price total for tax calculation
        originalPriceTotal +=
          parseFloat(data.originalPrice) * parseInt(dat.quantity, 10);

        // // Add the correct price data to checkout data
        // updatedCheckOutData.push({
        //   ...dat,
        //   price: priceToUse, // Store the used price (discounted or original)
        //   total: newPriceData,
        // });

        // Debugging: Log the calculated price for this item
        console.log(
          `Calculated price for item ${index + 1} (ID: ${dat.id}):`,
          newPriceData
        );

        price += newPriceData;
      } else {
        console.warn(
          `Invalid data for ID: ${dat.id}, Referance: ${dat.referance}`,
          data
        );
      }
    });

    // Add the subscription fee if applicable
    if (isSubscriptionApplicable) {
      console.log("Subscription fee applicable, adding:", subscriptionFee);
      price += subscriptionFee;
    }

    // Calculate tax based on the original price total
    const tax = parseFloat(findTaxFn(price));

    // Add tax to the total price
    const totalPriceWithTax = price + tax;

    console.log("Total Price before tax:", price);
    console.log(
      "Original Price Total (for tax calculation):",
      originalPriceTotal
    );
    console.log("Tax:", tax);
    console.log("Total Price after tax:", totalPriceWithTax);

    // Store the updated checkout data with correct prices
    setCheckOutData({
      ...checkOutData,
      // items: updatedCheckOutData,
      orderTotalPrice: orderTotalPrice,
      subtotal: subtotal, // Ensure the total amount is stored correctly
      discount: discount,
      subscription: subscription,
    });
    console.log("Checkout Data after setting:", checkOutData);
    return isNaN(orderTotalPrice) ? 0 : orderTotalPrice;
  }, [
    cartItems,
    filteredDataFun,
    orderTotalPrice,
    subtotal,
    discount,
    subscription,
    checkOutData,
  ]);
  console.log("Checkout Datass ", checkOutData);

  useEffect(() => {
    const calculatedAmount = calculatePrice();
    // Calculate the total amount including tax
    setTotalAmount(calculatedAmount); // Update the state with the calculated amount
  }, [calculatePrice]);

  const findTitle = (referance, id) => {
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
        :referance === "engineOilPetrol"
        ? engineOilPetrolData
        : [];
    const finalData = finalizingDataType?.find((dat) => dat.id === id);
    return {
      title: finalData?.productNameEng,
      price: finalData?.originalPrice,
    };
  };

  let formattedProducts = cartItems?.map((dat) => {
    return {
      reference_id: dat?.id,
      category: "digital",
      title: findTitle(dat?.referance, dat?.id)?.title,
      description: findTitle(dat?.referance, dat?.id)?.title,
      quantity: dat?.quantity,

      unit_price: `${findTitle(dat?.referance, dat?.id)?.price || `18`}`,
    };
  });

  let formattedProducts2 = cartItems?.map((dat) => {
    return {
      reference_id: dat?.id,
      type: "digital",
      name: findTitle(dat?.referance, dat?.id)?.title,
      sku: dat?.id,
      description: findTitle(dat?.referance, dat?.id)?.title,
      quantity: dat?.quantity,
      product_url: "http://example.com",
      total_amount: {
        amount: `${findTitle(dat?.referance, dat?.id)?.price}`,
        currency: "SAR",
      },
    };
  });

  function generateRandomNumber(length) {
    let randomNumber = "";
    for (let i = 0; i < length; i++) {
      randomNumber += Math.floor(Math.random() * 10);
    }
    return randomNumber;
  }

  function getMyData() {
    let orderId = generateRandomNumber(6) + getCreatedDate();
    ctx.orderId = orderId;

    // const orderTotalPrice = orderTotalPrice; // Calculate the total amount including tax
    console.log(`111111111111111`, totalAmount);
    const myData = [
      {
        id: alrahhi_transportal_id,
        password: alrahhi_transportal_pwd,
        action: "1",
        udf1: orderId,
        currencyCode: "682",
        trackId: generateRandomNumber(9),
        amt: orderTotalPrice, // Ensure the amount is a string with two decimal places
        responseURL: alrajhi_webhook,
        errorURL: alrajhi_webhook,
      },
    ];

    console.log("Data being prepared for encryption:", myData);
    return myData;
  }

  const createTheAlrajhiSession = async () => {
    try {
      setIsLoading(true);

      // Prepare data
      const data = getMyData();
      if (!data || data.length === 0) {
        throw new Error("No data returned from getMyData");
      }

      // Encrypt data
      const encryptedData = aesEncrypt(
        JSON.stringify(data),
        alrahhi_terminal_resource_key
      );
      console.log("Encrypted Data:", encryptedData);

      // Send request
      const response = await fetch(alrahhi_local_create_session, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            id: alrahhi_transportal_id,
            trandata: encryptedData,
            responseURL: alrajhi_webhook,
            errorURL: alrajhi_webhook,
          },
        ]),
      });

      // Handle response
      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status} ${response.statusText}`
        );
      }

      const dataResponse = await response.json();
      console.log("Response received:", dataResponse);

      if (dataResponse && dataResponse.result) {
        const fetchResult = dataResponse.result;
        const paymentId = fetchResult.split(":")[0];
        setPaymentId(paymentId);
      } else {
        console.error("Unexpected response format:", dataResponse);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error occurred:", error);
      alert("Error Occurred");
      setIsLoading(false);
    }
  };

  const onVerifyPayment = (orderId) => {
    setValidatePayment(orderId);
  };
  const timeout = (delay) => new Promise((res) => setTimeout(res, delay));

  const saveOrderInDbOnline = useCallback(
    async (orderStatus, paymentStatus,paymethod, checkout_data) => {
      const chekData = checkOutData || checkout_data;
      // Console log the data for debugging
      console.log("checkOutData inside saveOrderInDbOnline:", checkOutData);
      console.log("checkout_data inside saveOrderInDbOnline:", checkout_data);
      console.log("chekData (combined):", chekData);
 const dataToPost = {
  ...chekData,
  orderStatus: orderStatus || "pending",  // Default to "pending"
  paymentMethodName: paymethod,
  paymentStatus: paymentStatus?.length > 0 ? paymentStatus : "paymentWaiting",
};

      console.log("dataToPost (combined):", dataToPost);
      const today = new Date();
      const day = today.getDate().toString().padStart(2, "0");
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const year = today.getFullYear().toString().slice(-2);
      const createdDate = `${year}${month}${day}`;

      let orderId;
      if (ctx.orderId) {
        orderId = ctx.orderId;
      } else {
        let orderCount = await getChildNodeCount("orders");
      orderCount++;
        orderId = `${orderCount.toString().padStart(6, "0")}W${createdDate}`;
      }

      const result = await postDataWithRef("orders", orderId, {
        ...dataToPost,
      });

      const notificationData = {
        title: "Order Placed",
        body: `Order with ID ${orderId} has been successfully created.`,
      };
      const employData = await getEmployDataWithJobrole("supervisor");
      const employDeviceTokens = [];
      for (const key in employData) {
        if (employData[key].deviceToken) {
          employDeviceTokens.push(...employData[key].deviceToken);
        }
      }

      await sendNotification(
        employDeviceTokens,
        notificationData.title,
        notificationData.body
      );
      const totalPriceWithTax = calculatePrice();
      const product = dataToPost.products[0];
      const { referance, id } = product;
      const referenceToDataMap = {
        btteries: batteryData,
        engineOil: engineOilsData,
        engineOilPetrol: engineOilPetrolData,
        Tyres: tireData,
      };

      const referncesToMap = {
        btteries: "Battery",
        engineOil: "EngineOilDiesel",
        engineOilPetrol: "EngineOilPetrol",
        Tyres: "Tyres",
      };
      if (referenceToDataMap[referance] && referncesToMap[referance]) {
        const dataArray = referenceToDataMap[referance];
        const dataItem = dataArray.find((dat) => dat.id === id);

        if (dataItem) {
          const itemName = dataItem.productNameEng;
          const analyticsParam = referncesToMap[referance];

          const userPhoneNumber = await AsyncStorage.getItem(
            "ac_zurex_web_client"
          );
          const eventType =
            userOrders.length > 0 ? "web_orders_placed" : "web_first_purchase";
          await logAnalyticsEvent(eventType, {
            phoneNumber: userPhoneNumber,
            category: analyticsParam,
            purchased_product: itemName,
            orderValue: totalPriceWithTax,
          });
        }
      }
      console.log("Order ID:", orderId); // Debugging log
      console.log("Result from postDataWithRef:", result); // Debugging log

      return orderId; // Ensure the orderId is returned
    },
    [
      checkOutData,
      ctx.orderId,
      batteryData,
      engineOilsData,
      engineOilPetrolData,
      tireData,
      calculatePrice,
      userOrders.length,
    ]
  );

  const lastStepFun = useCallback(
    (message, orderId, checkout_data) => {
      console.log("checkOutData inside lastStepFun:", checkOutData);
      console.log("checkout_data inside lastStepFun:", checkout_data);
      saveOrderInDbOnline(
          "pending",
          "paymentSuccess",
          message,
        checkOutData || checkout_data
      )
        .then((result) => {
          console.log("Order saved successfully:", result);
          navigate(`/paymentSuccess/${result}`);
        })
        .catch((error) => {
          console.error("Error saving order:", error);
        });
    },
    [checkOutData, navigate, saveOrderInDbOnline]
  );

  if (searchParams.size > 0) {
    checkForTabbyPayment();
  }

  // async function captureTabbyPayment(paymentId, amount) {
  //   if (!paymentId || !amount) {
  //     console.error("Missing payment ID or amount.");
  //     return null;
  //   }

  //   const payload = {
  //     amount: amount,
  //   };

  //   try {
  //     const response = await axios.post(
  //       `${tabby_payment_capture}/${paymentId}`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${tabby_authToken}`, // Use the provided Secret Key
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     console.log("Payment captured successfully:", response.data);
  //     return response.data; // Return the response data
  //   } catch (error) {
  //     console.error(
  //       "Error capturing payment:",
  //       error.response ? error.response.data : error.message
  //     );
  //     return null; // Return null on error
  //   }
  // }

  async function checkForTabbyPayment() {
    const gateway = searchParams.get("gateway");
    const result = searchParams.get("result");
    const payment_id = searchParams.get("payment_id");
    if (gateway === "tabby") {
      const check_data = await AsyncStorage.getItem("checkoutData", null);
      const checkout_data = JSON.parse(check_data);
      // Console log the data for debugging
      console.log("checkOutData inside checkForTabbyPayment:", checkOutData);
      console.log("checkout_data inside checkForTabbyPayment:", checkout_data);

      //setCheckOutData({ checkOutData: { checkout_data } });
     if (result === "success" && payment_id) {
        const resp = await axios.get(`${tabby_payment_details}/${payment_id}`, {
          headers: {
            Authorization: `Bearer ${tabby_authToken}`, // Use the provided Secret Key
            "Content-Type": "application/json",
          },
        });

        ctx.orderId = resp.data.order.reference_id;
        // await captureTabbyPayment(resp.data.id, resp.data.amount); // Await this to ensure it completes
      // console.log("Payment captured :", captureTabbyPayment(resp.data.id, resp.data.amount));

        checkout_data["tabby_payment_id"] = resp.data.id;
        checkout_data["tabby_captures"] = resp.data.captures;

        // Call lastStepFun after payment capture
        await lastStepFun("tabby", resp.data.order.reference_id, checkout_data);

      } else if (result === "failed") {
        toast.error(textString.tabbyPaymentFailed);
        searchParams.delete("gateway");
        searchParams.delete("result");
        searchParams.delete("payment_id");
        setSearchParams(searchParams);

        navigate("/paymentFailed/failed?pg=tabby");
      } else if (result === "cancel") {
        toast.error(textString.tabbyPaymentCancel);
        searchParams.delete("gateway");
        searchParams.delete("result");
        searchParams.delete("payment_id");
        setSearchParams(searchParams);
        navigate("/paymentFailed/cancel?pg=tabby");
      }
    }
  }

  useEffect(() => {
    async function getPaymentStatus(orderId) {
      try {
        const orderPaymentDetails = await getPaymentStatusByOrderId(orderId);
        console.log("orderPaymentDetails", orderPaymentDetails);

        if (orderPaymentDetails === null || orderPaymentDetails.length === 0) {
          await timeout(5000); // Wait before retrying
          getPaymentStatus(orderId);
        } else {
          setShowPaymentModal(false);
          if (orderPaymentDetails[0].error) {
            setValidatePayment(undefined);
            alert(`${orderPaymentDetails[0].errorText}`);
          } else {
            // lastStepFun("Al-rajhi Payment Successful", orderId);
            lastStepFun("Alrajhi", orderId);
            console.log("alraji success callback");
          }
        }
      } catch (error) {
        console.error("Error in getPaymentStatus:", error);
      }
    }

    if (validate_payment) {
      console.log("validate_payment", validate_payment);
      getPaymentStatus(validate_payment);
    }
  }, [validate_payment, lastStepFun]);

  const asyncPaymentValidation = async () => {
    await timeout(1000); // Adjust timeout as needed
    onVerifyPayment(ctx.orderId); // Verify payment with the order ID
  };

  const responcehandle = (event) => {
    // Check if event.target is defined and is an iframe
    if (!event.target || event.target.tagName !== "IFRAME") {
      console.error("Event target is not an iframe");
      return;
    }

    const iframe = event.target;
    const url = iframe.src || "";
    const cancelUrlPart = "/paymentcancel";

    if (url.includes(cancelUrlPart)) {
      setHasNavigatedToCancel(true);
      setShowPaymentModal(false);
      console.log("Payment canceled");
    } else if (!hasNavigatedToCancel) {
      asyncPaymentValidation();
    }
  };

  const createSessionFunNew = async () => {
    const totalAmount =
      orderProcessName === "support"
        ? curentOrderProductData[0]?.originalPrice +
          findTaxFn(curentOrderProductData[0]?.originalPrice)
        : checkOutData?.orderTotalPrice;

    if (parseInt(totalAmount) >= 100) {
      const result = await saveOrderInDbOnline(
        "",
        "Installment Companies tamara"
      );
      const payload = {
        order_reference_id: `${Date.now()}`,
        total_amount: {
          amount: orderTotalPrice,
          currency: "SAR",
        },
        locale: "en_US",
        description: "string",
        country_code: "SA",
        payment_type: "PAY_BY_INSTALMENTS",
        items:
          orderProcessName === "support"
            ? curentOrderProductData?.map((dat) => {
                return {
                  reference_id: dat?.id,
                  type: "digital",
                  name: findTitle(dat?.referance, dat?.id)?.title,
                  sku: dat?.id,
                  description: dat?.products[0]?.productNameEng,
                  quantity: 1,
                  product_url: "http://example.com",
                  total_amount: {
                    amount: `${dat.originalPrice}`,
                    currency: "SAR",
                  },
                };
              })
            : formattedProducts2,
        consumer: {
          first_name: isAuth?.name,
          last_name: isAuth?.name,
          phone_number: isAuth?.phoneNumber,
          email: isAuth?.userEmail,
        },
        shipping_address: {
          first_name: isAuth?.name,
          last_name: isAuth?.name,
          phone_number: isAuth?.phoneNumber,
          line1: checkOutData?.deliveryInfo?.locationName,
          city: checkOutData?.deliveryInfo?.cityName,
          country_code: "SA",
        },

        tax_amount: {
          amount: "0.00",
          currency: "SAR",
        },
        shipping_amount: {
          amount: "0.00",
          currency: "SAR",
        },
        merchant_url: {
          success: `${window.location.origin}/paymentSuccess/${result}`,
          failure: "https://example.com/checkout/failure",
          cancel: "https://example.com/checkout/cancel",
          notification: "https://example.com/payments/tamarapay",
        },
      };

      console.log("tamara ", payload);
      setIsLoading(true);

      try {
        const response = await axios.post(
          "https://reactjs.aloolahma.com/api/react/tamara/checkout",
          payload,
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          }
        );

        if (response.data?.checkout_url) {
          trackEvents("Order created", response.data?.checkout_url);
          window.location.replace(response.data?.checkout_url);
        } else {
          const findTitle = (data) => {
            let check = "";
            data?.map((dal) => {
              check = check + " " + dal.error_code;
              return null;
            });
            return check;
          };
          toast.error(findTitle(response.data?.errors));
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error occurred during payment process");
      }

      setIsLoading(false);
    } else {
      toast.error("Your order value should be at least 100 bucks");
    }
  };

  const retrievePaymentStatus = async (paymentId) => {
    try {
      const response = await fetch(
        `https://api.tabby.ai/v1/payments/${paymentId}`,
        {
          method: "GET",
          headers: {
            Authorization:
              "Bearer sk_test_dda111cc-e1eb-4444-a7a6-47e2fde2ed38", // Use the provided Secret Key
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to retrieve payment status: ${errorText}`);
      }

      const data = await response.json();
      console.log("Payment status:", data);
      return data;
    } catch (error) {
      console.error("Error retrieving payment status:", error);
      return null;
    }
  };

const scheduleRetrieveRequests = (paymentId) => {
  if (!paymentId) {
    console.error("Payment ID is missing. Cannot schedule retrieval.");
    return;
  }
  
  console.log("Scheduling retrieval for payment ID:", paymentId);

  // First retrieve request after 32 minutes
  setTimeout(async () => {
    try {
      const status1 = await retrievePaymentStatus(paymentId);
      console.log("First retrieve response:", status1);
    } catch (error) {
      console.error("Error in first payment retrieval:", error);
    }
  }, 32 * 60 * 1000);

  // Second retrieve request after 64 minutes
  setTimeout(async () => {
    try {
      const status2 = await retrievePaymentStatus(paymentId);
      console.log("Second retrieve response:", status2);
    } catch (error) {
      console.error("Error in second payment retrieval:", error);
    }
  }, 64 * 60 * 1000);
};


  console.log("fjiwejf", scheduleRetrieveRequests);

  const capturePayment = async (paymentId, amount) => {
    if (!paymentId || !amount) {
      console.error("Missing payment ID or amount.");
      return null;
    }

    // Log the amount
    console.log("Attempting to capture payment with ID:", paymentId);
    console.log("Amount to capture:", amount);

    try {
      const response = await fetch(
        `https://api.tabby.ai/v1/payments/${paymentId}/capture`,
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer sk_test_dda111cc-e1eb-4444-a7a6-47e2fde2ed38",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to capture payment: ${errorText}`);
      }

      const data = await response.json();
      console.log("Payment captured successfully:", data);
      return data;
    } catch (error) {
      console.error("Error capturing payment:", error);
      return null;
    }
  };

  console.log("capturePayment..", capturePayment);

  const getOrderHistoryForTabby = useCallback(async () => {
    // Ensure isAuth and userId are available before making the request
    if (isAuth && isAuth.userId) {
      const myOrders = await getMYOrders(isAuth.userId);
      ctx.tabby_orders = [];

      if (myOrders) {
        myOrders.forEach((order) => {
          const date = new Date(order.createdAt);
          let tabbyOrder = {
            purchased_at: date.toISOString().slice(0, 19) + "Z",
            amount: order.orderTotalPrice,
            status: getTabbyOrderStatus(order.paymentStatus),
            buyer: {
              email: user?.userEmail,
              phone: user?.phoneNumber,
              name: user?.name,
            },
            shipping_address: {
              city: checkOutData?.deliveryInfo?.cityName,
              address: checkOutData?.deliveryInfo?.locationName,
              zip: checkOutData?.deliveryInfo?.zipcode,
            },
          };
          ctx.tabby_orders.push(tabbyOrder);
        });
      }
    } else {
      console.error("User is not authenticated. Cannot fetch orders.");
    }
  }, [isAuth, checkOutData, user, ctx]);

  function getTabbyOrderStatus(status) {
    if (status === "pending") return "new";
    else if (status === "canceled") return "canceled";
    else if (status === "paymentSuccess") return "processing";
    else if (status === "completed") return "complete";
    else return "unknown";
  }

  const createSessionFun = async () => {
    try {
      const data = getMyData();
      // console.log("getMyData == "+JSON.stringify(data))
      console.log(checkOutData?.deliveryInfo?.cityName);
      // const totalAmount =
      //   orderProcessName === "support"
      //     ? curentOrderProductData[0]?.originalPrice +
      //       findTaxFn(curentOrderProductData[0]?.originalPrice)
      //     : data[0].amt;

      AsyncStorage.setItem("checkoutData", JSON.stringify(checkOutData));
      const tabbyPaymentPayload = {
        merchant_code: "ايه سي زيوركسsau",
        merchant_urls: {
          success: `${window.location.origin}/pay?result=success&gateway=tabby`,
          cancel: `${window.location.origin}/pay?result=cancel&gateway=tabby`,
          failure: `${window.location.origin}/pay?result=failed&gateway=tabby`,
          webhook: "https://app-xaop4bxqda-uc.a.run.app/tabbyWebhook",
        },
        lang: "en",
        payment: {
          amount: `${orderTotalPrice}`,
          currency: "SAR",
          buyer: {
            email: user?.userEmail,
            phone: user?.phoneNumber,
            name: user?.name,
          },
          shipping_address: {
            city: checkOutData?.deliveryInfo?.cityName,
            address: checkOutData?.deliveryInfo?.locationName,
            zip: checkOutData?.deliveryInfo?.zipcode,
          },
          buyer_history: {
            registered_since: "2024-07-19T16:12:34Z",
            loyalty_level: ctx?.tabby_orders?.length || 0,
          },
          order: {
            reference_id: data[0].udf1,
            items: formattedProducts,
          },
          order_history: ctx.tabby_orders || [],
        },
      };

      setIsLoading(true);

      const response = await axios.post(tabby_checkout, tabbyPaymentPayload, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: "Bearer " + tabby_authToken, // Use the provided Secret Key
          "Content-Type": "application/json",
        },
      });
   if (response.data.status === "rejected") {
        setTabbyPaymentAvailable(false);

  console.log("Response Data:", response.data);

  const rejection_reason_code = response.data.rejection_reason_code;
  console.log("Rejection Reason Code:", rejection_reason_code);

  // if (rejection_reason_code === "order_amount_too_high") {
  //   console.log("Error: Order amount too high");
  //   toast.error(textString.tabbyOrderHighError);
  // } else if (rejection_reason_code === "order_amount_too_low") {
  //   console.log("Error: Order amount too low");
  //   toast.error(textString.tabbyTooLowError);
  // } else {
  //   console.log("Error: General tabby error");
  //   toast.error(textString.tabbyGeneralError);
  // }

  
        if (rejection_reason_code === "order_amount_too_high") {
          setTabbyErrorMessage(textString.tabbyOrderHighError);
        } else if (rejection_reason_code === "order_amount_too_low") {
          setTabbyErrorMessage(textString.tabbyTooLowError);
        } else if (rejection_reason_code === "not_available") {
          setTabbyErrorMessage(
            "Tabby payment method is not available for this customer."
          );
        } else {
          setTabbyErrorMessage(textString.tabbyGeneralError);
        }

  setIsLoading(false);
  return;
}


      if (
        response.data?.configuration?.available_products?.installments[0]
          ?.web_url
      ) {
        const tabbyUrl =
          response.data.configuration.available_products.installments[0]
            .web_url;

        // Redirecting in the same tab
        window.location.href = tabbyUrl;
      } else {
        toast.error("Error occurred while initiating payment");
        console.error(
          "Error: No tabbyUrl found in response data",
          response.data
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error occurred during payment process");
    }

    setIsLoading(false);
  };

  const findTaxFn = (originalPriceTotal) =>
    ((15 / 100) * originalPriceTotal).toFixed(2);

  const sendNotification = async (registrationToken, title, body) => {
    console.log("Start sending notification...");

    // Ensure registrationToken is an array
    const tokens = Array.isArray(registrationToken)
      ? registrationToken
      : [registrationToken];

    for (const token of tokens) {
      try {
        // Send the notification data to the backend for each token
        const response = await axios.post(
          "https://app-xaop4bxqda-uc.a.run.app/sendNotification",
          {
            token, // Send as `token`, matching backend's expectations
            title,
            body,
          }
        );
        // Log or handle the response data here
        console.log(
          `Notification sent successfully to token: ${token}. Response:`,
          response.data
        );
      } catch (error) {
        console.error(
          `Error sending notification to token: ${token}`,
          error.message
        );
      }
    }
  };

  const saveOrderInDbCash = async () => {
    console.log("Checkout Data:", checkOutData);

    // Calculate the total price using the existing calculatePrice function
    // let totalPrice = calculatePrice();
    console.log("1wwwwwwwwww", orderTotalPrice);

    // Fetch data based on item id and reference to determine the discount price
    // const itemData = await Promise.all(
    //   cartItems.map((item) => filteredDataFun(item.id, item.referance))
    // );

    // let orderPrice = 0;

    // itemData?.forEach((data) => {
    //   if (
    //     data &&
    //     typeof data.discountPrice === "number" &&
    //     data.discountPrice > 0
    //   ) {
    //     orderPrice +=
    //       data.discountPrice *
    //       cartItems.find((item) => item.id === data.id).quantity;
    //   } else if (data && typeof data.originalPrice === "number") {
    //     orderPrice +=
    //       data.originalPrice *
    //       cartItems.find((item) => item.id === data.id).quantity;
    //   }
    // });

    // Calculate tax based on the original price total
    // const originalPriceTotal = cartItems.reduce((total, item) => {
    //   const data = itemData.find((d) => d.id === item.id);
    //   return (
    //     total +
    //     (data
    //       ? parseFloat(data.originalPrice) * parseInt(item.quantity, 10)
    //       : 0)
    //   );
    // }, 0);

    // const tax = parseFloat(findTaxFn(originalPriceTotal));

    // Calculate the total price including tax
    // const totalPriceWithTax = orderPrice + tax;

    // console.log("Order Price:", orderPrice);
    // console.log("Total Price before tax:", orderPrice);
    // console.log(
    //   "Original Price Total (for tax calculation):",
    //   originalPriceTotal
    // );
    // console.log("Tax:", tax);
    // console.log("Total Price after tax:", totalPriceWithTax);

    const dataToPost = {
      ...checkOutData,
      paymentMethodName: "Cash Payment",
      orderStatus: "pending",
      subTotalsss: "subtotal",
      orderPrice: orderTotalPrice,
    };
    console.log(`1234567`, dataToPost);

    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0");
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const year = today.getFullYear().toString().slice(-2);
    const createdDate = `${year}${month}${day}`;

    let orderCount = await getChildNodeCount("orders");
    orderCount++
    const orderId = `${orderCount.toString().padStart(6, "0")}W${createdDate}`;
    console.log(`1111234566`, dataToPost);

    await postDataWithRef("orders", orderId, dataToPost)
      .then(async (data) => {
        // Notification logic
        const notificationData = {
          title: "Order Placed",
          body: `Order with ID ${orderId} has been successfully created.`,
        };
        const employData = await getEmployDataWithJobrole("supervisor");
        const employDeviceTokens = [];
        for (const key in employData) {
          if (employData[key].deviceToken) {
            employDeviceTokens.push(...employData[key].deviceToken);
          }
        }

        await sendNotification(
          employDeviceTokens,
          notificationData.title,
          notificationData.body
        );
        const product = dataToPost.products[0];
        const { referance, id } = product;
        const referenceToDataMap = {
          btteries: batteryData,
          engineOil: engineOilsData,
          engineOilPetrol: engineOilPetrolData,
          Tyres: tireData,
        };

        const referncesToMap = {
          btteries: "Battery",
          engineOil: "EngineOilDiesel",
          engineOilPetrol: "EngineOilPetrol",
          Tyres: "Tyres",
        };
        if (referenceToDataMap[referance] && referncesToMap[referance]) {
          const dataArray = referenceToDataMap[referance];
          const dataItem = dataArray.find((dat) => dat.id === id);

          if (dataItem) {
            const itemName = dataItem.productNameEng;
            const analyticsParam = referncesToMap[referance];

            const userPhoneNumber = await AsyncStorage.getItem(
              "ac_zurex_web_client"
            );
            const eventType =
              userOrders.length > 0 ? "web_orders_placed" : "web_first_purchase";
            await logAnalyticsEvent(eventType, {
              phoneNumber: userPhoneNumber,
              category: analyticsParam,
              purchased_product: itemName,
              orderValue: tax,
              orderId: orderId,
            });
          }
        }

        navigate(`/paymentSuccess/${orderId}`);
      })
      .catch((e) => {
        console.error("Error creating order:", e);
      });
  };

  const nextBtnFunction = async () => {
      console.log("Selected Payment Method:", selectInput); // Check the selected method
    if (selectInput !== 0) {
      switch (selectInput) {
        case 2:
          window.webengage.track("Payment Method Chosen", {
            "payment method": "tabby",
          });
          await createSessionFun();
          break;
        case 3:
          window.webengage.track("Payment Method Chosen", {
            "payment method": "tamara",
          });
          createSessionFunNew();
          break;
        case 4:
          window.webengage.track("Payment Method Chosen", {
            "payment method": "cod",
          });
        setIsLoading(true); // Show loading

          await saveOrderInDbCash();
          trackEvents(
            "Order created",
            `${window.location.origin}/shippingInfo`
          );
          // sendWebhook("Payment Method Chosen", { "payment method": "cod" });
          break;
        case 6:
          setShowPaymentModal(true);
          createTheAlrajhiSession();
          break;
        default:
          toast.error("Payment gateway not available");
      }
      // sendWebhook("Payment Method Chosen", { "payment method": selectInput });
    } else {
      toast.error("Please choose a payment method");
    }
  };

  const trackEvents = useCallback(
    (eventName, checkoutUrl) => {
      let paymethod = "";
      if (selectInput === 2) {
        paymethod = "tabby";
      } else if (selectInput === 3) {
        paymethod = "tamara";
      } else if (selectInput === 4) {
        paymethod = "cod";
      }
      const eventData = {
        "abandoned checkout url": checkoutUrl,
        "Product details": cartItems,
        "product name":
          cartItems?.length > 0
            ? cartItems
                ?.map(
                  (dat) =>
                    filteredDataFun(dat.id, dat.referance)?.productNameEng
                )
                .join(", ")
                .toString()
            : "",
        "Number of Products": cartItems.length,
        Subtotal: calculatePrice(),
        "Cart Total": calculatePrice(),
        "payment method": paymethod,
        "total spent": calculatePrice(),
        "total price": calculatePrice(),
        "Date & Time": new Date().toISOString(),
        "billing address": "",
      };

      window.webengage.track(eventName, eventData);
      // sendWebhook(eventName, eventData);
    },
    [calculatePrice, cartItems, filteredDataFun, selectInput]
  );

  useEffect(() => {
    if (selectInput === 2) {
      console.log("Total Amount inside useEffect:", orderTotalPrice);
      // Tabby selected
      getOrderHistoryForTabby();
      const script1 = document.createElement("script");
      script1.src = "https://checkout.tabby.ai/tabby-card.js";
      script1.async = true; // Ensure the script is loaded asynchronously
      script1.onload = () => {
        const script2 = document.createElement("script");
        script2.innerHTML = `
        if (typeof TabbyCard !== 'undefined') {
          new TabbyCard({
            selector: '#tabbyCard',
            currency: 'AED',
            lang: '${isArabicLanguage ? "ar" : "en"}',
            price: ${orderTotalPrice},
            size: 'narrow',
            theme: 'black',
            header: false
          });
        } else {
          console.error('TabbyCard is not defined.');
        }
      `;
        document.body.appendChild(script2);
      };
      script1.onerror = () => {
        console.error("Failed to load TabbyCard script.");
      };
      document.body.appendChild(script1);

      const script3 = document.createElement("script");
      script3.src = "https://checkout.tabby.ai/tabby-promo.js";
      script3.async = true;
      script3.onload = () => {
        const script4 = document.createElement("script");
        script4.innerHTML = `
        new TabbyPromo({});
      `;
        document.body.appendChild(script4);
      };
      script3.onerror = () => {
        console.error("Failed to load TabbyPromo script.");
      };
      document.body.appendChild(script3);

      return () => {
        document.body.removeChild(script1);
        const existingScript1 = document.querySelector(
          'script[src="https://checkout.tabby.ai/tabby-card.js"]'
        );
        if (existingScript1) document.body.removeChild(existingScript1);

        document.body.removeChild(script3);
        const existingScript3 = document.querySelector(
          'script[src="https://checkout.tabby.ai/tabby-promo.js"]'
        );
        if (existingScript3) document.body.removeChild(existingScript3);
      };
    }
  }, [
    selectInput,
    checkOutData,
    orderTotalPrice,
    isArabicLanguage,
    getOrderHistoryForTabby,
  ]);

  useEffect(() => {
    if (calculatePrice() !== 0 && cartItems?.length > 0) {
      const productNames = cartItems
        ?.map((dat) => {
          const productData = filteredDataFun(dat.id, dat.referance);
          return productData?.productNameEng || "Unknown Product";
        })
        .join(", ")
        .toString();

      window.webengage.track("Checkout started", {
        "Product details": cartItems,
        "product name": productNames,
        "Number of Products": cartItems.length,
        Subtotal: calculatePrice(),
        "Cart Total": calculatePrice(),
      });
    }
  }, [calculatePrice, cartItems, filteredDataFun]);

  return (
    <div className="container paymentPage my-4">
      <img src={logo} className="topLogoPagediv" alt="logo" />
      <h1 className="pageHeading"
           style={{
          direction: isArabicLanguage ? "rtl" : "ltr",
          textAlign: isArabicLanguage ? "right" : "left",
        }}
      >{textString.choosePayMehodTxt}</h1>
      <div className="row my-4 justify-content-center">
        <div className="col-12 col-md-6 col-lg-3">
          <div
            onClick={() => setselectInput(6)}
            className="paymentCardImagContainer"
            style={{
              border: `1px solid ${
                selectInput === 6 ? "#003978" : "transparent"
              }`,
            }}
          >
            <img src={payment6} alt="payment6" />
            </div>
       <p style={{ fontWeight: "bold", color: "#333", marginBottom: "0",textAlign:"center" }}>{textString.payment1Txt}</p> 
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div
            onClick={() => {
              setselectInput(4);
              trackEvents("Order created", "");
            }}
            className="paymentCardImagContainer"
            style={{
              border: `1px solid ${
                selectInput === 4 ? "#003978" : "transparent"
              }`,
            }}
          >
            <img src={payment5} alt="payment3" />
          </div>
            <p style={{ fontWeight: "bold", color: "#333", marginBottom: "0",textAlign:"center" }}>{textString.payment2Txt}</p>

        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div
            onClick={() => {
              // if (true) return; // Keep it disabled
              setselectInput(2);
            }}
            className="paymentCardImagContainer"
            style={{
              border: `1px solid ${
                selectInput === 2 ? "#003978" : "transparent"
              }`,
              position: "relative",
              overflow: "hidden", // Ensure the overlay doesn't overflow
              // cursor: "not-allowed",
            }}
          >
            <img src={payment2} alt="payment2" />
          </div>
            <p style={{ fontWeight: "bold", color: "#333", marginBottom: "0", textAlign:"center"}}>{textString.payment3Txt}</p>

        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div
            onClick={() => {
              setselectInput(3);
            }}
            className="paymentCardImagContainer"
            style={{
              border: `1px solid ${
                selectInput === 3 ? "#003978" : "transparent"
              }`,
              position: "relative",
              cursor: "pointer",
            }}
          >
            <img
              src={payment3}
              alt="payment3"
              style={{
                filter: "none", // Convert image to grayscale
                opacity: 1,
              }}
            />
          
            
          </div>
            <p style={{ fontWeight: "bold", color: "#333", marginBottom: "0" ,textAlign:"center"}}>{textString.payment4Txt}</p>

        </div>
      </div>

      {selectInput === 2 && (
        <div
          style={{
            marginTop: "32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            border: "2px solid #d1d5db", // Light gray border
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
          {textString.pay4Txt}
          </div>
              {/* Display error if Tabby payment is not available */}
              {!tabbyPaymentAvailable && (
                <div
                  style={{
                    color: "red", // Text color for the error message
                    textAlign: "center",
                    marginTop: "16px",
                    fontWeight: "bold",
                  marginBottom: "16px", // Add space between card content and button
    
                  }}
                >
                  {tabbyErrorMessage}
                </div>
              )}
          <div
            id="tabbyCard"
            style={{
              width: "100%", // Adjust width as needed
              display: "flex",
              justifyContent: "center", // Center content horizontally
              marginBottom: "16px", // Add space between card content and button
            }}
          >
            {/* Content for the Tabby card goes here */}
          </div>
        </div>
      )}

      <div className="d-flex align-items-center justify-content-center">
        <button className="paynextBtn" onClick={nextBtnFunction}>
          {textString.nextbtnTxt}
        </button>
      </div>
      <div style={{ marginBottom: "4rem" }} />
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 70000,
            fontSize: "2rem",
            color: "white",
          }}
          className="w-100 h-100 d-flex align-items-center justify-content-center"
        >
         {textString.loadingBtn}
        </div>
      )}
      {showPaymentModal && (
        <Modal
          show={showPaymentModal}
          onHide={() => setShowPaymentModal(false)}
          size="xl"
        >
          {isLoading && paymentId?.length <= 0 ? (
            <Modal.Body className="text-center">
              <h4>{textString.loadingBtn} </h4>
              <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                  <span className="sr-only">{textString.loadingBtn}</span>
                </div>
              </div>
            </Modal.Body>
          ) : (
            <Modal.Body>
              <Button
                variant="secondary"
                onClick={() => setShowPaymentModal(false)}
                className="close-btn"
                style={{ color: textcolor, backgroundColor: maincolor }}
              >
                Close
              </Button>
              <div style={{ width: "100%", height: "100%" }}>
                <iframe
                  title="Payment Gateway"
                  src={`${alrajhi_payment_page}?PaymentID=${paymentId}`}
                  style={{ width: "100%", height: "100vh", border: "none" }}
                  onLoad={(e) => responcehandle(e)}
                />
              </div>
            </Modal.Body>
          )}
        </Modal>
      )}
      {showTabbyModal && (
        <Modal show={showTabbyModal} onHide={() => setShowTabbyModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{textString.tabbyPaymentTxt}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{/* Your modal content */}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowTabbyModal(false)}
            >
              {textString.closeTxt}
            </Button>
            <Button variant="primary" onClick={() => setShowTabbyModal(false)}>
              {textString.saveChangesTxt}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default PaymentPage;
