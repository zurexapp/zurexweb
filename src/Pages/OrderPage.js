import React, { useEffect } from "react";
import { Container, Card, Row, Col } from "react-bootstrap"; // Import Row and Col
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { getMYOrders } from "../DataBase/databaseFunction"; // Adjust the import based on your project structure
import { setOrders } from "../store/orderProcessSlice"; // Adjust the import based on your project structure
import OrderDetails from "./OrderDetails"; // Importing OrderDetails component
import { getTextString } from "../assets/TextStrings";

function OrderPage() {
  const dispatch = useDispatch();
  const { isArabicLanguage } = useSelector((state) => state.auth);
  const textString = getTextString(isArabicLanguage);
  const { orders } = useSelector((state) => state.orderProcess); // Assuming orders are stored in orderProcess state

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Retrieve userId from AsyncStorage
        const storedUserId = await AsyncStorage.getItem("userid");

        console.log("Fetching orders for userId:", storedUserId);
        if (storedUserId) {
          const fetchedOrders = await getMYOrders(storedUserId); // Fetch orders using stored userId
          console.log("Fetched orders:", fetchedOrders);
          dispatch(setOrders(fetchedOrders)); // Dispatch fetched orders to Redux store
        } else {
          console.log("User ID not available");
          // Handle scenario where user ID is not available
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Handle error fetching orders (e.g., show error message)
      }
    };

    fetchOrders(); // Fetch orders when component mounts
  }, [dispatch]); // Only dispatch as a dependency since userId is read from AsyncStorage

  return (
    <Container className="mt-4 d-flex flex-column min-vh-100">
      <h2 className="text-center mb-4">{textString.ordertTxt}</h2>
      <div className="flex-grow-1">
        {orders.length === 0 ? ( // Check if orders array is empty
          <p className="text-center">{textString.noordersTxt}</p>
        ) : (
          <Col className="justify-content-center">
          <Row> {/* Add Row to create a grid structure */}
            {orders.map((order) => (
              <Col xs={12} md={6} lg={6} xl={4} key={order.id} className="mb-4"  style={{ width: "100%" }}> {/* Adjust column sizes */}
              <Card >
                  <Card.Body>
                    <OrderDetails order={order} /> {/* Pass each order to OrderDetails component */}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        
        )}
      </div>
    </Container>
  );
}

export default OrderPage;




// import React, { useEffect } from "react";
// import { Container, Card } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
// import { getMYOrders } from "../DataBase/databaseFunction"; // Adjust the import based on your project structure
// import { setOrders } from "../store/orderProcessSlice"; // Adjust the import based on your project structure
// import OrderDetails from "./OrderDetails"; // Importing OrderDetails component
// // import { useNavigate } from "react-router-dom";
// import { getTextString } from "../assets/TextStrings";

// function OrderPage() {
//   const dispatch = useDispatch();
//   const { isArabicLanguage } = useSelector((state) => state.auth);
//   const textString = getTextString(isArabicLanguage);
//   const { orders } = useSelector((state) => state.orderProcess); // Assuming orders are stored in orderProcess state

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         // Retrieve userId from AsyncStorage
//         const storedUserId = await AsyncStorage.getItem("userid");

//         console.log("Fetching orders for userId:", storedUserId);
//         if (storedUserId) {
//           const fetchedOrders = await getMYOrders(storedUserId); // Fetch orders using stored userId
//           console.log("Fetched orders:", fetchedOrders);
//           dispatch(setOrders(fetchedOrders)); // Dispatch fetched orders to Redux store
//         } else {
//           console.log("User ID not available");
//           // Handle scenario where user ID is not available
//         }
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         // Handle error fetching orders (e.g., show error message)
//       }
//     };

//     fetchOrders(); // Fetch orders when component mounts
//   }, [dispatch]); // Only dispatch as a dependency since userId is read from AsyncStorage

//   return (
//     <Container className="mt-4">
//       <h2 className="text-center mb-4">{textString.ordertTxt}</h2>
//       {orders.length === 0 ? ( // Check if orders array is empty
//         <p>No orders found.</p>
//       ) : (
//         orders.map((order) => (
//           <Card key={order.id} className="mb-4">
//             <Card.Body>
//               <OrderDetails order={order} />{" "}
//               {/* Pass each order to OrderDetails component */}
//             </Card.Body>
//           </Card>
//         ))
//       )}
//     </Container>
//   );
// }

// export default OrderPage;
