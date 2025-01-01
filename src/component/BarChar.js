import React, { useContext } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import { UserContext } from "./Context";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Barchart = () => {
  const { authorvalue } = useContext(UserContext);

  // Default dataPoints to prevent the chart from being empty
 

  // Use `authorvalue` if it exists and has entries; otherwise, use defaultDataPoints
  const dataPoints =
    authorvalue && Object.keys(authorvalue).length > 0
      ? Object.entries(authorvalue).map(([key, value]) => ({ label: key, y: value }))
      : [];

  const options = {
    title: {
      text: `${authorvalue.length ? "Basic Column Chart" : "No News is Got Read"}`,
    },
    data: [
      {
        type: "column",
        dataPoints: dataPoints, // Use the resolved dataPoints
      },
    ],
  };

  return (
    <div>
      <CanvasJSChart options={options} />
    </div>
  );
};

export default Barchart;
