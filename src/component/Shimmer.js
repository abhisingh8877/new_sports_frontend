import React from "react";
import '../Styles/Shimmer.css'; // Make sure to create and import the CSS for the shimmer

const Shimmer = () => {
  return (
    <div className="shimmer-container">
      <div className="shimmer-box"></div>
      <div className="shimmer-box"></div>
      <div className="shimmer-box"></div>
    </div>
  );
};

export default Shimmer;