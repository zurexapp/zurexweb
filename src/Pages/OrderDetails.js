import React, { useEffect, useState } from "react";
import { Card, Table } from "react-bootstrap";
import { getOrderDetails } from "../DataBase/databaseFunction"; // Ensure this import is correct based on your project structure

const OrderDetails = ({ order }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const productDetails = await Promise.all(
        order.products.map(async (product) => {
          try {
            const productNameEng = await getOrderDetails(
              product.referance,
              product.id
            );
            if (productNameEng) {
              return { ...product, productNameEng };
            } else {
              console.error(
                `Product not found for ID: ${product.id} from reference: ${product.referance}`
              );
              return { ...product, productNameEng: "Unknown Product" };
            }
          } catch (error) {
            console.error(
              `Error fetching product with ID: ${product.id} from reference: ${product.referance}`
            );
            return { ...product, productNameEng: "Unknown Product" };
          }
        })
      );

      setProducts(productDetails);
    };

    if (order && order.products) {
      fetchProductDetails();
    }
  }, [order]);

  if (!order) return null;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div>
      <Card.Title>Order #{order.id}</Card.Title>
      <Card.Text>
        <strong>Order Date:</strong> {formatDate(order.createdAt)}
      </Card.Text>
      {order.totalPrice !== undefined && (
        <Card.Text>
          <strong>Total Price:</strong> {order.totalPrice.toFixed(2)} SAR
        </Card.Text>
      )}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ width: "80%" }}>Product Name</th>
            <th style={{ width: "20%" }}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.productNameEng}</td>
              <td>{product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderDetails;