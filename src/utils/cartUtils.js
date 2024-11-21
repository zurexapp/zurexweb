import AsyncStorage from "@react-native-async-storage/async-storage";
import { toast } from "react-toastify";
import { setCartItems } from "../store/authSlice";
import { textString } from "../assets/TextStrings";
import tyreImage from "../assets/tyre.png";
import oilImage from "../assets/oil.png";
import logo from "../assets/logo.png";
import batteryImage from "../assets/battery.png";

export const addToCart = async (
  productData,
  itemTotal,
  cartItems,
  dispatch,
  navigate
) => {
  const newCartItems =
    cartItems?.length > 0
      ? [
          ...cartItems,
          {
            referance: productData?.referance,
            quantity: itemTotal,
            id: productData?.id,
          },
        ]
      : [
          {
            referance: productData?.referance,
            quantity: itemTotal,
            id: productData?.id,
          },
        ];

  await AsyncStorage.setItem(
    "ac_Zurex_client_cart",
    JSON.stringify(newCartItems)
  );
  window.webengage.track("Added To Cart", {
    "product name": productData?.productNameEng,
    Category: productData?.referance, // Assuming 'referance' contains the category info
    Currency: productData?.currency, // Replace with appropriate data or variable
    Price: productData?.originalPrice,
    "Product ID": productData?.id,
    "Brand Name": productData?.productNameEng,
    Quantity: itemTotal,
    Image: productData?.image ? [productData?.image] : [""],
  });

  dispatch(setCartItems({ cartItems: newCartItems }));
  navigate("/cart");
  toast.success("Product added to Cart");
};

export const removeFromCart = async (
  indexId,
  cartItems,
  dispatch,
  filteredDataFun
) => {
  trackRemovedProduct(indexId, cartItems, filteredDataFun);
  const newCartItems = cartItems?.filter((dat, ind) => ind !== indexId);
  await AsyncStorage.setItem(
    "ac_Zurex_client_cart",
    JSON.stringify(newCartItems)
  );
  dispatch(setCartItems({ cartItems: newCartItems }));

  toast.success("Product removed from Cart");
};

const trackRemovedProduct = (indexId, cartItems, filteredDataFun) => {
  if (indexId >= 0) {
    const productData = cartItems?.map((dat, index) =>
      filteredDataFun(dat.id, dat.referance)
    )[indexId];

    const image =
      productData.referance === "Filters" || productData.referance === "Oils"
        ? oilImage
        : productData.referance === "btteries"
        ? batteryImage
        : productData.referance === "Tyres"
        ? tyreImage
        : logo;

    window.webengage.track("Remove from cart", {
      "product name": productData?.productNameEng,
      Category: productCat(productData),
      Currency: textString.currencyTxt,
      Price: productData?.originalPrice,
      "Product ID": productData?.id,
      Product: productData?.productNameEng,
      "Brand Name": productData?.productNameEng,
      Quantity: cartItems[indexId]?.quantity,
      Image: image?.includes("http")
        ? [image]
        : [`${window.location.origin}${image}`],
    });
  }
};

const productCat = (data) => {
  return data?.referance?.toLowerCase()?.includes("oils") ||
    data?.referance?.toLowerCase()?.includes("filters")
    ? textString.oilFilterTxt
    : data?.referance?.toLowerCase()?.includes("btteries")
    ? textString.batteryTxt
    : data?.referance?.toLowerCase()?.includes("tyres")
    ? textString.tireTxt
    : "";
};

export const clearCart = async (dispatch) => {
  try {
    await AsyncStorage.removeItem("ac_Zurex_client_cart");
    dispatch(setCartItems({ cartItems: [] }));
  } catch (error) {
    console.error("Error clearing cart:", error);
    toast.error("Failed to clear cart");
  }
};
