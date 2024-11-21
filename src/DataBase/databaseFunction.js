import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/database";
import "firebase/compat/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBE6fAhJo-lQvWmY_dQRveoN1mULHhHO-Y",
  authDomain: "aczurex-d4b61.firebaseapp.com",
  databaseURL: "https://aczurex-d4b61-default-rtdb.firebaseio.com",
  projectId: "aczurex-d4b61",
  storageBucket: "aczurex-d4b61.appspot.com",
  messagingSenderId: "31992218561",
  appId: "1:31992218561:web:4a78b4751dfe5cf1562540",
  measurementId: "G-99S7QS47T7",
};

firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const database = firebase.database();
const auth = firebase.auth();
const nonAuth = firebase.auth;

const postDataWithRef = async (collection, docRef, data) => {
  try {
    const value = await database.ref(`/${collection}/${docRef}`).set(data);
    return value;
  } catch (error) {
    console.error('Error posting data to Firebase:', error);
    throw error;
  }
};

const logAnalyticsEvent = (eventName, eventParams) => {
  if (analytics) {
    analytics.logEvent(eventName, eventParams);
    console.log(`Logged Firebase Analytics event: ${eventName}`, eventParams);
  } else {
    console.error("Firebase Analytics is not initialized.");
  }
};

const pushDataWithRef = (collection, docRef, data) => {
  const value = database.ref(`/${collection}/${docRef}`).push({
    ...data,
  });
  return value;
};

const getMyCars = async (userid) => {
  // console.log(userid);
  let result = await database
    .ref("userManualCars")
    .orderByChild("userId")
    .equalTo(userid)
    .once("value")
    .then((onSnapshot) => {
      return onSnapshot.val();
    });
  if (result) {
    let returnArr = [];
    Object.entries(result).forEach((dat) => {
      returnArr.push({ id: dat[0], ...dat[1] });
    });
    console.log("Cars for user with id", userid, ":", returnArr);

    return returnArr;
  } else {
    return [];
  }
};

const checkIsUserExist = async (phone) => {
  let result = await database
    .ref("/user/")
    .orderByChild("phoneNumber")
    .equalTo(`${phone}`)
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userId = Object.keys(snapshot.val())[0];
        const data = Object.values(snapshot.val())[0];
        return { userId, ...data };
      } else {
        return null;
      }
    });
  return result;
};
const checkIsOrderExist = async (id) => {
  try {
    const snapshot = await database.ref(`/orders/${id}`).once("value");
    if (snapshot.exists()) {
      const orderData = snapshot.val();
      return { ...orderData, id: id };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error checking order existence:", error);
    return null;
  }
};

const postData = async (collection, data) => {
  const newReference = database.ref(`${collection}`).push();
  await newReference.set({
    ...data,
  });
  return newReference?.key;
};
const getDataWithRef = async (collection, docRef) => {
  const value = await database
    .ref(`/${collection}/${docRef}`)
    .once("value", (snapshot) => {
      return { ...snapshot.val(), userId: docRef };
    });
  return value;
};

const getOrderDetails = async (collection, docRef) => {
  const snapshot = await database.ref(`/${collection}/${docRef}`).once("value");
  const data = snapshot.val();
  return data ? data.productNameEng : null;
};

const postUserDataWithId = async (id, data) => {
  const value = database.ref(`/user/${id}`).update({ ...data });
  return value;
};
const UpdateOrderWithId = async (id, data) => {
  return await database.ref(`/orders/${id}`).update({ ...data });
};
const getDataWholeCollection = async (collection) => {
  const value = await database
    .ref(`/${collection}`)
    .once("value", (onSnapshot) => {
      return onSnapshot.val();
    });
  let returnArr = [];

  value.forEach((childSnapshot) => {
    let item = childSnapshot.val();
    item.id = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};
const removeData = async (collection, docRef) => {
  return await database.ref(`/${collection}/${docRef}`).remove();
};

const getMYOrders = async (userId) => {
  try {
    const snapshot = await database
      .ref("orders")
      .orderByChild("OrderedByUserId")
      .equalTo(userId)
      .once("value");

    if (snapshot.exists()) {
      const ordersData = snapshot.val();
      // Convert Firebase object to array of orders with IDs
      const ordersArray = Object.keys(ordersData).map((orderId) => ({
        id: orderId,
        ...ordersData[orderId],
      }));
      console.log("Fetched orders:", ordersArray);
      return ordersArray;
    } else {
      console.log("No orders found for userId:", userId);
      return []; // Return empty array if no orders found
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; // Throw error for handling in calling function
  }
};
const getMYServicesReq = async (userid) => {
  let result = await database
    .ref("supportOrders")
    .orderByChild("OrderedByUserId")
    .equalTo(`${userid}`)
    .once("value")
    .then((onSnapshot) => {
      return onSnapshot.val();
    });
  let returnArr = [];
  Object.entries(result).forEach((dat) => {
    returnArr.push({ id: dat[0], ...dat[1] });
  });
  return returnArr;
};
const getChildNodeCount = async (collection) => {
  const snapshot = await database.ref(`/${collection}`).once("value");
  return snapshot.numChildren();
};
const filterProductWithCar = async (data, carName) => {
  console.log(carName);
  const filterDataByCar = data.filter(
    dat =>
      dat?.suitableVehicles?.filter(
        duc =>
          `${duc?.carCompany} ${duc?.carName} ${duc?.carModal}`.toLowerCase() ===
            `${carName}`?.toLowerCase() ||
          `${duc?.carCompanyAr} ${duc?.carNameAr} ${duc?.carModal}` ===
            `${carName}`,
      )?.length > 0,
  );
  // console.log(filterDataByCar?.map(dat => dat?.suitableVehicles));
  return {
    status: filterDataByCar?.length > 0 ? 'filtred' : 'original',
    data: filterDataByCar?.length > 0 ? filterDataByCar : [],
  };
};

const storeWebhookData = async (webhookData) => {
  try {
    const ref = database.ref('/webhookData');
    await ref.push(webhookData);
    console.log('Webhook data stored successfully');
  } catch (error) {
    console.error('Error storing webhook data:', error);
  }
};

const getBookedTimeSlotsByDate = async (date, orderProcessName) => {
  try {
    const snapshot = await database.ref('orders')
      .orderByChild('appointment/date')
      .equalTo(date)
      .once('value');
    
    const result = snapshot.val();
    console.log("Raw Database Result:", result); // Check the raw data from Firebase
    
    if (result) {
      let returnArr = [];
      Object.entries(result).forEach(([key, value]) => {
        if (value.orderProcessName === orderProcessName) {
          returnArr.push(value.appointment.time);
        }
      });
      return returnArr;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching booked time slots:", error);
    return [];
  }
};


const getEmployDataWithJobrole = async (role) => {
  try {
    const ref = database.ref('/employ');
    const snapshot = await ref.orderByChild('role').equalTo(role).once('value');
    if (snapshot.exists()) {
      const data = snapshot.val();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const fetchOrderById = async (orderId) => {
  try {
    const snapshot = await database.ref(`/orders/${orderId}`).once("value");
    if (snapshot.exists()) {
      const orderData = snapshot.val();
      return { ...orderData, id: orderId };
    } else {
      console.log("Order not found for ID:", orderId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw error; // Propagate error for handling in the calling function
  }
};

const getPaymentStatusByOrderId = async (orderId) => {
  try {
    console.log("Fetching payment status for order ID:", orderId);
    
    // Fetch data from Firebase
    const snapshot = await database.ref('orderPayments').once('value');
    const result = snapshot.val();
    
    console.log("Order payment status from database:", result);

    if (result) {
      let returnArr = [];
      // Iterate through the entries and filter by orderId
      Object.entries(result).forEach(([key, value]) => {
        if (value.orderId === orderId) {
          returnArr.push({ id: key, ...value });
        }
      });
      return returnArr;
    } else {
      console.log("No data found for the given order ID.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching payment status:", error);
    throw new Error("Failed to fetch payment status");
  }
};



export {
  filterProductWithCar,
  nonAuth,
  auth,
  logAnalyticsEvent,
  postDataWithRef,
  getDataWithRef,
  getDataWholeCollection,
  postData,
  removeData,
  checkIsUserExist,
  postUserDataWithId,
  getMYOrders,
  UpdateOrderWithId,
  checkIsOrderExist,
  getMYServicesReq,
  getOrderDetails,
  getChildNodeCount,
  getMyCars,
  pushDataWithRef,
  storeWebhookData,
  getBookedTimeSlotsByDate,
  getEmployDataWithJobrole,
fetchOrderById,
getPaymentStatusByOrderId,
};
