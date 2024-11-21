// import React, { useEffect, useState } from "react";
// import articleImg from "../assets/article2.png";
// import { getTextString } from "../assets/TextStrings";
// import { useDispatch, useSelector } from "react-redux";
// import { setClientCarsData } from "../store/projectSlice";
// import { toast,ToastContainer } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { postDataWithRef } from "../DataBase/databaseFunction"; // Adjust the import path as per your project structure
// import AsyncStorage from "@react-native-async-storage/async-storage";

// function EnterCarDataPage() {
//   const [carType, setcarType] = useState("");
//   const [carCategory, setcarCategory] = useState("");
//   const [carModal, setcarModal] = useState("");
//   const [carPlate, setcarPlate] = useState("");
//   const [carModalNameArry, setcarModalNameArry] = useState([]);
//   const [carModals, setcarModals] = useState([]);
//   const { adminCarsData } = useSelector((state) => state.project);
//   const uniqueCompanies = [
//     ...new Set(adminCarsData.map((car) => car.carCompany)),
//   ];

//   const companiesData = uniqueCompanies.map((company) => ({
//     title: company,
//     value: company,
//   }));

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//       const { isArabicLanguage } = useSelector((state) => state.auth);
//       const textString = getTextString(isArabicLanguage);


//   // Function to generate a GUID
//   function guidGenerator() {
//     var S4 = function () {
//       return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
//     };
//     return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4();
//   }

//   const addCarData = async (e) => {
//     e.preventDefault();
//     // const regex = /^[a-zA-Z\u0600-\u06FF]{3}\d{4}$/;
//     const regex = /^[a-zA-Z\u0600-\u06FF]{3}\d{1,4}$/; // Updated regex to allow 3 letters followed by 1 to 4 digits
//     if (regex.test(carPlate)) {
//       try {
//         let userId = await AsyncStorage.getItem("userid"); // Adjust key as per your AsyncStorage implementation
//         const filteredCarData = adminCarsData?.filter(
//           (dat) =>
//             (dat?.carCompany === carType || dat?.carCompanyAr === carType) &&
//             (dat?.carName === carCategory || dat?.carNameAr === carCategory) &&
//             dat?.carModal === carModal
//         );
//         const finalData = filteredCarData[0];
//         const { ...rest } = finalData;
//         console.log({ ...rest });
//         const id = guidGenerator();
//         const carData = {
//           carName: `${rest?.carCompany} ${rest?.carName} ${rest?.carModal}`,
//           category: `${rest?.carCompany}`,
//           numberPlate: carPlate,
//           userId: userId || null, // Use null if userId is not present
//         };
//         console.log(id);
//         console.log(`carData:`, carData);

//         // Decide whether to use postDataWithRef or sessionStorage based on userId existence
//         if (userId) {
//           postDataWithRef("userManualCars", id, carData);
//         } else {
//           // Fallback to sessionStorage if userId is not found
//           sessionStorage.setItem("tempCarData", JSON.stringify(carData));
//         }

//      dispatch(setClientCarsData({ clientCarsData: carData }));
//         toast.success("Products will be filtered with this car."); // Success toast
//         window.webengage.track("Car Added", {
//           "Type of Car": carType,
//           "Car Category": carCategory,
//           "Car Model": carModal,
//           "Plate Number": carPlate,
//         });

//         navigate("/", { state: { carData } });
//       } catch (error) {
//         console.error(
//           "Error fetching userId from AsyncStorage or posting car data:",
//           error.message
//         );
//           toast.error("Error occurred.Please complete all fields before add car "); // Changed to toast
//       }
//     } else {
//       toast.error(
//         "Invalid car plate number. Please enter 3 alphabets (English or Arabic) followed by 1 to 4 numbers." // Changed to toast
//       );

//     }
//   };

//   useEffect(() => {
//     const convertRawDataToFormatModal = async () => {
//       const filteredData = adminCarsData.filter(
//         (car) =>
//           (car.carCompany === carType || car.carCompanyAr === carType) &&
//           (car.carName === carCategory || car.carNameAr === carCategory)
//       );
//       const uniqueCarName = [
//         ...new Set(filteredData.map((car) => car.carModal)),
//       ];
//       const formatedCarName = uniqueCarName.map((carModalDat) => ({
//         title: carModalDat,
//         value: carModalDat,
//       }));
//       setcarModals(formatedCarName);
//     };
//     if (carCategory?.length > 0 && carType?.length > 0) {
//       convertRawDataToFormatModal();
//     }
//   }, [carCategory, adminCarsData, carType]);

//   useEffect(() => {
//     const convertRawDataToFormat = async () => {
//       const uniqueCarName = [
//         ...new Set(
//           adminCarsData
//             .filter(
//               (car) =>
//                 car.carCompany === carType || car.carCompanyAr === carType
//             )
//             .map((car) => car.carName)
//         ),
//       ];
//       const formatedCarName = uniqueCarName.map((company) => ({
//         title: company,
//         value: company,
//       }));
//       setcarModalNameArry(formatedCarName);
//     };
//     if (carType?.length > 0) {
//       convertRawDataToFormat();
//     }
//   }, [carType, adminCarsData]);

//   return (
//     <>
//       <div className="btn w-100 homeBtnMainDivWala mt-2">
//         {textString.enterYourCarDataTxt}
//       </div>
//       <form onSubmit={addCarData} className="container my-5 enterCarData">
//         <img src={articleImg} alt="enterData" />
//         <select value={carType} onChange={(e) => setcarType(e.target.value)}>
//           <option disabled value={""}>
//             {textString.carTypeTxt}
//           </option>
//           {companiesData?.map((dat, index) => (
//             <option key={index} value={dat?.value}>
//               {dat?.title}
//             </option>
//           ))}
//         </select>
//         <select
//           value={carCategory}
//           onChange={(e) => setcarCategory(e.target.value)}
//         >
//           <option disabled value={""}>
//             {textString.carCategTxt}
//           </option>
//           {carModalNameArry?.map((dat, index) => (
//             <option key={index} value={dat?.value}>
//               {dat?.title}
//             </option>
//           ))}
//         </select>
//         <select value={carModal} onChange={(e) => setcarModal(e.target.value)}>
//           <option disabled value={""}>
//             {textString.carModalTxt}
//           </option>
//           {carModals?.map((dat, index) => (
//             <option key={index} value={dat?.value}>
//               {dat?.title}
//             </option>
//           ))}
//         </select>
//         <input
//           required
//           minLength={4}
//           maxLength={9}
//           value={carPlate}
//           placeholder="xxx1234 or x x x1234"
//           onChange={(e) => setcarPlate(e.target.value)}
//         />
//         <button type="submit" className="lastBtn">
//           {textString.addCarsTxt}
//         </button>
//         <ToastContainer
//           position="top-right"
//           autoClose={5000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//         /> {/* Make sure ToastContainer is included here */}
//       </form>
//     </>
//   );
// }

// export default EnterCarDataPage;





import React, { useEffect, useState } from "react";
import articleImg from "../assets/article2.png";
import { getTextString } from "../assets/TextStrings";
import { useDispatch, useSelector } from "react-redux";
import { setClientCarsData } from "../store/projectSlice";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { postDataWithRef } from "../DataBase/databaseFunction";
import AsyncStorage from "@react-native-async-storage/async-storage";

function EnterCarDataPage() {
  const [carType, setcarType] = useState("");
  const [carCategory, setcarCategory] = useState("");
  const [carModal, setcarModal] = useState("");
  const [carPlate, setcarPlate] = useState("");
  const [cylinder, setCylinder] = useState(""); // New state for cylinder input
  const [carModalNameArry, setcarModalNameArry] = useState([]);
  const [carModals, setcarModals] = useState([]);
  const { adminCarsData } = useSelector((state) => state.project);
  const uniqueCompanies = [
    ...new Set(adminCarsData.map((car) => car.carCompany)),
  ];

  const companiesData = uniqueCompanies.map((company) => ({
    title: company,
    value: company,
  }));

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isArabicLanguage } = useSelector((state) => state.auth);
  const textString = getTextString(isArabicLanguage);

  // Function to generate a GUID
  function guidGenerator() {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4();
  }

  const addCarData = async (e) => {
    e.preventDefault();
    const regex = /^[a-zA-Z\u0600-\u06FF]{3}\d{1,4}$/;
    if (regex.test(carPlate)) {
      try {
        let userId = await AsyncStorage.getItem("userid");
        const filteredCarData = adminCarsData?.filter(
          (dat) =>
            (dat?.carCompany === carType || dat?.carCompanyAr === carType) &&
            (dat?.carName === carCategory || dat?.carNameAr === carCategory) &&
            dat?.carModal === carModal
        );
        const finalData = filteredCarData[0];
        const { ...rest } = finalData;
        console.log({ ...rest });
        const id = guidGenerator();
        const carData = {
          carName: `${rest?.carCompany} ${rest?.carName} ${rest?.carModal}`,
          category: `${rest?.carCompany}`,
          numberPlate: carPlate,
          cylinder, // Add the cylinder value to the carData object
          userId: userId || null,
        };
        console.log(id);
        console.log(`carData:`, carData);

        if (userId) {
          postDataWithRef("userManualCars", id, carData);
        } else {
          sessionStorage.setItem("tempCarData", JSON.stringify(carData));
        }

        dispatch(setClientCarsData({ clientCarsData: carData }));
        toast.success("Products will be filtered with this car.");
        window.webengage.track("Car Added", {
          "Type of Car": carType,
          "Car Category": carCategory,
          "Car Model": carModal,
          "Cylinder": cylinder, // Track cylinder data as well
          "Plate Number": carPlate,
        });

        navigate("/", { state: { carData } });
      } catch (error) {
        console.error(
          "Error fetching userId from AsyncStorage or posting car data:",
          error.message
        );
        toast.error("Error occurred. Please complete all fields before adding the car.");
      }
    } else {
      toast.error(
        "Invalid car plate number. Please enter 3 alphabets (English or Arabic) followed by 1 to 4 numbers."
      );
    }
  };

  useEffect(() => {
    const convertRawDataToFormatModal = async () => {
      const filteredData = adminCarsData.filter(
        (car) =>
          (car.carCompany === carType || car.carCompanyAr === carType) &&
          (car.carName === carCategory || car.carNameAr === carCategory)
      );
      const uniqueCarName = [
        ...new Set(filteredData.map((car) => car.carModal)),
      ];
      const formatedCarName = uniqueCarName.map((carModalDat) => ({
        title: carModalDat,
        value: carModalDat,
      }));
      setcarModals(formatedCarName);
    };
    if (carCategory?.length > 0 && carType?.length > 0) {
      convertRawDataToFormatModal();
    }
  }, [carCategory, adminCarsData, carType]);

  useEffect(() => {
    const convertRawDataToFormat = async () => {
      const uniqueCarName = [
        ...new Set(
          adminCarsData
            .filter(
              (car) =>
                car.carCompany === carType || car.carCompanyAr === carType
            )
            .map((car) => car.carName)
        ),
      ];
      const formatedCarName = uniqueCarName.map((company) => ({
        title: company,
        value: company,
      }));
      setcarModalNameArry(formatedCarName);
    };
    if (carType?.length > 0) {
      convertRawDataToFormat();
    }
  }, [carType, adminCarsData]);

  return (
    <>
      <div className="btn w-100 homeBtnMainDivWala mt-2">
        {textString.enterYourCarDataTxt}
      </div>
      <form onSubmit={addCarData} className="container my-5 enterCarData">
        <img src={articleImg} alt="enterData" />
        <select value={carType} onChange={(e) => setcarType(e.target.value)}>
          <option disabled value={""}>
            {textString.carTypeTxt}
          </option>
          {companiesData?.map((dat, index) => (
            <option key={index} value={dat?.value}>
              {dat?.title}
            </option>
          ))}
        </select>
        <select
          value={carCategory}
          onChange={(e) => setcarCategory(e.target.value)}
        >
          <option disabled value={""}>
            {textString.carCategTxt}
          </option>
          {carModalNameArry?.map((dat, index) => (
            <option key={index} value={dat?.value}>
              {dat?.title}
            </option>
          ))}
        </select>
        <select value={carModal} onChange={(e) => setcarModal(e.target.value)}>
          <option disabled value={""}>
            {textString.carModalTxt}
          </option>
          {carModals?.map((dat, index) => (
            <option key={index} value={dat?.value}>
              {dat?.title}
            </option>
          ))}
        </select>
        <input
          required
          minLength={4}
          maxLength={9}
          value={carPlate}
          placeholder="xxx1234 or x x x1234"
          onChange={(e) => setcarPlate(e.target.value)}
        />
        <input
          required
          type="number"
          value={cylinder}
          placeholder="Number of Cylinders"
          onChange={(e) => setCylinder(e.target.value)}
        />
        <button type="submit" className="lastBtn">
          {textString.addCarsTxt}
        </button>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </form>
    </>
  );
}

export default EnterCarDataPage;
