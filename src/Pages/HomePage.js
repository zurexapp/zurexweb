import React, { useEffect, useState } from "react";
import productType1 from "../assets/productType_1.png";
import productType2 from "../assets/productType_2.png";
import productType3 from "../assets/productType_3.png";
import productType4 from "../assets/productType_4.png";
import Slider from "react-slick";
import "../../node_modules/slick-carousel/slick/slick.css";
import "../../node_modules/slick-carousel/slick/slick-theme.css";
// import { textString } from "../assets/TextStrings";
import batteryImage from "../assets/battery.png";
import oilImage from "../assets/oil.png";
import tyreImage from "../assets/tyre.png";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import appStore1 from "../assets/appstore (1).png";
import appStore2 from "../assets/appstore (2).png";
import bin from "../assets/bin.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../index.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurentOrderProductData,
  setOrderProcessName,
} from "../store/orderProcessSlice";
import { setClientCarsData } from "../store/projectSlice"; // Correct import

import {
  filterProductWithCar,
  getMyCars,
  removeData,
} from "../DataBase/databaseFunction";

import AsyncStorage from "@react-native-async-storage/async-storage";

import PlayStoreLinks from "../Components/PlayStoreLinks";
import BannerCarousel from "../Components/BannerCarousel";
import { getTextString } from "../assets/TextStrings";
import FuelTypeModal from "../Components/FuelTypeModal.js"; // Import the new modal component
import { Modal, Button } from "react-bootstrap";
import { logAnalyticsEvent } from "../DataBase/databaseFunction";

function HomePage() {
  const dispatch = useDispatch();

  // const navigate = useNavigate();
  // State to check login status
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Added this state
  // Use useSelector to get the current language state from Redux
  const { isArabicLanguage } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFuelTypeModalOpen, setIsFuelTypeModalOpen] = useState(false); // Add this line

  const [selectedCar, setSelectedCar] = useState(null);

  // Get the text strings based on the current language
  const textString = getTextString(isArabicLanguage);
  const {
    filtersData,
    oilsData,
    tireData,
    batteryData,
    supportServicesData,
    clientBanners,
    clientReviews,
    engineOilsData,
    engineOilPetrolData,
    clientCarsData,
  } = useSelector((state) => state.project);
  const [slctedBtn, setslctedBtn] = useState(0);
  const [selectedFuelType, setSelectedFuelType] = useState(null); // Added state for fuel type
  // const [isFuelTypeModalOpen, setIsFuelTypeModalOpen] = useState(false); // Added state for modal visibility

  const [selctedService, setselctedService] = useState(0);
  const [show, setshow] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const [resultArray, setresultArray] = useState([]);
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  // Function to handle modal close
  const handleModalClose = () => {
    setShowModal(false);
  };
  const handleContactSupport = () => {
    window.location.href = "https://api.whatsapp.com/send/?phone=966557488008"; // Redirect to specified URL
  };

  const handleClose = () => {
    if (!show) {
      window.webengage.track("Application Download Clicked", {});
    }
    setshow(!show);
  };

  const [cars, setCars] = useState([]);
  const [userToken, setUserToken] = useState(null); // Add state for userToken

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let userId = await AsyncStorage.getItem("userid");
        console.log(userId);
        let userCars = [];
        if (userId && userId !== null) {
          console.log(userId);
          userCars = await getMyCars(userId);
          console.log(userCars);
        } else {
          const storedCars = sessionStorage.getItem("tempCarData");
          if (storedCars) {
            userCars = JSON.parse(storedCars);
          }
        }
        setCars(userCars.map((car) => ({ ...car, selected: false })));
      } catch (error) {
        console.error("Error fetching userId or cars:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const checkLoginStatus = () => {
      try {
        const token = localStorage.getItem("userid"); // Retrieve userToken from localStorage
        console.log("Retrieved Token:", token); // Debugging token retrieval
        setUserToken(token); // Save userToken in state
        setIsLoggedIn(!!token); // Set login status based on token presence
      } catch (error) {
        console.error("Error retrieving token:", error);
      }
    };
    checkLoginStatus();
  }, []);

  const handleEnterCarDataClick = async () => {
    if (!isLoggedIn) {
      navigate("/login"); // Redirect to login page if not logged in
    } else {
      navigate("/selectCar"); // Redirect to select car page if logged in
    }
  };

  const handleCarClick = (clickedCar) => {
    // Toggle the selected state of the clicked car and deselect others
    const updatedCars = cars.map((car) =>
      car.carName === clickedCar.carName
        ? { ...car, selected: !car.selected }
        : { ...car, selected: false }
    );

    setCars(updatedCars);
    setSelectedCar(clickedCar);
    // setIsModalOpen(true);

    // Update sessionStorage with the modified array
    sessionStorage.setItem("cars", JSON.stringify(updatedCars));
  };

  const removeCarById = async (carId) => {
    setisLoading(true);
    console.log("Deleting car with ID:", carId);
    await removeData("userManualCars", carId).then(async () => {
      // Added check to ensure clientCarsData is an array
      const clientCarsDataNew = Array.isArray(clientCarsData)
        ? clientCarsData.filter((dat) => dat.id !== carId)
        : [];
      dispatch(setClientCarsData({ clientCarsData: clientCarsDataNew }));
      toast.success("Car Deleted Successfully"); // Toast notification for success
    });
    setisLoading(false);
  };

  const handleDeleteCar = (carToDelete) => {
    console.log("Deleting car:", carToDelete.id);
    removeCarById(carToDelete.id);
    const filteredCars = cars.filter(
      (car) => car.carName !== carToDelete.carName
    );
    setCars(filteredCars);
    sessionStorage.setItem("cars", JSON.stringify(filteredCars));
  };

  const navigate = useNavigate();
  const trackCategory = (name) => {
    window.webengage.track("Category Clicked", {
      name: `${name}`,
      "Category name": name,
      Image: [
        "https://img.freepik.com/premium-vector/engine-oil-filters-isolated-white-background_258836-181.jpg?w=2000",
      ],
    });
  };
  var settings = {
    dots: true,
    rows: 1,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  // const isArabic = false;

  const handleFuelTypeSelect = (fuelType) => {
    const updatedCars = cars.map((car) =>
      car.carName === selectedCar.carName
        ? { ...car, fuelType, selected: true }
        : { ...car, selected: false }
    );

    setCars(updatedCars);
    sessionStorage.setItem("cars", JSON.stringify(updatedCars));
    // setIsModalOpen(false);
  };

  useEffect(() => {
    if (slctedBtn === 1) {
      setIsFuelTypeModalOpen(true); // Add this line
    } else {
      setIsFuelTypeModalOpen(false); // Add this line
    }
  }, [slctedBtn]);

  // const handleProductCategoryClick = (category) => {
  //   setSlctedBtn(category);
  // };

  useEffect(() => {
    const filteredDataFun = async () => {
      console.log("Engine Oil Petrol Data:", engineOilPetrolData); // Log the engineOilPetrolData
      console.log("Engine Oils Data:", engineOilsData); // Log the engineOilsData
      console.log("Filters Data:", filtersData); // Log the filtersData
      console.log("Oils Data:", oilsData); // Log the oilsData
      console.log("Battery Data:", batteryData); // Log the batteryData
      console.log("Tire Data:", tireData); // Log the tireData
      console.log("Selected Fuel Type:", selectedFuelType); // Log the selected fuel type
      console.log(
        "Selected Car:",
        cars.find((car) => car.selected)
      ); // Log the selected car

      let result = [];
      const selectedCar = cars.find((car) => car.selected);

      if (selectedCar) {
        try {
          if (slctedBtn === 1) {
            console.log(
              "Fetching data for engine oils, engine oil petrol, filters, and oils..."
            );

            // No filtering for engine oils and petrol engine oils
            result = [
              {
                type: "engineOilPetrol",
                data: engineOilPetrolData || [], // Directly add all engine oil petrol products
              },
              {
                type: "engineOils",
                data: engineOilsData || [], // Directly add all engine oils products
              },
            ];

            // Fetch and filter only for filters and oils based on selected car
            const filtersResult = await filterProductWithCar(
              filtersData,
              selectedCar.carName
            );
            const oilsResult = await filterProductWithCar(
              oilsData,
              selectedCar.carName
            );

            // Add filtered filters and oils data to the result array
            result.push({ type: "filters", data: filtersResult.data || [] });
            result.push({ type: "oils", data: oilsResult.data || [] });

            console.log("Combined Result Before Filtering:", result);

            // Filter result based on selected fuel type only for filters and oils
            if (selectedFuelType === "petrol") {
              result = result.filter(
                (item) =>
                  item.type === "engineOilPetrol" ||
                  item.type === "filters" ||
                  item.type === "oils"
              );
            } else if (selectedFuelType === "diesel") {
              result = result.filter(
                (item) =>
                  item.type === "engineOils" ||
                  item.type === "filters" ||
                  item.type === "oils"
              );
            }

            console.log("Filtered Result:", result);
          } else if (slctedBtn === 2) {
            console.log("Fetching battery data...");
            const batteryResult = await filterProductWithCar(
              batteryData,
              selectedCar.carName
            );
            result = batteryResult.data || [];
            console.log("Battery Result:", result);
          } else if (slctedBtn === 3) {
            console.log("Fetching tire data...");
            const tireResult = await filterProductWithCar(
              tireData,
              selectedCar.carName
            );
            result = tireResult.data || [];
            console.log("Tire Result:", result);
          }

          // Set result in state
          setresultArray(result);

          // Check data size and handle storage
          const resultString = JSON.stringify(result);
          if (resultString.length < 5000) {
            // Check if the data size is reasonable
            sessionStorage.setItem("filteredProducts", resultString);
            console.log("Data saved to sessionStorage.");
          } else {
            console.warn("Data size too large for sessionStorage");
          }

          // Console log for debugging
          console.log("Filtered data:", result);

          // Show modal if result is empty
          if (result.length === 0) {
            setShowModal(true);
            console.log("No results found. Modal shown.");
          }
        } catch (error) {
          console.error("Error processing filtered data:", error);
        }
      } else {
        console.log("No selected car found.");
      }
    };

    // Run the function when `slctedBtn` or dependencies change
    if (slctedBtn > 0 && slctedBtn < 4) {
      filteredDataFun();
    }
  }, [
    slctedBtn,
    batteryData,
    cars,
    engineOilsData,
    engineOilPetrolData,
    filtersData,
    oilsData,
    supportServicesData,
    tireData,
    selectedFuelType,
  ]);

  // useEffect(() => {
  //   const filteredDataFun = async () => {
  //     console.log("Engine Oil Petrol Datasssss:", engineOilPetrolData); // Log the data

  //     let result = [];
  //     const selectedCar = cars.find((car) => car.selected);

  //     if (selectedCar) {
  //       try {
  //         if (slctedBtn === 1) {
  //           // Fetch engine oils data
  //           const engineOilResult = await filterProductWithCar(
  //             engineOilsData,
  //             selectedCar.carName
  //           );

  //           // Fetch engine oil Petrol data
  //           const engineOilPetrolResult = await filterProductWithCar(
  //             engineOilPetrolData,
  //             selectedCar.carName
  //           );

  //           // Fetch filters data
  //           const filtersResult = await filterProductWithCar(
  //             filtersData,
  //             selectedCar.carName
  //           );

  //           // Fetch oils data
  //           const oilsResult = await filterProductWithCar(
  //             oilsData,
  //             selectedCar.carName
  //           );

  //           // Organize the result
  //           result = [
  //             { type: "engineOilPetrol", data: engineOilPetrolResult.data || [] },
  //             { type: "engineOils", data: engineOilResult.data || [] },
  //             { type: "filters", data: filtersResult.data || [] },
  //             { type: "oils", data: oilsResult.data || [] },
  //           ];

  //           // Filter result based on selected fuel type
  //           if (selectedFuelType === 'petrol') {
  //             result = result.filter(item => item.type === 'engineOilPetrol' || item.type === 'filters' || item.type === 'oils');
  //           } else if (selectedFuelType === 'diesel') {
  //             result = result.filter(item => item.type === 'engineOils' || item.type === 'filters' || item.type === 'oils');
  //           }

  //         } else if (slctedBtn === 2) {
  //           const batteryResult = await filterProductWithCar(
  //             batteryData,
  //             selectedCar.carName
  //           );
  //           result = batteryResult.data || [];
  //         } else if (slctedBtn === 3) {
  //           const tireResult = await filterProductWithCar(
  //             tireData,
  //             selectedCar.carName
  //           );
  //           result = tireResult.data || [];
  //         }

  //         // Set result in state
  //         setresultArray(result);

  //         // Check data size and handle storage
  //         const resultString = JSON.stringify(result);
  //         if (resultString.length < 5000) { // Check if the data size is reasonable
  //           sessionStorage.setItem("filteredProducts", resultString);
  //         } else {
  //           console.warn("Data size too large for sessionStorage");
  //         }

  //         // Console log for debugging
  //         console.log("Filtered data:", result);

  //         // Show modal if result is empty
  //         if (result.length === 0) {
  //           setShowModal(true);
  //         }
  //       } catch (error) {
  //         console.error("Error processing filtered data:", error);
  //       }
  //     }
  //   };

  //   // Run the function when `slctedBtn` or dependencies change
  //   if (slctedBtn > 0 && slctedBtn < 4) {
  //     filteredDataFun();
  //   }
  // }, [
  //   slctedBtn,
  //   batteryData,
  //   cars,
  //   engineOilsData,
  //   engineOilPetrolData,
  //   filtersData,
  //   oilsData,
  //   supportServicesData,
  //   tireData,
  //   selectedFuelType,
  // ]);

  // Make sure to handle any error cases or loading states as needed.

  const supportNextBtn = async () => {
    const data = supportServicesData[selctedService - 1];
    await window.localStorage.setItem(
      "ac-zurex-client-order-products",
      JSON.stringify({
        products: [data],
        processName: "support",
      })
    );

    dispatch(
      setCurentOrderProductData({
        curentOrderProductData: [data],
      })
    );
    dispatch(setOrderProcessName({ orderProcessName: "support" }));

    navigate("/pay");
  };

  // const handleProductCategoryClick = async (category) => {
  //   if (!isLoggedIn) {
  //     navigate("/login");
  //   } else {
  //     if (cars.every((car) => !car.selected)) {
  //       toast.error(textString.plsSlctCarTxt);
  //       return;
  //     }

  //     if (category === 1) {
  //       await logAnalyticsEvent("Category_Viewed", {
  //         categoryName: "oilFilter",
  //         userId: userToken,
  //         device_type: "Web"
  //       });
  //       console.log("oilFilter", userToken);
  //     }
  //     else if (category === 2) {
  //       await logAnalyticsEvent("Category_Viewed", {
  //         categoryName: "battery",
  //         userId: userToken,
  //         device_type: "Web"
  //       });
  //       console.log("battery", userToken);
  //     }
  //     else if (category === 3) {
  //       await logAnalyticsEvent("Category_Viewed", {
  //         categoryName: "tyre",
  //         userId: userToken,
  //         device_type: "Web"
  //       });
  //       console.log("tyre", userToken);
  //     }
  //     else {
  //       console.log("support order");
  //     }

  //     setslctedBtn(category);
  //     trackCategory(category);
  //   }
  // };

  // const handleCloseModal = () => {
  //   // setIsModalOpen(false);
  // };

  const handleProductCategoryClick = async (category) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      if (cars.every((car) => !car.selected)) {
        toast.error(textString.plsSlctCarTxt);
        return;
      }

      if (category === 1) {
        await logAnalyticsEvent("web_Category_Viewed", {
          categoryName: "oilFilter",
          userId: userToken,
          device_type: "Web",
        });
        console.log("oilFilter", userToken);
      } else if (category === 2) {
        await logAnalyticsEvent("web_Category_Viewed", {
          categoryName: "battery",
          userId: userToken,
          device_type: "Web",
        });
        console.log("battery", userToken);
      } else if (category === 3) {
        await logAnalyticsEvent("web_Category_Viewed", {
          categoryName: "tyre",
          userId: userToken,
          device_type: "Web",
        });
        console.log("tyre", userToken);
      } else if (category === 4) {
        setIsModalOpen(true); // show modal for category 4 (support)
        return; // prevent navigating or updating the selected button
      }

      setslctedBtn(category);
      trackCategory(category);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container hompage">
      <ToastContainer />
      {/* Buttons for entering car data and downloading the app */}
      <div
        onClick={handleEnterCarDataClick}
        className="btn w-100 homeBtnMain mt-4"
      >
        {textString.enterYourCarDataTxt}
      </div>
      <h1 className="text-center mt-5 mb-4"> {textString.yourcarTxt}</h1>
      <div className="row"
      style={{
        direction: isArabicLanguage ? "rtl" : "ltr",
        textAlign: isArabicLanguage ? "right" : "left",
      }}
      >
        {cars.length > 0 ? (
          cars.map((car, index) => (
            <div key={index} className="col-md-4 mb-4"
            style={{
              direction: isArabicLanguage ? "ltr":"rtl" ,
              textAlign: isArabicLanguage ? "left":""  ,
            }}
            >
              <div className={`card ${car.selected ? "selected" : ""}`}>
                <div className="card-body" onClick={() => handleCarClick(car)}>
                  <h5 className="card-title">{car.carName}</h5>
                  <p className="card-text">Plate: {car.numberPlate}</p>
                </div>
                <div className="delete-button-container">
                  <img
                    src={bin}
                    alt="Delete"
                    className="delete-button"
                    onClick={() => handleDeleteCar(car)}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col text-center"> {textString.nocarsaddedTxt}</p>
        )}
      </div>

      <div onClick={handleClose} className="btn w-100 homeBtnSec mt-4">
        {textString.downloadAppTxt}
      </div>
      {/* Banner Carousel */}
      <BannerCarousel clientBanners={clientBanners} />

      {/* FuelTypeModal */}
      <FuelTypeModal
        isOpen={isFuelTypeModalOpen}
        onClose={() => setIsFuelTypeModalOpen(false)}
        onSelectFuelType={(type) => {
          console.log(`Selected fuel type: ${type}`);
          setSelectedFuelType(type); // Update the selected fuel type

          setIsFuelTypeModalOpen(false);
          // Handle fuel type selection (e.g., filter products based on fuel type)
        }}
      />

      <FuelTypeModal
        // isOpen={isModalOpen}
        // onClose={handleCloseModal}
        onSelectFuelType={handleFuelTypeSelect}
      />

      {/* Heading and navigation text */}
      <p className="headingPara custom25MarginBottom"
style={{ direction: isArabicLanguage ? "rtl" : "ltr", textAlign: isArabicLanguage ? "right" : "left" }}
      
      >
        {textString.homeNavTxt}
        {" > "}
        <span className="smallNav">
          {slctedBtn === 0
            ? textString.productNavTxt
            : slctedBtn === 1
            ? textString.oilFilterTxt
            : slctedBtn === 2
            ? textString.batteryTxt
            : slctedBtn === 3
            ? textString.tireTxt
            : slctedBtn === 4
            ? textString.supportTxt
            : " "}
        </span>
      </p>
      {/* Product category buttons */}
      <div className="row">
        <div className="col-12 col-md-6 col-lg-3 mb-5">
          <div
            onClick={() => handleProductCategoryClick(1)}
            className={"productBtnSelctr"}
          >
            <img
              src={productType1}
              alt="productType1"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3 mb-5">
          <div
            onClick={() => handleProductCategoryClick(2)}
            className={"productBtnSelctr"}
          >
            <img
              alt="productType2"
              src={productType2}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3 mb-5">
          <div
            onClick={() => handleProductCategoryClick(3)}
            className={"productBtnSelctr"}
          >
            <img
              src={productType3}
              alt="productType3"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </div>
        {/*<div className="col-12 col-md-6 col-lg-3 mb-5">
          <div
            onClick={() => handleProductCategoryClick(4)}
            className={"productBtnSelctr"}
          >
            <img
              alt="productType4"
              src={productType4}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </div>*/}

        {/* Other buttons */}
        <div className="col-12 col-md-6 col-lg-3 mb-5">
          <div
            onClick={() => handleProductCategoryClick(4)}
            className="productBtnSelctr"
          >
            <img
              src={productType4}
              alt="productType4"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Modal for Coming Soon */}
        {/* Modal for Category 4 (Coming Soon) */}
        <Modal show={isModalOpen} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>{textString.comingsoonTxt}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{textString.comingsoonContentTxt}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              {textString.closebtnTxt}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      {/* Your existing render logic */}
      {isLoading && <div className="loading-spinner">Loading...</div>}

      {/* Display filtered products */}
      <div className="row">
        {slctedBtn > 0 && slctedBtn < 4 && Array.isArray(resultArray) && (
          <>
            {slctedBtn === 1 ? (
              <>
                {resultArray.map((item, index) => (
                  <div key={index} className="col-12">
                    {/* Check if item data is not empty */}
                    {Array.isArray(item.data) && item.data.length > 0 && (
                      <h2>
                        {item.type === "engineOils"
                          ? textString.engineoilDieselTxt
                          : item.type === "engineOilPetrol"
                          ? textString.engineoilPetrolTxt
                          : item.type === "filters"
                          ? textString.filterTxt
                          : textString.oilsTxt}
                      </h2>
                    )}

                    <div className="row">
                      {Array.isArray(item.data) &&
                        item.data.map((dat, idx) => (
                          <div
                            key={idx}
                            className="col-12 col-md-6 col-lg-3 mb-4"
                          >
                            <div
                              onClick={() =>
                                navigate(
                                  `/productInfo/${dat?.productNameEng
                                    ?.replace(/[^a-zA-Z ]/g, "")
                                    .replace(/ /g, "_")}_@_${dat.referance}_@_${
                                    dat.id
                                  }`
                                )
                              }
                              className="cartCardContainerNew d-flex align-items-center justify-content-center flex-column"
                            >
                              <img
                                src={
                                  dat?.images?.length > 0
                                    ? dat?.images[0]?.imgLink
                                    : item.type === "engineOils" ||
                                      item.type === "engineOilPetrol"
                                    ? oilImage
                                    : logo
                                }
                                alt="product"
                                loading="lazy"
                              />
                              <div className="otherInfoContainer">
                                <p className="fs-3">
                                  {isArabicLanguage
                                    ? dat?.productNameArab
                                    : dat?.productNameEng}
                                </p>
                                <div className="lowerSideContainer">
                                  <p className="lowerPara">
                                    {dat?.discountPrice ? (
                                      <>
                                        <span
                                          style={{
                                            textDecoration: "line-through",
                                          }}
                                        >
                                          {dat?.originalPrice}{" "}
                                        </span>{" "}
                                        <span style={{ color: "red" }}>
                                          {dat?.discountPrice}{" "}
                                          {textString.currencyTxt}
                                        </span>
                                      </>
                                    ) : (
                                      `${dat?.originalPrice} ${textString.currencyTxt}`
                                    )}
                                  </p>
                                </div>
                                <button className="addToCartBtn">
                                  <AiOutlineShoppingCart />{" "}
                                  {textString.addToCartTxt}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              resultArray.map((dat, index) => (
                <div key={index} className="col-12 col-md-6 col-lg-3 mb-4">
                  <div
                    onClick={() =>
                      navigate(
                        `/productInfo/${dat?.productNameEng
                          ?.replace(/[^a-zA-Z ]/g, "")
                          .replace(/ /g, "_")}_@_${dat.referance}_@_${dat.id}`
                      )
                    }
                    className="cartCardContainerNew d-flex align-items-center justify-content-center flex-column"
                  >
                    <img
                      src={
                        dat?.images?.length > 0
                          ? dat?.images[0]?.imgLink
                          : slctedBtn === 2
                          ? batteryImage
                          : tyreImage
                      }
                      alt="product"
                      loading="lazy"
                    />
                    <div className="otherInfoContainer">
                      <p className="fs-3">
                        {isArabicLanguage
                          ? dat?.productNameArab
                          : dat?.productNameEng}
                      </p>
                      <div className="lowerSideContainer">
                        <p className="lowerPara">
                          {dat?.discountPrice ? (
                            <>
                              <span style={{ textDecoration: "line-through" }}>
                                {dat?.originalPrice}
                              </span>{" "}
                              <span style={{ color: "red" }}>
                                {dat?.discountPrice} {textString.currencyTxt}
                              </span>
                            </>
                          ) : (
                            `${dat?.originalPrice} ${textString.currencyTxt}`
                          )}
                        </p>
                      </div>
                      <button className="addToCartBtn">
                        <AiOutlineShoppingCart /> {textString.addToCartTxt}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
        {slctedBtn === 4 && (
          <>
            <div className="SupportContainer w-100">
              <div className="row w-100">
                {supportServicesData?.map((dat, index) => {
                  const titleOnly = dat?.products?.map((dac) =>
                    isArabicLanguage ? dac.productNameArab : dac.productNameEng
                  );
                  const suportTitle = titleOnly?.join(" , ");
                  return (
                    <div key={index} className="col-12 col-md-6 col-lg-3 mb-4">
                      <div
                        onClick={() => {
                          setselctedService(index + 1);
                        }}
                        className="cartCardContainerNew1 h-auto d-flex align-items-center justify-content-center flex-column"
                        style={{
                          borderColor:
                            selctedService === index + 1
                              ? "#8c1726"
                              : "#003978",
                          minHeight: "270px",
                        }}
                      >
                        <div className="imagContainer">
                          <img
                            src={require("../assets/5138237.jpg")}
                            alt="product"
                          />
                        </div>
                        <div className="otherInfoContainer">
                          <p
                            className="fs-4"
                            style={{
                              color:
                                selctedService === index + 1
                                  ? "#8c1726"
                                  : "#000",
                              fontWeight:
                                selctedService === index + 1 ? "600" : "normal",
                            }}
                          >
                            {suportTitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {selctedService !== 0 ? (
              <div className="nextBtnDiv">
                <button onClick={supportNextBtn}>
                  {textString.nextbtnTxt}
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>

      <p
        className="headingPara custom25MarginBottom"
        style={{
          direction: isArabicLanguage ? "rtl" : "ltr",
          textAlign: isArabicLanguage ? "right" : "left",
        }}
      >
        {textString.customerReviewTxt}
      </p>
      {clientReviews?.length > 0 ? (
        <div className="w-100 mb-4">
          <Slider {...settings} infinite={clientReviews.length}>
            {clientReviews?.map((dat, index) => (
              <div key={index} className="reviewCard">
                <div className="userAvtar">
                  <img
                    src="data:image/png;base64,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"
                    alt="user"
                  />
                </div>
                <h3>{dat.userName}</h3>
                <p>{dat.review}</p>
              </div>
            ))}
          </Slider>
        </div>
      ) : null}
      <div style={{ marginBottom: "5rem" }} />
      {/* Modal for downloading the app */}
      <PlayStoreLinks
        show={show}
        handleClose={handleClose}
        logo={logo}
        textString={textString}
        appStore1={appStore1}
        appStore2={appStore2}
      />

      {/* Bootstrap Modal for no data */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>No Suitable Products Found</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Please contact customer support or go back to the previous page.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Back
          </Button>
          <Button variant="primary" onClick={handleContactSupport}>
            Contact Support
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default HomePage;

// // old code

// if (slctedBtn === 1) {
//   console.log(
//     "Fetching data for engine oils, engine oil petrol, filters, and oils..."
//   );

//   // Fetch engine oils data
//   const engineOilResult = await filterProductWithCar(
//     engineOilsData,
//     selectedCar.carName
//   );
//   console.log("Engine Oils Result:", engineOilResult.data);

//   // Fetch engine oil Petrol data
//   const engineOilPetrolResult = await filterProductWithCar(
//     engineOilPetrolData,
//     selectedCar.carName
//   );
//   console.log(
//     "Engine Oil Petrol Result:",
//     engineOilPetrolResult.data
//   );

//   // Fetch filters data
//   const filtersResult = await filterProductWithCar(
//     filtersData,
//     selectedCar.carName
//   );
//   console.log("Filters Result:", filtersResult.data);

//   // Fetch oils data
//   const oilsResult = await filterProductWithCar(
//     oilsData,
//     selectedCar.carName
//   );
//   console.log("Oils Result:", oilsResult.data);

//   // Organize the result
//   result = [
//     {
//       type: "engineOilPetrol",
//       data: engineOilPetrolResult.data || [],
//     },
//     { type: "engineOils", data: engineOilResult.data || [] },
//     { type: "filters", data: filtersResult.data || [] },
//     { type: "oils", data: oilsResult.data || [] },
//   ];

//   // Log the combined result
//   console.log("Combined Result Before Filtering:", result);

//   // Filter result based on selected fuel type
//   if (selectedFuelType === "petrol") {
//     result = result.filter(
//       (item) =>
//         item.type === "engineOilPetrol" ||
//         item.type === "filters" ||
//         item.type === "oils"
//     );
//   } else if (selectedFuelType === "diesel") {
//     result = result.filter(
//       (item) =>
//         item.type === "engineOils" ||
//         item.type === "filters" ||
//         item.type === "oils"
//     );
//   }

//   // Log the filtered result
//   console.log("Filtered Result:", result);
// }

// support coming soon

// import React, { useEffect, useState } from "react";
// import productType1 from "../assets/productType_1.png";
// import productType2 from "../assets/productType_2.png";
// import productType3 from "../assets/productType_3.png";
// import productType4 from "../assets/productType_4.png";
// import Slider from "react-slick";
// import "../../node_modules/slick-carousel/slick/slick.css";
// import "../../node_modules/slick-carousel/slick/slick-theme.css";
// // import { textString } from "../assets/TextStrings";
// import batteryImage from "../assets/battery.png";
// import oilImage from "../assets/oil.png";
// import tyreImage from "../assets/tyre.png";
// import { AiOutlineShoppingCart } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";
// import logo from "../assets/logo.png";
// import appStore1 from "../assets/appstore (1).png";
// import appStore2 from "../assets/appstore (2).png";
// import bin from "../assets/bin.jpg";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import "../index.scss";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setCurentOrderProductData,
//   setOrderProcessName,
// } from "../store/orderProcessSlice";
// import { setClientCarsData } from "../store/projectSlice"; // Correct import

// import { filterProductWithCar, getMyCars, removeData } from "../DataBase/databaseFunction";

// import AsyncStorage from "@react-native-async-storage/async-storage";

// import PlayStoreLinks from "../Components/PlayStoreLinks";
// import BannerCarousel from "../Components/BannerCarousel";
// import { getTextString } from "../assets/TextStrings";
// import FuelTypeModal from '../Components/FuelTypeModal.js'; // Import the new modal component
// import { Modal, Button } from 'react-bootstrap';
// import { logAnalyticsEvent } from "../DataBase/databaseFunction";

// function HomePage() {
//   const dispatch = useDispatch();

//   // const navigate = useNavigate();
//  // State to check login status
//  const [isLoggedIn, setIsLoggedIn] = useState(false); // Added this state
//   // Use useSelector to get the current language state from Redux
//   const { isArabicLanguage } = useSelector((state) => state.auth);

//   // const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isFuelTypeModalOpen, setIsFuelTypeModalOpen] = useState(false); // Add this line

//   const [selectedCar, setSelectedCar] = useState(null);

//   // Get the text strings based on the current language
//   const textString = getTextString(isArabicLanguage);
//   const {
//     filtersData,
//     oilsData,
//     tireData,
//     batteryData,
//     supportServicesData,
//     clientBanners,
//     clientReviews,
//     engineOilsData,
//     engineOilPetrolData,
//     clientCarsData,
//   } = useSelector((state) => state.project);
//   const [slctedBtn, setslctedBtn] = useState(0);
//   const [selectedFuelType, setSelectedFuelType] = useState(null); // Added state for fuel type
//   // const [isFuelTypeModalOpen, setIsFuelTypeModalOpen] = useState(false); // Added state for modal visibility

//   const [selctedService, setselctedService] = useState(0);
//   const [show, setshow] = useState(false);
//   const [isLoading, setisLoading] = useState(false);

//   const [resultArray, setresultArray] = useState([]);
//   const [showModal, setShowModal] = useState(false); // State for modal visibility

//     // Function to handle modal close
//     const handleModalClose = () => {
//       setShowModal(false);
//     };
//     const handleContactSupport = () => {
//       window.location.href = 'https://api.whatsapp.com/send/?phone=966557488008'; // Redirect to specified URL
//     };

//   const handleClose = () => {
//     if (!show) {
//       window.webengage.track("Application Download Clicked", {});
//     }
//     setshow(!show);
//   };

//   const [cars, setCars] = useState([]);
//   const [userToken, setUserToken] = useState(null); // Add state for userToken

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         let userId = await AsyncStorage.getItem("userid");
//         console.log(userId);
//         let userCars = [];
//         if (userId && userId !== null) {
//           console.log(userId);
//           userCars = await getMyCars(userId);
//           console.log(userCars);
//         } else {
//           const storedCars = sessionStorage.getItem("tempCarData");
//           if (storedCars) {
//             userCars = JSON.parse(storedCars);
//           }
//         }
//         setCars(userCars.map((car) => ({ ...car, selected: false })));
//       } catch (error) {
//         console.error("Error fetching userId or cars:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     const checkLoginStatus = () => {
//       try {
//         const token = localStorage.getItem("userid"); // Retrieve userToken from localStorage
//         console.log("Retrieved Token:", token); // Debugging token retrieval
//         setUserToken(token); // Save userToken in state
//         setIsLoggedIn(!!token); // Set login status based on token presence
//       } catch (error) {
//         console.error("Error retrieving token:", error);
//       }
//     };
//     checkLoginStatus();
//   }, []);

//     const handleEnterCarDataClick = async () => {
//       if (!isLoggedIn) {
//         navigate("/login"); // Redirect to login page if not logged in
//       } else {
//         navigate("/selectCar"); // Redirect to select car page if logged in
//       }
//     };

//   const handleCarClick = (clickedCar) => {
//     // Toggle the selected state of the clicked car and deselect others
//     const updatedCars = cars.map((car) =>
//       car.carName === clickedCar.carName
//         ? { ...car, selected: !car.selected }
//         : { ...car, selected: false }
//     );

//     setCars(updatedCars);
//     setSelectedCar(clickedCar);
//     // setIsModalOpen(true);

//     // Update sessionStorage with the modified array
//     sessionStorage.setItem("cars", JSON.stringify(updatedCars));
//   };

//   const removeCarById = async (carId) => {
//     setisLoading(true);
//     console.log('Deleting car with ID:', carId);
//     await removeData("userManualCars", carId).then(async () => {
//       // Added check to ensure clientCarsData is an array
//       const clientCarsDataNew = Array.isArray(clientCarsData)
//         ? clientCarsData.filter((dat) => dat.id !== carId)
//         : [];
//       dispatch(setClientCarsData({ clientCarsData: clientCarsDataNew }));
//       toast.success("Car Deleted Successfully"); // Toast notification for success

//     });
//     setisLoading(false);
//   };

//   const handleDeleteCar = (carToDelete) => {
//     console.log('Deleting car:', carToDelete.id);
//     removeCarById(carToDelete.id);
//     const filteredCars = cars.filter(
//       (car) => car.carName !== carToDelete.carName
//     );
//     setCars(filteredCars);
//     sessionStorage.setItem("cars", JSON.stringify(filteredCars));
//   };

//   const navigate = useNavigate();
//   const trackCategory = (name) => {
//     window.webengage.track("Category Clicked", {
//       name: `${name}`,
//       "Category name": name,
//       Image: [
//         "https://img.freepik.com/premium-vector/engine-oil-filters-isolated-white-background_258836-181.jpg?w=2000",
//       ],
//     });
//   };
//   var settings = {
//     dots: true,
//     rows: 1,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 3,
//     initialSlide: 0,
//     autoplay: true,
//     autoplaySpeed: 4000,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 3,
//         },
//       },
//       {
//         breakpoint: 600,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 2,
//           initialSlide: 2,
//           dots: false,
//         },
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           dots: false,
//         },
//       },
//     ],
//   };

//   const isArabic = false;

//   const handleFuelTypeSelect = (fuelType) => {
//     const updatedCars = cars.map((car) =>
//       car.carName === selectedCar.carName
//         ? { ...car, fuelType, selected: true }
//         : { ...car, selected: false }
//     );

//     setCars(updatedCars);
//     sessionStorage.setItem('cars', JSON.stringify(updatedCars));
//     // setIsModalOpen(false);
//   };

//   useEffect(() => {
//     if (slctedBtn === 1) {
//       setIsFuelTypeModalOpen(true); // Add this line
//     } else {
//       setIsFuelTypeModalOpen(false); // Add this line
//     }
//   }, [slctedBtn]);

//   // const handleProductCategoryClick = (category) => {
//   //   setSlctedBtn(category);
//   // };

//   useEffect(() => {
//     const filteredDataFun = async () => {
//       console.log("Engine Oil Petrol Data:", engineOilPetrolData); // Log the engineOilPetrolData
//       console.log("Engine Oils Data:", engineOilsData); // Log the engineOilsData
//       console.log("Filters Data:", filtersData); // Log the filtersData
//       console.log("Oils Data:", oilsData); // Log the oilsData
//       console.log("Battery Data:", batteryData); // Log the batteryData
//       console.log("Tire Data:", tireData); // Log the tireData
//       console.log("Selected Fuel Type:", selectedFuelType); // Log the selected fuel type
//       console.log("Selected Car:", cars.find((car) => car.selected)); // Log the selected car

//       let result = [];
//       const selectedCar = cars.find((car) => car.selected);

//       if (selectedCar) {
//         try {
//           if (slctedBtn === 1) {
//             console.log("Fetching data for engine oils, engine oil petrol, filters, and oils...");

//             // Fetch engine oils data
//             const engineOilResult = await filterProductWithCar(engineOilsData, selectedCar.carName);
//             console.log("Engine Oils Result:", engineOilResult.data);

//             // Fetch engine oil Petrol data
//             const engineOilPetrolResult = await filterProductWithCar(engineOilPetrolData, selectedCar.carName);
//             console.log("Engine Oil Petrol Result:", engineOilPetrolResult.data);

//             // Fetch filters data
//             const filtersResult = await filterProductWithCar(filtersData, selectedCar.carName);
//             console.log("Filters Result:", filtersResult.data);

//             // Fetch oils data
//             const oilsResult = await filterProductWithCar(oilsData, selectedCar.carName);
//             console.log("Oils Result:", oilsResult.data);

//             // Organize the result
//             result = [
//               { type: "engineOilPetrol", data: engineOilPetrolResult.data || [] },
//               { type: "engineOils", data: engineOilResult.data || [] },
//               { type: "filters", data: filtersResult.data || [] },
//               { type: "oils", data: oilsResult.data || [] },
//             ];

//             // Log the combined result
//             console.log("Combined Result Before Filtering:", result);

//             // Filter result based on selected fuel type
//             if (selectedFuelType === 'petrol') {
//               result = result.filter(item => item.type === 'engineOilPetrol' || item.type === 'filters' || item.type === 'oils');
//             } else if (selectedFuelType === 'diesel') {
//               result = result.filter(item => item.type === 'engineOils' || item.type === 'filters' || item.type === 'oils');
//             }

//             // Log the filtered result
//             console.log("Filtered Result:", result);

//           } else if (slctedBtn === 2) {
//             console.log("Fetching battery data...");
//             const batteryResult = await filterProductWithCar(batteryData, selectedCar.carName);
//             result = batteryResult.data || [];
//             console.log("Battery Result:", result);
//           } else if (slctedBtn === 3) {
//             console.log("Fetching tire data...");
//             const tireResult = await filterProductWithCar(tireData, selectedCar.carName);
//             result = tireResult.data || [];
//             console.log("Tire Result:", result);
//           }

//           // Set result in state
//           setresultArray(result);

//           // Check data size and handle storage
//           const resultString = JSON.stringify(result);
//           if (resultString.length < 5000) { // Check if the data size is reasonable
//             sessionStorage.setItem("filteredProducts", resultString);
//             console.log("Data saved to sessionStorage.");
//           } else {
//             console.warn("Data size too large for sessionStorage");
//           }

//           // Console log for debugging
//           console.log("Filtered data:", result);

//           // Show modal if result is empty
//           if (result.length === 0) {
//             setShowModal(true);
//             console.log("No results found. Modal shown.");
//           }
//         } catch (error) {
//           console.error("Error processing filtered data:", error);
//         }
//       } else {
//         console.log("No selected car found.");
//       }
//     };

//     // Run the function when `slctedBtn` or dependencies change
//     if (slctedBtn > 0 && slctedBtn < 4) {
//       filteredDataFun();
//     }
//   }, [
//     slctedBtn,
//     batteryData,
//     cars,
//     engineOilsData,
//     engineOilPetrolData,
//     filtersData,
//     oilsData,
//     supportServicesData,
//     tireData,
//     selectedFuelType,
//   ]);

//   // useEffect(() => {
//   //   const filteredDataFun = async () => {
//   //     console.log("Engine Oil Petrol Datasssss:", engineOilPetrolData); // Log the data

//   //     let result = [];
//   //     const selectedCar = cars.find((car) => car.selected);

//   //     if (selectedCar) {
//   //       try {
//   //         if (slctedBtn === 1) {
//   //           // Fetch engine oils data
//   //           const engineOilResult = await filterProductWithCar(
//   //             engineOilsData,
//   //             selectedCar.carName
//   //           );

//   //           // Fetch engine oil Petrol data
//   //           const engineOilPetrolResult = await filterProductWithCar(
//   //             engineOilPetrolData,
//   //             selectedCar.carName
//   //           );

//   //           // Fetch filters data
//   //           const filtersResult = await filterProductWithCar(
//   //             filtersData,
//   //             selectedCar.carName
//   //           );

//   //           // Fetch oils data
//   //           const oilsResult = await filterProductWithCar(
//   //             oilsData,
//   //             selectedCar.carName
//   //           );

//   //           // Organize the result
//   //           result = [
//   //             { type: "engineOilPetrol", data: engineOilPetrolResult.data || [] },
//   //             { type: "engineOils", data: engineOilResult.data || [] },
//   //             { type: "filters", data: filtersResult.data || [] },
//   //             { type: "oils", data: oilsResult.data || [] },
//   //           ];

//   //           // Filter result based on selected fuel type
//   //           if (selectedFuelType === 'petrol') {
//   //             result = result.filter(item => item.type === 'engineOilPetrol' || item.type === 'filters' || item.type === 'oils');
//   //           } else if (selectedFuelType === 'diesel') {
//   //             result = result.filter(item => item.type === 'engineOils' || item.type === 'filters' || item.type === 'oils');
//   //           }

//   //         } else if (slctedBtn === 2) {
//   //           const batteryResult = await filterProductWithCar(
//   //             batteryData,
//   //             selectedCar.carName
//   //           );
//   //           result = batteryResult.data || [];
//   //         } else if (slctedBtn === 3) {
//   //           const tireResult = await filterProductWithCar(
//   //             tireData,
//   //             selectedCar.carName
//   //           );
//   //           result = tireResult.data || [];
//   //         }

//   //         // Set result in state
//   //         setresultArray(result);

//   //         // Check data size and handle storage
//   //         const resultString = JSON.stringify(result);
//   //         if (resultString.length < 5000) { // Check if the data size is reasonable
//   //           sessionStorage.setItem("filteredProducts", resultString);
//   //         } else {
//   //           console.warn("Data size too large for sessionStorage");
//   //         }

//   //         // Console log for debugging
//   //         console.log("Filtered data:", result);

//   //         // Show modal if result is empty
//   //         if (result.length === 0) {
//   //           setShowModal(true);
//   //         }
//   //       } catch (error) {
//   //         console.error("Error processing filtered data:", error);
//   //       }
//   //     }
//   //   };

//   //   // Run the function when `slctedBtn` or dependencies change
//   //   if (slctedBtn > 0 && slctedBtn < 4) {
//   //     filteredDataFun();
//   //   }
//   // }, [
//   //   slctedBtn,
//   //   batteryData,
//   //   cars,
//   //   engineOilsData,
//   //   engineOilPetrolData,
//   //   filtersData,
//   //   oilsData,
//   //   supportServicesData,
//   //   tireData,
//   //   selectedFuelType,
//   // ]);

//   // Make sure to handle any error cases or loading states as needed.

//   const supportNextBtn = async () => {
//     const data = supportServicesData[selctedService - 1];
//     await window.localStorage.setItem(
//       "ac-zurex-client-order-products",
//       JSON.stringify({
//         products: [data],
//         processName: "support",
//       })
//     );

//     dispatch(
//       setCurentOrderProductData({
//         curentOrderProductData: [data],
//       })
//     );
//     dispatch(setOrderProcessName({ orderProcessName: "support" }));

//     navigate("/pay");
//   };

//   const handleProductCategoryClick = async (category) => {
//     if (!isLoggedIn) {
//       navigate("/login");
//     } else {
//       if (cars.every((car) => !car.selected)) {
//         toast.error(textString.plsSlctCarTxt);
//         return;
//       }

//       if (category === 1) {
//         await logAnalyticsEvent("Category_Viewed", {
//           categoryName: "oilFilter",
//           userId: userToken,
//           device_type: "Web"
//         });
//         console.log("oilFilter", userToken);
//       }
//       else if (category === 2) {
//         await logAnalyticsEvent("Category_Viewed", {
//           categoryName: "battery",
//           userId: userToken,
//           device_type: "Web"
//         });
//         console.log("battery", userToken);
//       }
//       else if (category === 3) {
//         await logAnalyticsEvent("Category_Viewed", {
//           categoryName: "tyre",
//           userId: userToken,
//           device_type: "Web"
//         });
//         console.log("tyre", userToken);
//       }
//       else {
//         console.log("support order");
//       }

//       setslctedBtn(category);
//       trackCategory(category);
//     }
//   };

//   // const handleCloseModal = () => {
//   //   // setIsModalOpen(false);
//   // };

//   return (
//     <div className="container hompage">
//     <ToastContainer />
//       {/* Buttons for entering car data and downloading the app */}
//       <div
//       onClick={handleEnterCarDataClick}
//       className="btn w-100 homeBtnMain mt-4"
//     >
//       {textString.enterYourCarDataTxt}
//     </div>
//       <h1 className="text-center mt-5 mb-4">  {textString.yourcarTxt}</h1>
//       <div className="row">
//         {cars.length > 0 ? (
//           cars.map((car, index) => (
//             <div key={index} className="col-md-4 mb-4">
//               <div className={`card ${car.selected ? "selected" : ""}`}>
//                 <div className="card-body" onClick={() => handleCarClick(car)}>
//                   <h5 className="card-title">{car.carName}</h5>
//                   <p className="card-text">Plate: {car.numberPlate}</p>
//                 </div>
//                 <div className="delete-button-container">
//                   <img
//                     src={bin}
//                     alt="Delete"
//                     className="delete-button"
//                     onClick={() => handleDeleteCar(car)}
//                   />
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="col text-center"> {textString.nocarsaddedTxt}</p>
//         )}
//       </div>

//       <div onClick={handleClose} className="btn w-100 homeBtnSec mt-4">
//         {textString.downloadAppTxt}
//       </div>
//       {/* Banner Carousel */}
//       <BannerCarousel clientBanners={clientBanners} />

//           {/* FuelTypeModal */}
//     <FuelTypeModal
//     isOpen={isFuelTypeModalOpen}
//     onClose={() => setIsFuelTypeModalOpen(false)}
//     onSelectFuelType={(type) => {
//       console.log(`Selected fuel type: ${type}`);
//       setSelectedFuelType(type); // Update the selected fuel type

//       setIsFuelTypeModalOpen(false);
//       // Handle fuel type selection (e.g., filter products based on fuel type)
//     }}
//   />

// <FuelTypeModal
//   // isOpen={isModalOpen}
//   // onClose={handleCloseModal}
//   onSelectFuelType={handleFuelTypeSelect}
// />

//       {/* Heading and navigation text */}
//       <p className="headingPara custom25MarginBottom">
//         {textString.homeNavTxt}
//         {" > "}
//         <span className="smallNav">
//           {slctedBtn === 0
//             ? textString.productNavTxt
//             : slctedBtn === 1
//             ? textString.oilFilterTxt
//             : slctedBtn === 2
//             ? textString.batteryTxt
//             : slctedBtn === 3
//             ? textString.tireTxt
//             : slctedBtn === 4
//             ? textString.supportTxt
//             : " "}
//         </span>
//       </p>
//       {/* Product category buttons */}
//       <div className="row">
//         <div className="col-12 col-md-6 col-lg-3 mb-5">
//           <div
//             onClick={() => handleProductCategoryClick(1)}
//             className={"productBtnSelctr"}
//           >
//             <img
//               src={productType1}
//               alt="productType1"
//               style={{ width: "100%", height: "100%", objectFit: "contain" }}
//             />
//           </div>
//         </div>
//         <div className="col-12 col-md-6 col-lg-3 mb-5">
//           <div
//             onClick={() => handleProductCategoryClick(2)}
//             className={"productBtnSelctr"}
//           >
//             <img
//               alt="productType2"
//               src={productType2}
//               style={{ width: "100%", height: "100%", objectFit: "contain" }}
//             />
//           </div>
//         </div>
//         <div className="col-12 col-md-6 col-lg-3 mb-5">
//           <div
//             onClick={() => handleProductCategoryClick(3)}

//             className={"productBtnSelctr"}
//           >
//             <img
//               src={productType3}
//               alt="productType3"
//               style={{ width: "100%", height: "100%", objectFit: "contain" }}
//             />
//           </div>
//         </div>
//         <div className="col-12 col-md-6 col-lg-3 mb-5">
//           <div
//             onClick={() => handleProductCategoryClick(4)}
//             className={"productBtnSelctr"}
//           >
//             <img
//               alt="productType4"
//               src={productType4}
//               style={{ width: "100%", height: "100%", objectFit: "contain" }}
//             />
//           </div>
//         </div>
//       </div>
//           {/* Your existing render logic */}
//           {isLoading && <div className="loading-spinner">Loading...</div>}

//       {/* Display filtered products */}
//       <div className="row">

//       {slctedBtn > 0 && slctedBtn < 4 && Array.isArray(resultArray) && (
//         <>
//           {slctedBtn === 1 ? (
//             <>
//               {resultArray.map((item, index) => (
//                 <div key={index} className="col-12">
//                   <h2>
//                     {item.type === "engineOils"
//                       ? "Engine Oils"
//                       : item.type === "engineOilPetrol"
//                       ? "Engine Oil Petrol"
//                       : item.type === "filters"
//                       ? "Filters"
//                       : "Oils"}
//                   </h2>
//                   <div className="row">
//                     {Array.isArray(item.data) &&
//                       item.data.map((dat, idx) => (
//                         <div key={idx} className="col-12 col-md-6 col-lg-3 mb-4">
//                           <div
//                             onClick={() =>
//                               navigate(
//                                 `/productInfo/${dat?.productNameEng
//                                   ?.replace(/[^a-zA-Z ]/g, "")
//                                   .replace(/ /g, "_")}_@_${dat.referance}_@_${dat.id}`
//                               )
//                             }
//                             className="cartCardContainerNew d-flex align-items-center justify-content-center flex-column"
//                           >
//                             <img
//                               src={
//                                 dat?.images?.length > 0
//                                   ? dat?.images[0]?.imgLink
//                                   : item.type === "engineOils" || item.type === "engineOilPetrol"
//                                   ? oilImage
//                                   : logo
//                               }
//                               alt="product"
//                               loading="lazy"
//                             />
//                             <div className="otherInfoContainer">
//                               <p className="fs-3">
//                                 {isArabic
//                                   ? dat?.productNameArab
//                                   : dat?.productNameEng}
//                               </p>
//                               <div className="lowerSideContainer">
//                                 <p className="lowerPara">
//                                   {dat?.discountPrice
//                                     ? (
//                                         <>
//                                           <span style={{ textDecoration: 'line-through' }}>
//                                             {dat?.originalPrice} {textString.currencyTxt}
//                                           </span>{" "}
//                                           <span style={{ color: 'red' }}>
//                                             {dat?.discountPrice} {textString.currencyTxt}
//                                           </span>
//                                         </>
//                                       )
//                                     : `${dat?.originalPrice} ${textString.currencyTxt}`}
//                                 </p>
//                               </div>
//                               <button className="addToCartBtn">
//                                 <AiOutlineShoppingCart /> {textString.addToCartTxt}
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//               ))}
//             </>
//           ) : (
//             resultArray.map((dat, index) => (
//               <div key={index} className="col-12 col-md-6 col-lg-3 mb-4">
//                 <div
//                   onClick={() =>
//                     navigate(
//                       `/productInfo/${dat?.productNameEng
//                         ?.replace(/[^a-zA-Z ]/g, "")
//                         .replace(/ /g, "_")}_@_${dat.referance}_@_${dat.id}`
//                     )
//                   }
//                   className="cartCardContainerNew d-flex align-items-center justify-content-center flex-column"
//                 >
//                   <img
//                     src={
//                       dat?.images?.length > 0
//                         ? dat?.images[0]?.imgLink
//                         : slctedBtn === 2
//                         ? batteryImage
//                         : tyreImage
//                     }
//                     alt="product"
//                     loading="lazy"
//                   />
//                   <div className="otherInfoContainer">
//                     <p className="fs-3">
//                       {isArabic ? dat?.productNameArab : dat?.productNameEng}
//                     </p>
//                     <div className="lowerSideContainer">
//                       <p className="lowerPara">
//                         {dat?.discountPrice
//                           ? (
//                               <>
//                                 <span style={{ textDecoration: 'line-through' }}>
//                                   {dat?.originalPrice} {textString.currencyTxt}
//                                 </span>{" "}
//                                 <span style={{ color: 'red' }}>
//                                   {dat?.discountPrice} {textString.currencyTxt}
//                                 </span>
//                               </>
//                             )
//                           : `${dat?.originalPrice} ${textString.currencyTxt}`}
//                       </p>
//                     </div>
//                     <button className="addToCartBtn">
//                       <AiOutlineShoppingCart /> {textString.addToCartTxt}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </>
//       )}
//         {slctedBtn === 4 && (
//           <>
//             <div className="SupportContainer w-100">
//               <div className="row w-100">
//                 {supportServicesData?.map((dat, index) => {
//                   const titleOnly = dat?.products?.map((dac) =>
//                     isArabic ? dac.productNameArab : dac.productNameEng
//                   );
//                   const suportTitle = titleOnly?.join(" , ");
//                   return (
//                     <div key={index} className="col-12 col-md-6 col-lg-3 mb-4">
//                       <div
//                         onClick={() => {
//                           setselctedService(index + 1);
//                         }}
//                         className="cartCardContainerNew1 h-auto d-flex align-items-center justify-content-center flex-column"
//                         style={{
//                           borderColor:
//                             selctedService === index + 1
//                               ? "#8c1726"
//                               : "#003978",
//                           minHeight: "270px",
//                         }}
//                       >
//                         <div className="imagContainer">
//                           <img
//                             src={require("../assets/5138237.jpg")}
//                             alt="product"
//                           />
//                         </div>
//                         <div className="otherInfoContainer">
//                           <p
//                             className="fs-4"
//                             style={{
//                               color:
//                                 selctedService === index + 1
//                                   ? "#8c1726"
//                                   : "#000",
//                               fontWeight:
//                                 selctedService === index + 1 ? "600" : "normal",
//                             }}
//                           >
//                             {suportTitle}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//             {selctedService !== 0 ? (
//               <div className="nextBtnDiv">
//                 <button onClick={supportNextBtn}>
//                   {textString.nextbtnTxt}
//                 </button>
//               </div>
//             ) : null}
//           </>
//         )}
//       </div>

//       <p className="headingPara custom25MarginBottom">
//         {textString.customerReviewTxt}
//       </p>
//       {clientReviews?.length > 0 ? (
//         <div className="w-100 mb-4">
//           <Slider {...settings} infinite={clientReviews.length}>
//             {clientReviews?.map((dat, index) => (
//               <div key={index} className="reviewCard">
//                 <div className="userAvtar">
//                   <img
//                     src="data:image/png;base64,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"
//                     alt="user"
//                   />
//                 </div>
//                 <h3>{dat.userName}</h3>
//                 <p>{dat.review}</p>
//               </div>
//             ))}
//           </Slider>
//         </div>
//       ) : null}
//       <div style={{ marginBottom: "5rem" }} />
//       {/* Modal for downloading the app */}
//       <PlayStoreLinks
//         show={show}
//         handleClose={handleClose}
//         logo={logo}
//         textString={textString}
//         appStore1={appStore1}
//         appStore2={appStore2}
//       />

//       {/* Bootstrap Modal for no data */}
//       <Modal show={showModal} onHide={handleModalClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>No Suitable Products Found</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>Please contact customer support or go back to the previous page.</p>
//         </Modal.Body>
//         <Modal.Footer>
//                <Button variant="secondary" onClick={handleModalClose}>
//           Back
//         </Button>
//           <Button variant="primary" onClick={handleContactSupport}>
//             Contact Support
//           </Button>
//         </Modal.Footer>
//       </Modal>

//     </div>
//   );
// }

// export default HomePage;

// // filtering working
