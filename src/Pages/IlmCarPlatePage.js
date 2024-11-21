import React, { useState } from "react";
import { Alert, Card } from "react-bootstrap";
// import { textString } from "../assets/TextStrings";
import { useDispatch } from "react-redux";
import { setClientCarsData } from "../store/projectSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getTextString } from "../assets/TextStrings";
import { postDataWithRef } from "../DataBase/databaseFunction"; // Adjust the import path as per your project structure
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useSelector } from "react-redux";

const IlmCarPlatePage = () => {
  const [plateNumbers, setPlateNumbers] = useState("");
  const [plateAlphabets, setPlateAlphabets] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentCarResult, setCurrentCarResult] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
      const { isArabicLanguage } = useSelector((state) => state.auth);
      const textString = getTextString(isArabicLanguage);
      
      function guidGenerator() {
        var S4 = function () {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4();
      }
  const fetchCarData = async () => {
    if (plateAlphabets?.length === 5 && plateNumbers?.length >= 4) {
      setLoading(true);

      try {
        const response = await fetch(
          "https://app-xaop4bxqda-uc.a.run.app/fetch-vehicle-data",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ plateAlphabets, plateNumbers }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch vehicle data");
        }

        const vehicleData = await response.json();
        console.log("Vehicle Data:", vehicleData);

        if (vehicleData?.vehicleInfo) {
          setCurrentCarResult(vehicleData?.vehicleInfo);
          setAlertMessage(""); // Clear any previous alert messages
        } else {
          setAlertMessage("Unable to retrieve data");
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error.message);
        setAlertMessage("An error occurred while fetching data");
      }

      setLoading(false);
    } else {
      setAlertMessage("Enter correct plate numbers");
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    fetchCarData();
  };
  
  const handleAddCar = async (e) => {
    e.preventDefault();

    try {
      let userId = await AsyncStorage.getItem("userid"); // Adjust key as per your AsyncStorage implementation
      const id = guidGenerator();

      const carData = {
        carName: `${currentCarResult.make} ${currentCarResult.model} ${currentCarResult.modelYear}`,
        category: `${currentCarResult.make}`,
        numberPlate: `${plateAlphabets} ${plateNumbers}`,
        userId: userId || null,
      };

      console.log("Car Data:", carData);

      // Decide whether to use postDataWithRef or sessionStorage based on userId existence
      if (userId) {
        postDataWithRef("userManualCars", id, carData);
      } else {
        // Fallback to sessionStorage if userId is not found
        sessionStorage.setItem("tempCarData", JSON.stringify(carData));
      }

      const existingCars = JSON.parse(sessionStorage.getItem("cars")) || [];
      const updatedCars = [...existingCars, carData];
      sessionStorage.setItem("cars", JSON.stringify(updatedCars));

      dispatch(setClientCarsData({ clientCarsData: carData }));
      toast.success("Products will be filtered with this car.");
      window.webengage.track("Car Added", {
        "Plate Alphabets": plateAlphabets,
        "Plate Numbers": plateNumbers,
        ...carData,
      });

      navigate("/", { state: { carData } });
    } catch (error) {
      console.error(
        "Error fetching userId from AsyncStorage or posting car data:",
        error.message
      );
      alert("Error occurred. Please try again later.");
    }
  };

  

  return (
    <>
      <div className="btn w-100 homeBtnMainDivWala mt-2">
        {textString.enterCarPlateDetails}
      </div>
      <form className="container my-5 enterCarData">
        <input
          required
          value={plateAlphabets}
          placeholder={textString.enterplateAlphabets}

          onChange={(e) => setPlateAlphabets(e.target.value)}
          style={{ marginBottom: "40px" }}
        />
        <input
          required
          value={plateNumbers}
          placeholder={textString.enterplateNumbers}
          onChange={(e) => setPlateNumbers(e.target.value)}
          style={{ marginBottom: "40px" }}
        />
        {currentCarResult && (
          <Card style={{ width: "18rem", marginTop: "20px" }}>
            <Card.Body>
              <Card.Title>{textString.vehicledetailsTxt}</Card.Title>
              <Card.Text>
                <p>
                  <b>{textString.makeTxt}</b> {currentCarResult.make}
                </p>
                <p>
                  <b>{textString.modelTxt}</b> {currentCarResult.model}
                </p>
                <p>
                  <b>{textString.modelyearTxt}</b> {currentCarResult.modelYear}
                </p>
                <p>
                  <b>{textString.registrationtypeTxt}</b> {currentCarResult.regTypeDescAr}
                </p>
                <p>
                  <b>{textString.vehicalclassTxt}</b> {currentCarResult.vehicleClassDescAr}
                </p>
                <p>
                  <b>{textString.vehicalIdNumberTxt}</b> {currentCarResult.vehicleIDNumber}
                </p>
                <p>
                  <b>{textString.cylinderTxt}</b> {currentCarResult.cylinder}
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
        )}
        {alertMessage && <Alert variant="danger">{alertMessage}</Alert>}
        {!currentCarResult ? (
          <button
            type="button"
            className="lastBtn"
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? (textString.loadingBtn) : (textString.nextBtn)}

          </button>
        ) : (
          <button type="button" className="lastBtn" onClick={handleAddCar}>
         {textString.addCarsBtn}
          </button>
        )}
      </form>
    </>
  );
};

export default IlmCarPlatePage;
