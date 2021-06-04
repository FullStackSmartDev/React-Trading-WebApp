import Chart from "./Chart";
import React, { useEffect, useState } from "react";
import { getStockQuotesSeries } from "./Utils";
import SingleChoice from "./SingleChoice";
import options from "./IntervalOptions";
import { useLocation, useRouteMatch, useHistory } from "react-router-dom";

const StaticChart = (props) => {
  const type = "candlestick";
  const [series, setSeries] = useState([{ data: [] }]);
  const [zoomedOut, setZoomedOut] = useState(false);
  const [interval, setInterval] = useState(props.interval);

  const routeMatch = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    if (routeMatch.path === "/pro-scans/:scan/stock/:symbol/:interval") {
      console.log("updating url");
      history.push(
        [...routeMatch.url.split("/").slice(0, -1), interval].join("/")
      );
    }
  }, [interval]);

  useEffect(() => {
    setInterval(props.interval);
  }, [props.interval]);

  useEffect(() => {
    getStockQuotesSeries(props.symbol, interval, (series) => {
      console.log("updating");
      console.log(series);
      setSeries([{ data: series[0].data.slice(-500) }]);
    });
  }, [props.symbol, interval]);

  return (
    <div
      onDoubleClick={() => {
        setZoomedOut(true);
      }}
    >
      {props.intervalSelector ? (
        <SingleChoice
          options={options}
          default={props.interval}
          onSelectionChange={(newInterval) => setInterval(newInterval)}
        />
      ) : null}
      <Chart
        series={series}
        type={type}
        symbol={props.symbol}
        tooltip={props.tooltip}
        height={props.height}
        zoomedOut={zoomedOut}
      />
    </div>
  );
};

export default StaticChart;
