import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderProcessName: "",
  enableCardData: false,
  curentOrderProductData: {},
  checkOutData: null,
  orders: [], // Ensure orders is initialized as an empty array
};

export const orderProcessSlice = createSlice({
  name: "orderProcess",
  initialState,
  reducers: {
    setOrderProcessName: (state, action) => {
      if (
        action.payload.orderProcessName === null ||
        action.payload.orderProcessName === undefined ||
        action.payload.orderProcessName?.length <= 0
      ) {
        state.orderProcessName = "";
      } else {
        state.orderProcessName = action.payload.orderProcessName;
      }
    },
    setCurentOrderProductData: (state, action) => {
      if (
        action.payload.curentOrderProductData === null ||
        action.payload.curentOrderProductData === undefined ||
        action.payload.curentOrderProductData?.length <= 0
      ) {
        state.curentOrderProductData = {};
      } else {
        state.curentOrderProductData = action.payload.curentOrderProductData;
      }
    },
    setCheckOutData: (state, action) => {
      if (
        action.payload.checkOutData === null ||
        action.payload.checkOutData === undefined ||
        action.payload.checkOutData?.length <= 0
      ) {
        state.checkOutData = null;
      } else {
        state.checkOutData = action.payload.checkOutData;
      }
    },
    setEnableCardData: (state, action) => {
      if (
        action.payload.enableCardData === null ||
        action.payload.enableCardData === undefined ||
        action.payload.enableCardData?.length <= 0
      ) {
        state.enableCardData = false;
      } else {
        state.enableCardData = action.payload.enableCardData;
  
      }
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
  },
});


export const {
  setOrderProcessName,
  setEnableCardData,
  setCurentOrderProductData,
  setCheckOutData,
  setOrders, // Export setOrders action
} = orderProcessSlice.actions;

export default orderProcessSlice.reducer;
