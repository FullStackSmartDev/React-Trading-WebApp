import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import "./index.css";
import { widget } from "../../charting_library/charting_library.js";
import Datafeed from "./api/";
import { Themes } from "react-tradingview-widget";

const TvChart = (props) => {
  let {
    symbol,
    theme,
    withdateranges,
    hide_side_toolbar,
    interval,
    range,
    autosize,
    ref,
    style = {},
    scan,
    meta
  } = props;

  const [hasLoaded, setHasLoaded] = useState(false);
  const [TVWidgetState, setTVWidgetState] = useState({});
  const defaultProps = {
    symbol: "MSFT",
    interval: "1D",
    containerId: "tv_chart_container",
    libraryPath: "/charting_library/",
    theme: "Dark",
    chartsStorageUrl: "",
    chartsStorageApiVersion: "1.1",
    clientId: "",
    userId: "",
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
    overrides: {
      "mainSeriesProperties.priceAxisProperties.log": true
    }
  };

  // in days

  const widgetOptions = {
    symbol: symbol,
    datafeed: Datafeed,
    // datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
    //  this.props.datafeedUrl
    // ),
    theme: "Dark",
    interval: interval.toUpperCase(),
    container_id: defaultProps.containerId,
    library_path: defaultProps.libraryPath,

    locale: "en",
    // disabled_features: ["use_localstorage_for_settings"],
    // disabled_features: ["left_toolbar"],
    enabled_features: ["study_templates"],
    charts_storage_url: defaultProps.chartsStorageUrl,
    charts_storage_api_version: defaultProps.chartsStorageApiVersion,
    client_id: defaultProps.clientId,
    user_id: defaultProps.userId,
    fullscreen: props.fullscreen,
    autosize: defaultProps.autosize,
    studies_overrides: defaultProps.studiesOverrides,
    overrides: defaultProps.overrides
  };

  let setVisibleFrame = function (widget) {
    let timeframeDict = { d: "214", D: "427", W: "2010", M: "9490" };

    let from = new Date();
    from.setDate(from.getDate() - timeframeDict[interval]);
    from = parseInt(from.getTime() / 1000);

    let to = parseInt(Date.now() / 1000);

    widget
      .activeChart()
      .setVisibleRange({ from, to }, { percentRightMargin: 10 });
  };

  const [boxText, setBoxText] = useState(null);

  useEffect(() => {
    const ONE_MILLION = 1_000_000;
    console.log([meta.meta]);
    const float_shares = meta?.meta?.float_shares;
    const shares_outstanding = meta?.meta?.shares_outstanding * ONE_MILLION;
    const locked_up_shares = meta?.meta?.ipo_lockup_data?.number_of_shares;
    const float_percent = (locked_up_shares / float_shares) * 100;
    const outstanding_percent = (locked_up_shares / shares_outstanding) * 100;
    const lockup_expiry = meta?.meta?.ipo_lockup_data?.expiration_date;

    const readableMillion = (amt) =>
      amt ? `${(amt / ONE_MILLION).toFixed(2)}M` : null;
    const readablePercent = (percent) =>
      percent ? `${percent.toFixed(2)}%` : null;

    const boxData = {
      Float: readableMillion(float_shares),
      OS: readableMillion(shares_outstanding),
      Lockup: readableMillion(locked_up_shares),
      "% of Float": readablePercent(float_percent),
      "% of OS": readablePercent(outstanding_percent),
      Date: lockup_expiry
    };

    const text = Object.entries(boxData)
      .filter(([key, val]) => val)
      .map(([key, val]) => {
        return `${key}: ${val}`;
      })
      .join("\n");

    setBoxText(text);
  }, [meta.meta]);

  useEffect(() => {
    if (boxText !== null) {
      const tvw = new widget(widgetOptions);
      setTVWidgetState(tvw);
      tvw.onChartReady(() => {
        tvw.headerReady().then(() => {
          // const button = tvw.createButton();
          // button.setAttribute("title", "Click to show a notification popup");
          // button.classList.add("apply-common-tooltip");
          // button.addEventListener("click", () =>
          //  tvw.showNoticeDialog({
          //    title: "Notification",
          //    body: "TradingView Charting Library API works correctly",
          //    callback: () => {
          //      console.log("Noticed!");
          //    }
          //  })
          // );
          // button.innerHTML = "Check API";

          if (scan === "recently-listed") {
            const chart = tvw.activeChart();

            const ycords = chart.getVisiblePriceRange();
            const xcords = chart.getVisibleRange();
            const width = xcords.to - xcords.from;
            const height = ycords.to - ycords.from;

            console.log(
              chart.getShapeById(
                chart.createMultipointShape(
                  [
                    // { time: new Date() - width / 10, price: ycords.to - height / 10 },
                    {
                      time: xcords.from,
                      price: ycords.to - height / 4
                    }
                  ],
                  {
                    shape: "anchored_text",
                    overrides: {
                      backgroundColor: "#000",
                      borderColor: "white"
                    },
                    text: boxText,
                    lock: false
                  }
                )
              )
            );
          }

          setVisibleFrame(tvw);
        });
        setHasLoaded(true);
      });
    }
  }, [boxText]);

  useEffect(() => {
    if (hasLoaded) {
      TVWidgetState.activeChart().setSymbol(symbol);
    }
  }, [symbol]);

  return (
    <div
      id={defaultProps.containerId}
      className={"TVChartContainer"}
      style={style}
    />
  );
};

export default TvChart;
