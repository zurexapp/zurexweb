import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filtersData: [],
  oilCompaniesData: [],
  oilsData: [],
  tireCompaniesData: [],
  tireData: [],
  engineOilsData: [], // Make sure this is included in the initialState
  batteryData: [],
  

  batteryCompaniesData: [],
  myOrdersData: [],
  supportServicesData: [],
  mySupportServicesData: [],
  clientCarsData: [],
  clientBanners: [],
  clientReviews: [],
  adminCarsData: [],
  engineOilData: [],
  engineOilPetrolData: [],
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setEngineOilsData: (state, action) => {
      if (action.payload.engineOilsData === null) {
        state.engineOilsData = [];
      } else {
        state.engineOilsData = action.payload.engineOilsData;
      }
    },
    setEngineOilData: (state, action) => {
      if (action.payload.engineOilData === null) {
        state.engineOilData = [];
      } else {
        state.engineOilData = action.payload.engineOilData;
      }
    },
    setEngineOilPetrolData: (state, action) => {
      if (action.payload.engineOilPetrolData === null) {
        state.engineOilPetrolData = [];
      } else {
        state.engineOilPetrolData = action.payload.engineOilPetrolData;
      }
    },
    setFiltersDta: (state, action) => {
      if (action.payload.filtersData === null) {
        state.filtersData = [];
      } else {
        state.filtersData = action.payload.filtersData;
      }
    },
    setOilCompaniesData: (state, action) => {
      if (action.payload.oilCompaniesData === null) {
        state.oilCompaniesData = [];
      } else {
        state.oilCompaniesData = action.payload.oilCompaniesData;
      }
    },
    setOilsData: (state, action) => {
      if (action.payload.oilsData === null) {
        state.oilsData = [];
      } else {
        state.oilsData = action.payload.oilsData;
      }
    },
    setTireCompaniesData: (state, action) => {
      if (action.payload.tireCompaniesData === null) {
        state.tireCompaniesData = [];
      } else {
        state.tireCompaniesData = action.payload.tireCompaniesData;
      }
    },
    setTireData: (state, action) => {
      if (action.payload.tireData === null) {
        state.tireData = [];
      } else {
        state.tireData = action.payload.tireData;
      }
    },
    setBatteryData: (state, action) => {
      if (action.payload.batteryData === null) {
        state.batteryData = [];
      } else {
        state.batteryData = action.payload.batteryData;
      }
    },
    setBatteryCompaniesData: (state, action) => {
      if (action.payload.batteryCompaniesData === null) {
        state.batteryCompaniesData = [];
      } else {
        state.batteryCompaniesData = action.payload.batteryCompaniesData;
      }
    },
    setAdminCarsData: (state, action) => {
      if (action.payload.adminCarsData === null) {
        state.adminCarsData = [];
      } else {
        state.adminCarsData = action.payload.adminCarsData;
      }
    },
    setMyOrdersData: (state, action) => {
      if (action.payload.myOrdersData === null) {
        state.myOrdersData = [];
      } else {
        state.myOrdersData = action.payload.myOrdersData;
      }
    },
    setSupportServicesData: (state, action) => {
      if (action.payload.supportServicesData === null) {
        state.supportServicesData = [];
      } else {
        state.supportServicesData = action.payload.supportServicesData;
      }
    },
    setMySupportServicesData: (state, action) => {
      if (action.payload.mySupportServicesData === null) {
        state.mySupportServicesData = [];
      } else {
        state.mySupportServicesData = action.payload.mySupportServicesData;
      }
    },
    setClientCarsData: (state, action) => {
      if (action.payload.clientCarsData === null) {
        state.clientCarsData = [];
      } else {
        state.clientCarsData = action.payload.clientCarsData;
      }
    },
    setClientBanners: (state, action) => {
      if (action.payload.clientBanners === null) {
        state.clientBanners = [];
      } else {
        state.clientBanners = action.payload.clientBanners;
      }
    },
    setClientReviews: (state, action) => {
      if (action.payload.clientReviews === null) {
        state.clientReviews = [];
      } else {
        state.clientReviews = action.payload.clientReviews;
      }
    },
  },
});

export const {
  setEngineOilsData,
  setBatteryData,
  setFiltersDta,
  setOilCompaniesData,
  setOilsData,
  setTireCompaniesData,
  setTireData,
  setBatteryCompaniesData,
  setMyOrdersData,
  setSupportServicesData,
  setMySupportServicesData,
  setClientCarsData,
  setClientBanners,
  setClientReviews,
  setAdminCarsData,
  setEngineOilData,
  setEngineOilPetrolData,
} = projectSlice.actions;

export default projectSlice.reducer;
