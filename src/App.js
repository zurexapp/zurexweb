// import TopBar from "./Components/TopBar/TopBar";
// import FileRoutesNav from "./Navigation/FileRoutesNav";
// import FooterBar from "./Components/FooterBar/FooterBar";
// import { useEffect } from "react";
// import logo from "./assets/main-gift.gif";
// import {
//   checkIsUserExist,
//   getDataWholeCollection,
//   getMYServicesReq,
// } from "./DataBase/databaseFunction";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setAdminCarsData,
//   setBatteryCompaniesData,
//   setBatteryData,
//   setClientBanners,
//   setClientCarsData,
//   setClientReviews,
//   setEngineOilsData,
//   setFiltersDta,
//   setMySupportServicesData,
//   setOilCompaniesData,
//   setOilsData,
//   setEngineOilPetrolData,
//   setSupportServicesData,
//   setTireCompaniesData,
//   setTireData,
// } from "./store/projectSlice";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   setAuth,
//   setCartItems,
//   setFavoriteItems,
//   setIsLoading,
// } from "./store/authSlice";
// import { ToastContainer } from "react-toastify";
// function App() {
//   const dispatch = useDispatch();
//   const { isLoading } = useSelector((state) => state.auth);
//   console.log(isLoading);
//   useEffect(() => {
//     const fetchAccountData = async () => {
//       const asyncCartItem = await AsyncStorage.getItem("ac_Zurex_client_cart");
//       const asyncFavoriteItem = await AsyncStorage.getItem(
//         "ac_Zurex_client_favorite"
//       );
//       const userAddedCars = await AsyncStorage.getItem(
//         "ac-zurex-client-web-cars"
//       );

//       const phoneNumber = await AsyncStorage.getItem("ac_zurex_web_client");
//       const banners = await getDataWholeCollection("webClientsBanner");
//       const reviews = await getDataWholeCollection("webReview");

//       if (asyncCartItem) {
//         dispatch(setCartItems({ cartItems: JSON.parse(asyncCartItem) }));
//       }
//       if (asyncFavoriteItem) {
//         dispatch(
//           setFavoriteItems({ favoriteItems: JSON.parse(asyncFavoriteItem) })
//         );
//       }
//       if (userAddedCars) {
//         dispatch(setClientCarsData({ clientCarsData: userAddedCars }));
//       }
//       if (reviews) {
//         dispatch(setClientReviews({ clientReviews: reviews }));
//       }
//       if (banners) {
//         dispatch(setClientBanners({ clientBanners: banners }));
//       }
//       if (phoneNumber) {
//         await checkIsUserExist(`${phoneNumber}`)
//           .then(async (dat) => {
//             dispatch(setAuth({ isAuth: dat }));
//             const data = await getMYServicesReq(dat.userId);
//             if (data?.length > 0) {
//               dispatch(
//                 setMySupportServicesData({ mySupportServicesData: data })
//               );
//             }
//           })
//           .catch((e) => {
//             console.log(e);
//           });
//       }
//     };
//     const getAllOtherData = async () => {
//       dispatch(setIsLoading());
//       await fetchAccountData();
//       const BatteryCompanies = await getDataWholeCollection("BatteryCompanies");
//       dispatch(
//         setBatteryCompaniesData({
//           batteryCompaniesData: BatteryCompanies?.map((dat) => {
//             return { ...dat, referance: "BatteryCompanies" };
//           }),
//         })
//       );
//       const filters = await getDataWholeCollection("Filters");
//       dispatch(
//         setFiltersDta({
//           filtersData: filters?.map((dat) => {
//             return { ...dat, referance: "Filters" };
//           }),
//         })
//       );
//       const OilCompanies = await getDataWholeCollection("OilCompanies");
//       dispatch(
//         setOilCompaniesData({
//           oilCompaniesData: OilCompanies?.map((dat) => {
//             return { ...dat, referance: "OilCompanies" };
//           }),
//         })
//       );
      
//       const Oils = await getDataWholeCollection("Oils");
//       dispatch(
//         setOilsData({
//           oilsData: Oils?.map((dat) => {
//             return { ...dat, referance: "Oils" };
//           }),
//         })
//       );


//       const engineOils = await getDataWholeCollection("engineOil");
//       dispatch(
//         setEngineOilsData({
//           engineOilsData: engineOils?.map((dat) => {
//             return { ...dat, referance: "engineOil" };
//           }),
//         })
//       );
//       const engineOilPetrol = await getDataWholeCollection("engineOilPetrol");
//       dispatch(
//         setEngineOilPetrolData({
//           engineOilPetrolData: engineOilPetrol?.map((dat) => {
//             return { ...dat, referance: "engineOilPetrol" };
//           }),
//         })
//       );
//       const TireCompanies = await getDataWholeCollection("TireCompanies");
//       dispatch(
//         setTireCompaniesData({
//           tireCompaniesData: TireCompanies?.map((dat) => {
//             return { ...dat, referance: "TireCompanies" };
//           }),
//         })
//       );
//       const Tyres = await getDataWholeCollection("Tyres");
//       dispatch(
//         setTireData({
//           tireData: Tyres?.map((dat) => {
//             return { ...dat, referance: "Tyres" };
//           }),
//         })
//       );
//       const btteries = await getDataWholeCollection("btteries");
//       dispatch(
//         setBatteryData({
//           batteryData: btteries?.map((dat) => {
//             return { ...dat, referance: "btteries" };
//           }),
//         })
//       );
//       const support = await getDataWholeCollection("SupportServices");
//       const adminCarsData = await getDataWholeCollection("adminCarsData");
//       dispatch(setAdminCarsData({ adminCarsData: adminCarsData }));

//       dispatch(
//         setSupportServicesData({
//           supportServicesData: support?.map((dat) => {
//             return { ...dat, referance: "SupportServices" };
//           }),
//         })
//       );
//       dispatch(setIsLoading());
//     };
//     getAllOtherData();
//   }, [dispatch]);
//   return (
//     <>
//       {!isLoading ? (
//         <>
//           <TopBar />
//           <FileRoutesNav />
//           <FooterBar />
//         </>
//       ) : (
//         <div
//           className="d-flex align-items-center justify-content-center"
//           style={{ width: "100%", height: "100vh", background: "#ffffff" }}
//         >
//           <img
//             style={{ height: "230px", objectFit: "contain" }}
//             src={logo}
//             alt="logo"
//           />
//         </div>
//       )}
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//     </>
//   );
// }

// export default App;





import TopBar from "./Components/TopBar/TopBar";
import FileRoutesNav from "./Navigation/FileRoutesNav";
import FooterBar from "./Components/FooterBar/FooterBar";
import { useEffect } from "react";
import logo from "./assets/main-gift.gif";
import {
  checkIsUserExist,
  getDataWholeCollection,
  getMYServicesReq,
  logAnalyticsEvent,
} from "./DataBase/databaseFunction";
import { useDispatch, useSelector } from "react-redux";
import {
  setAdminCarsData,
  setBatteryCompaniesData,
  setBatteryData,
  setClientBanners,
  setClientCarsData,
  setClientReviews,
  setEngineOilsData,
  setFiltersDta,
  setMySupportServicesData,
  setOilCompaniesData,
  setOilsData,
  setEngineOilPetrolData,
  setSupportServicesData,
  setTireCompaniesData,
  setTireData,
} from "./store/projectSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setAuth,
  setCartItems,
  setFavoriteItems,
  setIsLoading,
} from "./store/authSlice";
import { ToastContainer } from "react-toastify";

function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  console.log(isLoading);

  useEffect(() => {
    if (window.webengage && window.webengage.track) {
      window.webengage.track("Page Load Test Event", { message: "WebEngage is working!" });
      console.log("WebEngage test event sent");
    } else {
      console.error("WebEngage not initialized");
    }
  }, []);
  

  // change
  useEffect(() => {
    const fetchAccountData = async () => {
      const [
        asyncCartItem,
        asyncFavoriteItem,
        userAddedCars,
        phoneNumber,
        banners,
        reviews,
      ] = await Promise.all([
        AsyncStorage.getItem("ac_Zurex_client_cart"),
        AsyncStorage.getItem("ac_Zurex_client_favorite"),
        AsyncStorage.getItem("ac-zurex-client-web-cars"),
        AsyncStorage.getItem("ac_zurex_web_client"),
        getDataWholeCollection("webClientsBanner"),
        getDataWholeCollection("webReview"),
      ]);

      if (asyncCartItem) {
        dispatch(setCartItems({ cartItems: JSON.parse(asyncCartItem) }));
      }
      if (asyncFavoriteItem) {
        dispatch(
          setFavoriteItems({ favoriteItems: JSON.parse(asyncFavoriteItem) })
        );
      }
      if (userAddedCars) {
        dispatch(setClientCarsData({ clientCarsData: userAddedCars }));
      }
      if (reviews) {
        dispatch(setClientReviews({ clientReviews: reviews }));
      }
      if (banners) {
        dispatch(setClientBanners({ clientBanners: banners }));
      }
      if (phoneNumber) {
        try {
          const dat = await checkIsUserExist(`${phoneNumber}`);
          dispatch(setAuth({ isAuth: dat }));
          const services = await getMYServicesReq(dat.userId);
          if (services?.length > 0) {
            dispatch(setMySupportServicesData({ mySupportServicesData: services }));
          }
        } catch (e) {
          console.log(e);
        }
      }
    };
    // change

    const getAllOtherData = async () => {
      dispatch(setIsLoading());

      // Fetch account data and all collections in parallel
      await fetchAccountData();

      const [
        BatteryCompanies,
        filters,
        OilCompanies,
        Oils,
        engineOils,
        engineOilPetrol,
        TireCompanies,
        Tyres,
        btteries,
        support,
        adminCarsData,
      ] = await Promise.all([
        getDataWholeCollection("BatteryCompanies"),
        getDataWholeCollection("Filters"),
        getDataWholeCollection("OilCompanies"),
        getDataWholeCollection("Oils"),
        getDataWholeCollection("engineOil"),
        getDataWholeCollection("engineOilPetrol"),
        getDataWholeCollection("TireCompanies"),
        getDataWholeCollection("Tyres"),
        getDataWholeCollection("btteries"),
        getDataWholeCollection("SupportServices"),
        getDataWholeCollection("adminCarsData"),
      ]);

      // Dispatch the fetched data
      dispatch(
        setBatteryCompaniesData({
          batteryCompaniesData: BatteryCompanies?.map((dat) => ({
            ...dat,
            referance: "BatteryCompanies",
          })),
        })
      );
      dispatch(
        setFiltersDta({
          filtersData: filters?.map((dat) => ({
            ...dat,
            referance: "Filters",
          })),
        })
      );
      dispatch(
        setOilCompaniesData({
          oilCompaniesData: OilCompanies?.map((dat) => ({
            ...dat,
            referance: "OilCompanies",
          })),
        })
      );
      dispatch(
        setOilsData({
          oilsData: Oils?.map((dat) => ({
            ...dat,
            referance: "Oils",
          })),
        })
      );
      dispatch(
        setEngineOilsData({
          engineOilsData: engineOils?.map((dat) => ({
            ...dat,
            referance: "engineOil",
          })),
        })
      );
      dispatch(
        setEngineOilPetrolData({
          engineOilPetrolData: engineOilPetrol?.map((dat) => ({
            ...dat,
            referance: "engineOilPetrol",
          })),
        })
      );
      dispatch(
        setTireCompaniesData({
          tireCompaniesData: TireCompanies?.map((dat) => ({
            ...dat,
            referance: "TireCompanies",
          })),
        })
      );
      dispatch(
        setTireData({
          tireData: Tyres?.map((dat) => ({
            ...dat,
            referance: "Tyres",
          })),
        })
      );
      dispatch(
        setBatteryData({
          batteryData: btteries?.map((dat) => ({
            ...dat,
            referance: "btteries",
          })),
        })
      );
      dispatch(
        setSupportServicesData({
          supportServicesData: support?.map((dat) => ({
            ...dat,
            referance: "SupportServices",
          })),
        })
      );
      dispatch(setAdminCarsData({ adminCarsData }));
      dispatch(setIsLoading());
    };
// Log the first open event
const analyticsEventData = {}; // Define your event data here
logAnalyticsEvent("web_First_open", analyticsEventData);

    getAllOtherData();
  }, [dispatch]);

  return (
    <>
      {!isLoading ? (
        <>
          <TopBar />
          <FileRoutesNav />
          <FooterBar />
        </>
      ) : (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ width: "100%", height: "100vh", background: "#ffffff" }}
        >
          <img
            style={{ height: "230px", objectFit: "contain" }}
            src={logo}
            alt="logo"
          />
        </div>
      )}
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
        theme="colored"
      />
    </>
  );
}

export default App;
