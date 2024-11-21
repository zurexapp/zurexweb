import React, { useEffect, useState, useCallback } from "react";
import logo from "../assets/logo.png";
// import { textString } from "../assets/TextStrings";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import closeIcon from "../assets/ShieldFail.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import {
  setCheckOutData,
  setCurentOrderProductData,
  setOrderProcessName,
} from "../store/orderProcessSlice";
import { getTextString } from "../assets/TextStrings";
import { getBookedTimeSlotsByDate } from "../DataBase/databaseFunction"; // Import the function
// import { format } from 'date-fns';
import { format, parse, isAfter } from "date-fns";

// import { postData } from "../DataBase/databaseFunction";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// Time slot arrays
const timeArrayBatteries = [
  { id: 0, time: "10:30 AM - 11:30 AM", max_bookings: 1 },
  { id: 1, time: "11:30 AM - 12:30 PM", max_bookings: 1 },
  { id: 2, time: "12:30 PM - 01:30 PM", max_bookings: 1 },
  { id: 3, time: "01:30 PM - 02:30 PM", max_bookings: 1 },
  { id: 4, time: "02:30 PM - 03:30 PM", max_bookings: 1 },
  { id: 5, time: "03:30 PM - 04:30 PM", max_bookings: 1 },
  { id: 6, time: "04:30 PM - 05:30 PM", max_bookings: 1 },
  { id: 7, time: "05:30 PM - 06:30 PM", max_bookings: 1 },
  { id: 8, time: "06:30 PM - 07:30 PM", max_bookings: 1 },
  { id: 9, time: "07:30 PM - 08:30 PM", max_bookings: 1 },
  { id: 10, time: "08:30 PM - 09:30 PM", max_bookings: 1 },
  { id: 11, time: "09:30 PM - 10:30 PM", max_bookings: 1 },
];

const timeArrayTyres = [
  { id: 0, time: "10:00 AM - 12:00 PM", max_bookings: 1 },
  { id: 1, time: "12:00 PM - 02:00 PM", max_bookings: 1 },
  { id: 2, time: "02:00 PM - 04:00 PM", max_bookings: 1 },
  { id: 3, time: "04:00 PM - 06:00 PM", max_bookings: 1 },
  { id: 4, time: "06:00 PM - 08:00 PM", max_bookings: 1 },
];

const timeArrayOils = [
  { id: 0, time: "10:00 AM - 12:00 PM", max_bookings: 1 },
  { id: 1, time: "12:00 PM - 02:00 PM", max_bookings: 1 },
  { id: 2, time: "02:00 PM - 04:00 PM", max_bookings: 1 },
  { id: 3, time: "04:00 PM - 06:00 PM", max_bookings: 1 },
  { id: 4, time: "06:00 PM - 08:00 PM", max_bookings: 1 },
];

function AddressPage() {
  const dispatch = useDispatch();
  const [dateTimeModal, setdateTimeModal] = useState(false);
  // const [timeSelectedValue, settimeSelectedValue] = useState("");
  const [timeSelectedValue, setTimeSelectedValue] = useState("");
  const { orderProcessName, curentOrderProductData, checkOutData } =
    useSelector((state) => state.orderProcess);
  const {
    filtersData,
    oilsData,
    tireData,
    batteryData,
    engineOilsData,
    engineOilPetrolData,
  } = useSelector((state) => state.project);
  // const { orderProcessName, curentOrderProductData, checkOutData } =
  //   useSelector((state) => state.orderProcess);
  const [productData, setproductData] = useState([]);
  // const [dateValue, setdateValue] = useState(new Date());
  const [dateValue, setdateValue] = useState(null);

  const [isSelectedValue, setisSelectedValue] = useState(true);
  const { isAuth } = useSelector((state) => state.auth);
  const [cityName, setcityName] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]); // State to hold booked slots

  const [locationCoordinates, setlocationCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });
  const navigate = useNavigate();
  const { isArabicLanguage } = useSelector((state) => state.auth);
  const textString = getTextString(isArabicLanguage);

  // const [isSelectedValue, setIsSelectedValue] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [orderTotalPrice, setOrderTotalPrice] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [subscription, setSubscription] = useState(0);

  useEffect(() => {
    if (
      curentOrderProductData?.length <= 0 ||
      checkOutData?.products?.length <= 0
    ) {
      navigate("/cart");
    }
  }, [curentOrderProductData, navigate, checkOutData]);

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

  // Function to update the date based on order process type
  useEffect(() => {
    if (orderProcessName) {
      let today = new Date();
      let tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      if (orderProcessName === "battery") {
        setdateValue(today); // Set today's date for Batteries
      } else if (orderProcessName === "tyre" || orderProcessName === "oil") {
        setdateValue(tomorrow); // Set tomorrow's date for Tyres and Oils
      }
    }
  }, [orderProcessName]);

  const isPastTimeSlot = (timeSlot) => {
    const now = new Date(); // Get the current date and time
    const selectedDate = new Date(dateValue); // Use the selected date

    // Parse the start time from the time slot (format: "10:30 AM - 11:30 AM")
    const [startTime] = timeSlot.split(" - ");

    // Convert the start time (e.g., "10:30 AM") to a Date object
    const startTimeDate = parse(startTime, "hh:mm a", selectedDate);

    // Log the current time and start time for debugging
    // console.log('Current Time:', format(now, 'hh:mm a'));
    // console.log('Slot Start Time:', format(startTimeDate, 'hh:mm a'));

    // Compare if the time slot's start time is before the current time
    return isAfter(now, startTimeDate);
  };

  // Determine the appropriate time slots based on the orderProcessName
  const timeSlots =
    orderProcessName === "battery"
      ? timeArrayBatteries
      : orderProcessName === "tyre"
      ? timeArrayTyres
      : timeArrayOils;

  // Debug logging to verify the correct time slots are being used
  useEffect(() => {
    console.log("orderProcessName:", orderProcessName);
    console.log("orderProcessName:", orderProcessName);
    console.log("timeSlots:", timeSlots);
  }, [orderProcessName, timeSlots]);

  useEffect(() => {
    if (dateValue && orderProcessName) {
      console.log("dateValue....", dateValue);
      console.log("orderProcessName... ", orderProcessName);
      console.log("Selected time slots:", timeSlots);

      // Format the date to 'EEE MMM dd yyyy' (e.g., Thu Sep 12 2024)
      const formattedDate = format(dateValue, "EEE MMM dd yyyy");
      console.log("Formatted Date:", formattedDate);

      const fetchBookedSlots = async () => {
        try {
          const bookedSlots = await getBookedTimeSlotsByDate(
            formattedDate,
            orderProcessName
          );
          console.log("Booked Slots Response:", bookedSlots); // Check the structure of the response
          setBookedTimeSlots(bookedSlots);
        } catch (error) {
          console.error("Error fetching booked time slots:", error);
        }
      };

      console.log("Date Value:", formattedDate);
      console.log("Order Process Name:", orderProcessName);
      fetchBookedSlots();
    }
  }, [dateValue, orderProcessName, timeSlots]);

  const filteredDataFun = (id, referance) => {
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
  };
  const findTaxFn = (total) => {
    return Math.round((15 / 100) * total);
  };
  function calculatePrice(data) {
    let price = 0;
    data?.map((dat, index) => {
      const data = filteredDataFun(dat.id, dat.referance);
      const newPriceData =
        parseFloat(data?.originalPrice) * parseInt(dat?.quantity);
      price = price + newPriceData;
      return null;
    });
    return price;
  }
  console.log(calculatePrice);
  const [addressInputNew, setaddressInputNew] = useState("");
  // const [dateTimeModal, setDateTimeModal] = useState(false);

  // Time slot arrays

  const handleChange = (address) => {
    setaddressInputNew(address);
  };

  const handleSelect = (address) => {
    setaddressInputNew(address);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        setlocationCoordinates({ latitude: latLng.lat, longitude: latLng.lng });
      })
      .catch((error) => console.error("Error", error));
  };
  const saveFormData = async (e) => {
    e.preventDefault();

    // Log the form data before any further processing
    console.log("Form Data before processing:", {
      productData,
      orderProcessName,
      dateValue,
      timeSelectedValue,
      isSelectedValue,
      cityName,
      locationCoordinates,
      addressInputNew,
      zipcode,
      orderTotalPrice,
      subtotal,
      discount,
      tax,
      subscription,
    });

    if (
      productData?.length > 0 ||
      Object.keys(curentOrderProductData).length > 0
    ) {
      if (dateValue !== null && timeSelectedValue !== "" && isSelectedValue) {
        if (orderProcessName === "support") {
          if (Object.keys(curentOrderProductData).length > 0) {
            const subtotal = curentOrderProductData.reduce(
              (acc, item) => acc + item.price,
              0
            );
            const discount = curentOrderProductData.reduce(
              (acc, item) => acc + item.discount || 0,
              0
            );
            const tax = findTaxFn(subtotal - discount); // Calculate tax after applying discount
            const subscription = 100; // Example value, replace with actual subscription logic if applicable
            const finalTotalPrice = subtotal - discount + tax + subscription;

            const dataToPost = {
              products: curentOrderProductData,
              OrderedByUserId: isAuth.userId,
              appointment: {
                date: new Date(dateValue).toDateString(),
                // date: dateValue.toDateString(),  // Save the selected date

                time: timeSelectedValue,
              },
              deliveryInfo: {
                cityName: cityName,
                locationCoordinates: locationCoordinates,
                locationName: addressInputNew,
                zipcode: zipcode,
              },
              orderPrice: subtotal,
              taxPrice: tax,
              discountPrice: discount,
              subscriptionPrice: subscription,
              totalPrice: finalTotalPrice,
              orderStatus: "pending",
              productType: "web",
              createdAt: Date.now(),
              updatedAt: Date.now(),
              selectedCar: {
                carName: "BMW",
                category: "Seventh Category",
                imglink:
                  "https://firebasestorage.googleapis.com/v0/b/aczurex-d4b61.appspot.com/o/pngwing.com.png?alt=media&token=3236869c-480f-4c7c-82c2-babb54f715a2",
                numberPlate: "7.8339 - 90",
              },
              orderProcessName: orderProcessName, // Include orderProcessName here
            };

            dispatch(setCheckOutData({ checkOutData: { ...dataToPost } }));
            navigate("/pay");
          } else {
            toast.error("Unexpected error occured");
          }
        } else {
          // const price = calculatePrice(productData);
          // const subtotal = price;
          // const discount = 0; // You can add logic for discount if needed
          // const tax = findTaxFn(price);
          // const subscription = 100; // Example subscription value
          // const finalTotalPrice = subtotal - discount + tax + subscription;

          const dataToPost = {
            paymentMethodName: "",
            products: productData,
            OrderedByUserId: isAuth.userId,
            appointment: {
              date: new Date(dateValue).toDateString(),
              time: timeSelectedValue,
            },
            deliveryInfo: {
              cityName: cityName,
              locationCoordinates: locationCoordinates,
              locationName: addressInputNew,
              zipcode: zipcode,
            },
            subTotal: subtotal, // Subtotal before tax and discount
            discountPrice: discount, // Total discount
            taxPrice: tax, // Calculated tax
            subscriptionPrice: subscription, // Subscription amount
            totalPrice: orderTotalPrice, // Final total including everything
            orderStatus: "pending",
            productType: "web",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            selectedCar: {
              carName: "BMW",
              category: "Seventh Category",
              imglink:
                "https://firebasestorage.googleapis.com/v0/b/aczurex-d4b61.appspot.com/o/pngwing.com.png?alt=media&token=3236869c-480f-4c7c-82c2-babb54f715a2",
              numberPlate: "7.8339 - 90",
            },
            orderProcessName: orderProcessName, // Include orderProcessName here
          };

          dispatch(setCheckOutData({ checkOutData: { ...dataToPost } }));
          navigate("/pay");
        }
      } else {
        toast.error("Please select the appointment date and time slot");
      }
    } else {
      toast.error("Cart is empty");
    }
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      const newResult = await window.localStorage.getItem(
        "ac-zurex-client-order-products"
      );
      if (newResult) {
        const result = JSON.parse(newResult);
        if (result?.processName === "support") {
          dispatch(
            setCurentOrderProductData({
              curentOrderProductData: result?.products,
            })
          );
          dispatch(
            setOrderProcessName({ orderProcessName: result?.processName })
          );
        } else {
          setproductData(result?.products);
          // dispatch(setCartItems({ car: result?.processName }));
        }
      }
    };
    fetchOrderData();
  }, [dispatch]);

  // Validate date and time selection
  // const validateDateAndTime = useCallback((date, time) => {
  //   const now = new Date();
  //   const selectedDate = new Date(date);
  //   const selectedTime = new Date(`${date} ${time}`);

  //   if (selectedDate < now) {
  //     setValidationError("Selected date is in the past.");
  //     return false;
  //   }

  //   if (selectedDate.getTime() === now.getTime() && selectedTime < now) {
  //     setValidationError("Selected time is in the past.");
  //     return false;
  //   }

  //   setValidationError("");
  //   return true;
  // }, []);

  const validateDateAndTime = useCallback((date, time) => {
    const now = new Date();
    // Remove the time component from the current date (now)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Create a new Date object from the selected date (without time)
    const selectedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    // Combine selected date and time for validation
    const selectedTime = new Date(`${date.toDateString()} ${time}`);

    // Check if the selected date is in the past (without comparing time)
    if (selectedDate < today) {
      setValidationError("Selected date is in the past.");
      return false;
    }

    // Check if the selected time is in the past for today's date
    if (selectedDate.getTime() === today.getTime() && selectedTime < now) {
      setValidationError("Selected time is in the past.");
      return false;
    }

    setValidationError("");
    return true;
  }, []);

  // Handle time slot selection
  const handleTimeSelection = (time) => {
    if (validateDateAndTime(dateValue, time)) {
      setTimeSelectedValue(time);
      setisSelectedValue(true); // Update flag when time is selected
    }
  };

  // Check if the time slot is booked
  const isTimeSlotBooked = (time) => {
    console.log("Checking time:", time);
    console.log("Booked time slots:", bookedTimeSlots);
    return bookedTimeSlots.includes(time);
  };

  return (
    <div className="container paymentPage addressPage loginPage my-4">
      <img src={logo} className="topLogoPagediv" alt="logo" />
      <form onSubmit={saveFormData} className="legendContainer py-4">
        <div className="loginInputDivNew mb-4"
        style={{
          direction: isArabicLanguage ? "rtl" : "ltr",
          textAlign: isArabicLanguage ? "right" : "left",
        }}
        >
          <PlacesAutocomplete
            value={addressInputNew}
            onChange={handleChange}
            onSelect={handleSelect}
            searchOptions={{
              componentRestrictions: { country: ["sa"] },
            }}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <input
                  {...getInputProps({
                    placeholder: textString.yourAddress,
                    className: "location-search-input",
                  })}
                />
                <div className="autocomplete-dropdown-container">
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion) => {
                    const className = suggestion.active
                      ? "suggestion-item--active"
                      : "suggestion-item";
                    // inline style for demonstration purpose
                    /* const style = suggestion.active
                      ? { backgroundColor: "#fafafa", cursor: "pointer" }
                      : { backgroundColor: "#ffffff", cursor: "pointer" }; */

                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          //style,
                        })}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </div>
        <p className="legendTitle">{textString.chooseShippingWay}</p>
        <div
          className="loginInputDiv mb-4"
          style={{
            direction: isArabicLanguage ? "rtl" : "ltr",
            textAlign: isArabicLanguage ? "right" : "left",
          }}
        >
          <input
            value={cityName}
            onChange={(e) => setcityName(e.target.value)}
            required
            minLength={10}
            placeholder={textString.strretTownAddress}
          />
          <div className="sideContainer"></div>
        </div>
        <div
        className="loginInputDiv mb-4"
        style={{
          direction: isArabicLanguage ? "rtl" : "ltr",
          textAlign: isArabicLanguage ? "right" : "left",
        }}
      >
          <input
            type="number"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            required
            placeholder={textString.zipcode}
          />
          <div className="sideContainer"></div>
        </div>{" "}
        <div
          className="loginInputDiv mb-4"
          onClick={() => setdateTimeModal(!dateTimeModal)}
          style={{
            direction: isArabicLanguage ? "rtl" : "ltr",
            textAlign: isArabicLanguage ? "right" : "left",
          }}
        >
          <span style={{ color: isSelectedValue ? "black" : "#8e8e8e" }}>
            {isSelectedValue
              ? new Date(dateValue).toDateString()
              : "Select Delivery Date"}
          </span>
          <div className="sideContainer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 448 512"
              fill="#8e8e8e"
            >
              <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v64H48V296zm128 0h96v64H176V296zm144 0h80v64H320V296zm80-48H320V192h80v56zm0 160v40c0 8.8-7.2 16-16 16H320V408h80zm-128 0v56H176V408h96zm-144 0v56H64c-8.8 0-16-7.2-16-16V408h80zM272 248H176V192h96v56z" />
            </svg>
          </div>
        </div>
        <div
          className="loginInputDiv mb-4 py-4 px-2"
          style={{ minHeight: "170px", height: "auto", overflowY: "auto" }}
        >
          <div
            className="d-flex flex-row align-items-start justify-content-start row pt-2"
            style={{ height: "100%", width: "100%", overflowY: "auto" }}
          >
            {/*{timeSlots?.map((dat, index) => (
              <div
                key={index}
                onClick={() => handleTimeSelection(dat.time)}
                className={`col timeContainer ${
                  timeSelectedValue === dat.time ? "borderView" : ""
                } ${isTimeSlotBooked(dat.time) ? "booked" : ""}`} // Add class for booked slots
                style={{
                  pointerEvents: isTimeSlotBooked(dat.time) ? "none" : "auto", // Disable if booked
                  color: isTimeSlotBooked(dat.time) ? "#ccc" : "inherit", // Grey out booked slots
                }}
              >
                {dat.time}
              </div>
            ))}*/}
            {timeSlots?.map((dat, index) => (
              <div
                key={index}
                onClick={() => handleTimeSelection(dat.time)}
                className={`col timeContainer ${
                  timeSelectedValue === dat.time ? "borderView" : ""
                }`}
                style={{
                  pointerEvents:
                    isTimeSlotBooked(dat.time) || isPastTimeSlot(dat.time)
                      ? "none"
                      : "auto", // Disable if booked or past
                  color:
                    isTimeSlotBooked(dat.time) || isPastTimeSlot(dat.time)
                      ? "red"
                      : "green", // Red for booked or past, Green for available
                  border:
                    timeSelectedValue === dat.time
                      ? "2px solid blue"
                      : "1px solid #ddd", // Border for selected slot
                  padding: "10px", // Optional: Add padding for better appearance
                  cursor:
                    isTimeSlotBooked(dat.time) || isPastTimeSlot(dat.time)
                      ? "not-allowed"
                      : "pointer", // Show appropriate cursor
                  backgroundColor:
                    isTimeSlotBooked(dat.time) || isPastTimeSlot(dat.time)
                      ? "#f8d7da"
                      : "inherit", // Optional: Background color for past slots
                }}
              >
                {dat.time}
              </div>
            ))}
          </div>
        </div>
        {validationError && <p style={{ color: "red" }}>{validationError}</p>}
        <div className="d-flex align-items-center justify-content-center w-100">
          <button onClick={() => navigate(-1)}>{textString.backBtnTxt}</button>
          <button type="submit">{textString.nextbtnTxt}</button>
        </div>
      </form>
      <Modal
        show={dateTimeModal}
        onHide={() => setdateTimeModal(!dateTimeModal)}
      >
        <Modal.Header>
          <button
            onClick={() => setdateTimeModal(!dateTimeModal)}
            className="custbutton"
          >
            <img src={closeIcon} alt="close" />
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="modalBtnContainers">
            <img src={logo} className="topLogoPagediv" alt="logo" />
            <p
              style={{
                fontSize: "1.813rem",
                lineHeight: "2.5rem",
                fontWeight: "bold",
                textAlign: "center",
                color: "#003978",
              }}
              className="paraModalWlal mb-4"
            >
              {textString.selectDeliveryDate}
            </p>
            <div className="w-100 d-flex align-items-center justify-content-center">
              <DatePicker
                selected={dateValue}
                onChange={(date) => {
                  setdateValue(date);
                  setdateTimeModal(!dateTimeModal);
                  setisSelectedValue(true);
                }}
                inline
                minDate={
                  orderProcessName === "battery" ||
                  orderProcessName === "tyre" ||
                  orderProcessName === "oil"
                    ? new Date()
                    : null
                } // Set minDate to today for Tyres and Oils, null for others
                excludeDates={
                  orderProcessName === "tyre" || orderProcessName === "oil"
                    ? [new Date()]
                    : []
                } // Exclude today's date for Tyres and Oils
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddressPage;
