import historyProvider from "./historyProvider";
import ApiClient from "../../ApiClient";
import { getExchangeCode } from "../utils";
// import stream from "./stream";

// available in UI
const supportedResolutions = ["1", "5", "15", "30", "1D", "1H", "1W", "1M"];

// supported directly by feed (supposedly)
const intraday_multipliers = ["1", "5", "15"];

const config = {
  supported_resolutions: supportedResolutions,
  intraday_multipliers: intraday_multipliers,
  supports_group_request: false,
  supports_marks: false,
  supports_search: true,
  supports_timescale_marks: false,
  minmov: 1,
  pricescale: 100,
  minmove2: 0,
  symbols_types: [{ name: "Symbol", value: "stock" }]
};

// yahoo limit of data available for intraday res
const yahoo_intraday_limits = {
  1: 7,
  5: 60,
  15: 60,
  30: 60,
  60: 730
};

const intraday_resolutions = ["1", "5", "15", "30"];

let intraday_counter = 0;
let last_res = "";
let symbols = [];

export default {
  onReady: (cb) => {
    setTimeout(() => {
      ApiClient.get("/search").then(({ data }) => {
        symbols = data.map((datum) => ({
          symbol: datum.symbol || "",
          full_name: datum.symbol || "",
          description: datum.name || "",
          exchange: getExchangeCode(datum.exchange) || "",
          type: "stock"
        }));

        cb(config);
      });
    }, 0);
  },
  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
    console.log("====Search Symbols running");

    const searchSymbols = (symbols, input) =>
      symbols.filter((data) =>
        data.symbol.toLowerCase().includes(input.toLowerCase())
      );

    if (symbols.length === 0) {
      ApiClient.get("/search").then(({ data }) => {
        symbols = data.map((datum) => ({
          symbol: datum.symbol || "",
          full_name: datum.symbol || "",
          description: datum.name || "",
          exchange: getExchangeCode(datum.exchange) || "",
          type: "stock"
        }));

        onResultReadyCallback(searchSymbols(symbols, userInput));
      });
    } else onResultReadyCallback(searchSymbols(symbols, userInput));
  },
  resolveSymbol: (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback
  ) => {
    // expects a symbolInfo object in response
    console.log("======resolveSymbol running");
    // console.log('resolveSymbol:',{symbolName})

    const foundSymbol = symbols.filter(
      (symbol) => symbol.symbol === symbolName
    )[0];
    // var split_data = symbolName.split(/[:/]/);
    // console.log({split_data})
    var symbol_stub = {
      name: foundSymbol.symbol,
      full_name: foundSymbol.full_name,
      description: foundSymbol.description,
      type: "stock",
      session: "0900-1630",
      timezone: "Etc/UTC",
      ticker: symbolName,
      exchange: foundSymbol.exchange,
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      has_daily: true,
      has_weekly_and_monthly: true,
      volume_precision: 20,
      data_status: "endofday"
    };
    // if (split_data[2].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
    // 	symbol_stub.pricescale = 100;
    // }

    setTimeout(function () {
      onSymbolResolvedCallback(symbol_stub);
      console.log("Resolving that symbol....", symbol_stub);
    }, 0);

    // onResolveErrorCallback('Not feeling it today')
  },
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback
  ) => {
    console.log("=====subscribeBars runnning");
    console.log(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscribeUID,
      onResetCacheNeededCallback
    );
    // stream.subscribeBars(
    // 	symbolInfo,
    // 	resolution,
    // 	onRealtimeCallback,
    // 	subscribeUID,
    // 	onResetCacheNeededCallback
    // );
  },
  unsubscribeBars: (subscriberUID) => {
    console.log("=====unsubscribeBars running");
    // stream.unsubscribeBars(subscriberUID);
  },
  onVisibleRangeChanged: (from, to) => {
    console.log("range changed");
  },

  getBars: function (
    symbolInfo,
    resolution,
    from,
    to,
    onHistoryCallback,
    onErrorCallback,
    firstDataRequest
  ) {
    console.log(
      "getbars in index:",
      JSON.stringify(symbolInfo),
      resolution,
      from,
      to
    );
    console.log(
      `Requesting bars between ${new Date(
        from * 1000
      ).toISOString()} and ${new Date(to * 1000).toISOString()}`
    );

    if (intraday_resolutions.includes(resolution)) {
      // yahoo expects timestamp in s:        1565082000
      // tradingview expects timestamp in ms: 1565082000000

      let now = parseInt(Date.now() / 1000);

      let delta = yahoo_intraday_limits[resolution] * 24 * 60 * 60;
      let earliest_allowed = now - delta;

      from = earliest_allowed + 1000;
      to = now;

      if (resolution != last_res) {
        last_res = resolution;
        intraday_counter = 0;
      }

      if (intraday_counter > 1) {
        console.log("intraday_counter", intraday_counter);
        onHistoryCallback([], { noData: true });
        intraday_counter = 0;
      } else {
        historyProvider
          .getBars(symbolInfo, resolution, from, to, firstDataRequest)
          .then((bars) => {
            if (bars.length) {
              onHistoryCallback(bars, { noData: false });
              intraday_counter++;
            } else {
              intraday_counter++;
            }
          })
          .catch((err) => {
            console.log("HistoryProvider Error:", { err }, "bars is", bars);
            onErrorCallback(err);
          });
      }
    } else {
      historyProvider
        .getBars(symbolInfo, resolution, from, to, firstDataRequest)
        .then((bars) => {
          if (bars.length) {
            onHistoryCallback(bars, { noData: false });
          } else {
            onHistoryCallback(bars, { noData: true });
          }
        })
        .catch((err) => {
          console.log("HistoryProvider Error:", { err }, "bars is", bars);
          onErrorCallback(err);
        });
    }
  },

  calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
    if (["5", "15", "30"].includes(resolution)) {
      return {
        resolutionBack: "D",
        intervalBack: 100
      };
    } else if (resolution == "1") {
      return {
        resolutionBack: "D",
        intervalBack: 10
      };
    }
  },
  getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
    //optional
    console.log("=====getMarks running");
  },
  getTimeScaleMarks: (
    symbolInfo,
    startDate,
    endDate,
    onDataCallback,
    resolution
  ) => {
    //optional
    console.log("=====getTimeScaleMarks running");
  },
  getServerTime: (cb) => {
    console.log("=====getServerTime running");
  }
};
