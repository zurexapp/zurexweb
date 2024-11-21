import React from "react";
import carGif from "../assets/cargif.png"; // Make sure to place your car GIF in the correct folder

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <img src={carGif} alt="Loading..." className="w-20 h-20" />
    </div>
  );
};

export default Loader;
