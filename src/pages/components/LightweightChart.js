import React, { useEffect, useRef, useState } from "react";

import ApiClient from "../ApiClient";
import { createChart } from "lightweight-charts";

const LightWeightChart = (props) => {
  const { symbol, interval, range, height, width, name } = props;
  const [data, setData] = useState();
  const [chart, setChart] = useState();
  const [chartDimensions, setChartDimensions] = useState({ height, width });
  const [series, setSeries] = useState({ candlestick: null, volume: null });
  const containerRef = useRef();
  const intervalMap = {
    d: "1d",
    D: "1d",
    W: "1wk",
    M: "1mo"
  };

  useEffect(() => {
    window.addEventListener("resize", () => {
      try {
        const width = containerRef.current.clientWidth;
        const height = width / 1.618;
        console.log("height", height, "width", width);
        chart.resize(width, height);
      } catch (e) {}
    });
  });

  useEffect(() => {
    if (chart !== undefined) {
      const width = containerRef.current.clientWidth;
      const height = width / 1.618;
      chart.resize(width, height);
    }
  }, [containerRef.current, width, height, chart]);

  useEffect(() => {
    let start, end, months;
    start = end = months = null;
    console.log("range is,", range);
    months = parseInt(/(\d+)m/.exec(range)[1]);

    const _dateToIsoDate = (date) => date.toISOString().split("T")[0];

    end = new Date();
    start = new Date(end - months * 30 * 24 * 60 * 60 * 1000);
    end = new Date(end.getTime() + 3 * 24 * 60 * 60 * 1000);

    ApiClient.get(
      `/quotes?symbol=${symbol}&interval=${
        intervalMap[interval]
      }&start=${_dateToIsoDate(start)}&end=${_dateToIsoDate(end)}&latest=1`
    )
      .then((res) => res.data)
      .then((data) => {
        // console.log(
        //   `/quotes?symbol=${symbol}&interval=${
        //     intervalMap[interval]
        //   }&start=${_dateToIsoDate(start)}&end=${_dateToIsoDate(end)}&latest=1`
        // );
        setData(
          data.values.map((val) => {
            const [time, open, high, low, close, volume] = val;
            return {
              open,
              high,
              low,
              close,
              volume,
              time: time / 10 ** 9
            };
          })
        );
      });
    // console.log("data after mapping is", data);
  }, [interval, symbol, range]);

  useEffect(() => {
    if (containerRef.current !== null) {
      const gridLineColor = "rgba(54,60,78,0.7)";
      const ch = createChart(containerRef.current, {
        width: width,
        height: height,
        localization: {
          dateFormat: "MM/dd/yyyy"
        },
        layout: {
          textColor: "#d1d4dc",
          backgroundColor: "#131722"
        },
        grid: {
          vertLines: {
            color: gridLineColor
          },
          horzLines: {
            color: gridLineColor
          }
        },
        timeScale: {
          tickMarkFormatter: (timePoint, tickMarkType, locale) => {
            console.log(timePoint, tickMarkType, locale);
            return timePoint;
          },
          rightOffset: 3
        },
        priceScale: {
          mode: interval.toLowerCase() === "d" ? 0 : 1
        },
        handleScale: false,
        handleScroll: false
      });
      setChart(ch);
    }
  }, [containerRef]);

  useEffect(() => {
    if (chart !== undefined)
      chart.applyOptions({
        watermark: {
          color: "rgba(255, 255, 255, 0.5)",
          visible: true,
          text: name,
          fontSize: 20,
          horzAlign: "left",
          vertAlign: "top"
        }
      });
  }, [name, chart]);

  useEffect(() => {
    if (data !== undefined) {
      if (series.candlestick !== null && chart.volume !== null) {
        chart.removeSeries(series.candlestick);
        chart.removeSeries(series.volume);
      }
      const volumeSeries = chart.addHistogramSeries({
        priceFormat: {
          type: "volume"
        },
        overlay: true,
        scaleMargins: {
          top: 0.7,
          bottom: 0
        }
      });
      // console.log("data before use is", data);
      volumeSeries.setData(
        data.map(({ time, volume, open, close }) => ({
          time,
          value: volume,
          color: close >= open ? "rgba(38,166,154,0.4)" : "rgba(239,83,80,0.4)"
        }))
      );
      const candlestickSeries = chart.addCandlestickSeries();
      candlestickSeries.setData(data);
      setSeries({ candlestick: candlestickSeries, volume: volumeSeries });
      chart.timeScale().fitContent();
    }
  }, [data, chart]);

  return (
    <div
      ref={containerRef}
      style={{ border: "2px solid rgba(54,60,78,0.3)", borderRadius: "5px" }}
      onMouseEnter={() => {
        // console.log("enter");
        chart.applyOptions({
          layout: { backgroundColor: "rgba(19,23,34,0.5)" }
        });
      }}
      onMouseLeave={() => {
        // console.log("leave");
        chart.applyOptions({ layout: { backgroundColor: "#131722" } });
      }}
    ></div>
  );
};

export default LightWeightChart;
