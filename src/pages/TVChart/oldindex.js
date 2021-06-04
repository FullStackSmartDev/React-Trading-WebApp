import * as React from "react";
import "./index.css";
import { widget } from "../../charting_library/charting_library.js";
import Datafeed from "./api/";
import { Themes } from "react-tradingview-widget";

function getLanguageFromURL() {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

let maxScrollback = 0;

export class TVChart extends React.PureComponent {
  static defaultProps = {
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

  tvWidget = null;

  componentDidMount() {
    const widgetOptions = {
      symbol: this.props.symbol,
      datafeed: Datafeed,
      // datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
      // 	this.props.datafeedUrl
      // ),
      theme: "Dark",
      interval: this.props.interval,
      container_id: this.props.containerId,
      library_path: this.props.libraryPath,

      locale: "en",
      // disabled_features: ["use_localstorage_for_settings"],
      // disabled_features: ["left_toolbar"],
      enabled_features: ["study_templates"],
      charts_storage_url: this.props.chartsStorageUrl,
      charts_storage_api_version: this.props.chartsStorageApiVersion,
      client_id: this.props.clientId,
      user_id: this.props.userId,
      fullscreen: this.props.fullscreen,
      autosize: this.props.autosize,
      studies_overrides: this.props.studiesOverrides,
      overrides: this.props.overrides
    };

    const tvWidget = new widget(widgetOptions);
    this.tvWidget = tvWidget;

    console.log("------------------ tvWidget", tvWidget);

    tvWidget.onChartReady(() => {
      tvWidget.headerReady().then(() => {
        const button = tvWidget.createButton();
        button.setAttribute("title", "Click to show a notification popup");
        button.classList.add("apply-common-tooltip");
        button.addEventListener("click", () =>
          tvWidget.showNoticeDialog({
            title: "Notification",
            body: "TradingView Charting Library API works correctly",
            callback: () => {
              console.log("Noticed!");
            }
          })
        );

        button.innerHTML = "Check API";
      });
    });

    const preventScrollBack = function (from) {};
  }

  componentWillUnmount() {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  }

  render() {
    return <div id={this.props.containerId} className={"TVChartContainer"} />;
  }
}
