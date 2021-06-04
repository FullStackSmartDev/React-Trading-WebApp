import React, { useEffect, useRef, useState } from "react";

import ApiClient from "../ApiClient";
import { createChart } from "lightweight-charts";

import Strategies from "../Strategies";

import RangeOptionSelect from "./RangeOptionSelect";
import RangeOptions from "./RangeOptions";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import MainSearch from "./MainSearch";

const BucketDashboard = (props) => {
  const { height, width, name } = props;
  const [data, setData] = useState();
  const [interval, setInterval] = useState("D");
  const [range, setRange] = useState("12m");
  const [buckets, setBuckets] = useState({});
  const [bucketVisible, setBucketVisible] = useState({});
  const [chart, setChart] = useState();
  const [loaded, setLoaded] = useState(false);
  const [chartlines] = useState({});
  const [chartDimensions, setChartDimensions] = useState({ height, width });
  const containerRef = useRef();
  const controllerRef = useRef();

  const intervalMap = {
    d: "1d",
    D: "1d",
    W: "1wk",
    M: "1mo"
  };

  const categories = {
    growth: {
      colors: ["#5E7F3D", "#93B86B", "#C8FF8D", "#D9FFAD"],
      strats: ["four-stars", "rocket-stocks", "cash-kings", "revenue-growth"]
    },
    custom: {
      colors: ["#D8650F", "#DD7F00", "#F2A53E", "#FBAA6F", "#FFD1AF"],
      strats: [
        "short-squeeze-leaders",
        "short-squeeze-reversals",
        "rnd",
        "movers-and-shakers",
        "recently-listed"
      ]
    },
    value: {
      colors: ["#696B71", "#8C8989", "#B5B2B2", "#FFFFFF"],
      strats: [
        "earnings-yield",
        "real-buybacks",
        "insider-ownership",
        "balance-sheet-strength"
      ]
    }
  };

  const colormap = {};
  for (let cat of ["growth", "custom", "value"]) {
    for (let i = 0; i < categories[cat].strats.length; i++)
      colormap[categories[cat].strats[i]] = categories[cat].colors[i];
  }

  useEffect(() => {
    if (chart !== undefined) {
      window.addEventListener("resize", () => {
        const width = containerRef.current.clientWidth / 1.5;
        const height = width / 1.618;
        chart.resize(width, height);
      });
    }
  });

  useEffect(() => {
    if (chart !== undefined) {
      const width = containerRef.current.clientWidth / 1.5;
      const height = width / 1.618;
      chart.resize(width, height);
    }
  }, [containerRef.current, width, height, chart]);

  useEffect(() => {
    let start, end, months;
    start = end = months = null;
    months = parseInt(/(\d+)m/.exec(range)[1]);

    const _dateToIsoDate = (date) => date.toISOString().split("T")[0];

    end = new Date();
    start = new Date(end - months * 30 * 24 * 60 * 60 * 1000);
    end = new Date(end.getTime() - 1 * 24 * 60 * 60 * 1000);

    var sorted = {};

    removeChartLines();

    setLoaded(false);

    ApiClient.get(
      `/dashboard?&interval=${intervalMap[interval]}&start=${_dateToIsoDate(
        start
      )}&end=${_dateToIsoDate(end)}`
    ).then((res) => {
      // console.log(data);
      res.data.values.map((value) => {
        if (!(value[6] in sorted)) {
          sorted[value[6]] = { name: value[6], data: [] };
        }
        if (!(value[6] in bucketVisible)) {
          bucketVisible[value[6]] = false;
        }
        sorted[value[6]]["data"].push(value);
      });

      // console.log("res is", res);
      sorted["spy"] = {
        name: "spy",
        data: res["data"]["spy"]["values"]
      };

      bucketVisible["spy"] = true;

      var period_pct_change = function (bucketsObj) {
        for (let [key, bucket] of Object.entries(bucketsObj)) {
          try {
            var first_close = undefined;
            bucketsObj[bucket.name]["data"] = bucket.data.map((val) => {
              const [time, open, high, low, close, volume] = val;

              if (first_close == undefined) {
                first_close = close;
                var pct = 0;

                return {
                  open,
                  high,
                  low,
                  pct,
                  volume,
                  time: time / 10 ** 9
                };
              } else {
                var increase = close - first_close;
                var pct = (increase / first_close) * 100;
                return {
                  open,
                  high,
                  low,
                  pct,
                  volume,
                  time: time / 10 ** 9
                };
              }
            });
          } catch (e) {
            console.log(e);
          }
        }
        return bucketsObj;
      };
      // console.log(sorted);
      setBuckets(period_pct_change(sorted));
      setLoaded(true);
    });
  }, [range]);

  const removeChartLines = function () {
    if (Object.keys(chartlines).length != 0) {
      for (let [strategy, line] of Object.entries(chartlines)) {
        try {
          chart.removeSeries(line);
          chartlines[strategy] = undefined;
        } catch (e) {
          continue;
        }
      }
    }
  };

  useEffect(() => {
    console.log("range changed to:", range);
  }, [range]);

  useEffect(() => {
    if (containerRef.current !== null) {
      const gridLineColor = "rgba(54,60,78,0.7)";
      const ch = createChart(containerRef.current, {
        width: width,
        height: height,
        localization: {
          dateFormat: "dd/MM/yyyy"
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
            return timePoint;
          },
          rightOffset: 3
        },
        priceFormat: {
          type: "percent"
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
    if (chart !== undefined) {
      chart.applyOptions({
        watermark: {
          color: "rgba(255, 255, 255, 0.5)",
          visible: true,
          text: name,
          fontSize: 24,
          horzAlign: "left",
          vertAlign: "top"
        },
        localization: {
          priceFormatter: function (price) {
            return price.toFixed(2) + "%";
          }
        }
      });
    }
  }, [name, chart]);

  useEffect(() => {
    chartManager();
  }, [buckets]);

  const chartManager = function (bucketslug = undefined, cat = undefined) {
    if (chart !== undefined) {
      if (buckets !== undefined) {
        if (bucketslug !== undefined) {
          bucketVisible[bucketslug]
            ? (bucketVisible[bucketslug] = false)
            : (bucketVisible[bucketslug] = true);
        }
        if (cat !== undefined) {
          // if any visible, set all to none,
          // if all none, set all to visible.
          var visvals = [];
          Strategies.data[cat].map((strategy) => {
            visvals.push(bucketVisible[strategy.slug]);
          });
          // console.log("visvals", visvals);
          if (visvals.includes(true)) {
            // console.log("in true visvals");
            Strategies.data[cat].map((strategy) => {
              bucketVisible[strategy.slug] = false;
            });
          } else {
            // console.log("in false visvals");
            Strategies.data[cat].map((strategy) => {
              bucketVisible[strategy.slug] = true;
            });
          }
        }

        for (let [strategy, line] of Object.entries(chartlines)) {
          try {
            if (bucketVisible[strategy] == false) {
              // console.log("removing line", line);
              chart.removeSeries(line);
              chartlines[strategy] = undefined;
            }
          } catch (e) {}
        }
      }

      for (let [key, bucket] of Object.entries(buckets)) {
        if (bucketVisible[bucket.name]) {
          try {
            if (bucketslug !== undefined || cat !== undefined) {
              // Called from switcher
              if (chartlines[bucket.name] == undefined) {
                chartlines[bucket.name] = chart.addLineSeries({
                  color: colormap[bucket.name],
                  lineWidth: 2,
                  crosshairMarkerVisible: true,
                  crosshairMarkerRadius: 6
                });

                chartlines[bucket.name].setData(
                  bucket.data.map(({ time, volume, open, pct }) => ({
                    time,
                    value: pct
                  }))
                );
              }
            } else {
              // First run
              chartlines[bucket.name] = chart.addLineSeries({
                color: colormap[bucket.name],
                lineWidth: 2,
                crosshairMarkerVisible: true,
                crosshairMarkerRadius: 6
              });

              chartlines[bucket.name].setData(
                bucket.data.map(({ time, volume, open, pct }) => ({
                  time,
                  value: pct
                }))
              );
            }
          } catch (e) {
            console.log(e);
          }
        }
        chart.timeScale().fitContent();
      }
    }
  };

  const snpButtonStyle = {
    backgroundColor: "#272F3C",
    borderBottomLeftRadius: "5px",
    borderTopLeftRadius: "5px",
    border: "2px solid transparent",
    marginTop: "8px",
    color: "#fff",
    fontSize: "0.58em",
    fontWeight: "bold",
    padding: "5px 10px",
    marginLeft: "auto",
    width: "40px",
    textAlign: "center"
  };

  const buttonStyle = {
    backgroundColor: "transparent",
    // borderRadius: "5px",
    border: "2px solid transparent",
    color: "#fff",
    fontSize: "0.8em",
    width: "100%",
    display: "flex",
    alignItems: "center",
    paddingTop: "8px",
    paddingBottom: "8px"
  };

  return (
    <div>
      /*
      <MainSearch displayMode="topBar" />
      */
      <div
        className="dashContainer"
        ref={containerRef}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div className="dashcontroller" ref={controllerRef} id="dashController">
          <div
            style={{
              width: "100%",
              alignContent: "center",
              display: "grid",
              marginBottom: "5px"
            }}
          >
            <RangeOptionSelect
              options={RangeOptions.options}
              default={"12m"}
              onSelectionChange={(newRange) => {
                if (loaded) {
                  setRange(newRange);
                  console.log("newrange is ", newRange);
                } else {
                  console.log("Not loaded yet");
                }
              }}
            />
          </div>
          <div className="dashcontrollerGroup">
            <div
              className="dashControllerButton"
              onClick={() => (console.log("spy clicked"), chartManager("spy"))}
              style={snpButtonStyle}
            >
              S&P 500
            </div>
          </div>
          {Strategies.categories.map((cat) => {
            return (
              <div className={"dashcontrollerGroup"}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p
                    onClick={() => (
                      console.log("cat clicked", cat),
                      chartManager(undefined, cat)
                    )}
                    className={
                      "dashcontrollerLabel dashcontrollerLabel" +
                      cat.replace("/", "-")
                    }
                  >
                    {cat}
                  </p>
                  <ArrowDropDownIcon
                    style={{
                      color: "white",
                      display: "inline-block",
                      padding: "5px"
                    }}
                  />
                </div>
                <div className="buttonsgroup">
                  {Strategies.data[cat].map((strategy) => {
                    return (
                      <div
                        className="dashControllerButton"
                        onClick={() => (
                          console.log("strat clicked"),
                          chartManager(strategy.slug)
                        )}
                        style={buttonStyle}
                      >
                        <div
                          style={{
                            backgroundColor: colormap[strategy.slug],
                            height: "10px",
                            width: "40px",
                            marginRight: "5px"
                          }}
                        />
                        {strategy.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div
          onMouseEnter={() => {
            chart.applyOptions({
              layout: { backgroundColor: "rgba(19,23,34,0.5)" }
            });
          }}
          onMouseLeave={() => {
            chart.applyOptions({ layout: { backgroundColor: "#131722" } });
          }}
        ></div>
      </div>
    </div>
  );
};

export default BucketDashboard;
