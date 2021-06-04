// var rp = require("request-promise").defaults({ json: true });
var rp = require("request-promise").defaults({ json: true });

var axios = require("axios");

let api_root = "https://api.fusionpointcapital.com";
if (process.env.NODE_ENV == "development") {
  api_root = "http://localhost:8080";
}

const history = {};

export default {
  history: history,

  getBars: function (symbolInfo, resolution, from, to, first, limit) {
    console.log(symbolInfo);
    console.log("resolution is ", resolution);
    // var split_symbol = symbolInfo.name.split(/[:/]/);
    let symbol = symbolInfo.name;

    symbol.includes(":") ? (symbol = symbol.split(":")[1]) : symbol;
    console.log("symbol name is:", symbol);
    let api = "local";
    let url = "/quotes?interval=1d";

    console.log(resolution);

    //
    //
    //
    // --- LOCAL DB PROVIDED RESOLUTIONS ---
    // /quotes?symbol=SHOP&interval=1d&start=2019-10-27&end=2020-10-24
    if (resolution == "1D") {
      url = "/quotes?interval=1d";
    } else if (resolution == "1W") {
      url = "/quotes?interval=1wk";
    } else if (resolution == "1M") {
      url = "/quotes?interval=1mo";

      //
      //
      //
      // --- YAHOO PROVIDED RESOLUTIONS  ---
      // yahoo uri format:
      // https://query1.finance.yahoo.com/v8/finance/chart/BGFV?symbol=BGFV&period1=1603306800&period2=1603809313&interval=1m
      // Valid intervals: [1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo]
    } else if (["1", "5", "10", "15", "30"].includes(resolution)) {
      url = symbol + "?interval=" + resolution + "m";
      api = "yahoo";

      console.log(url);
      //
      //
      //
      // Hourly Data
    } else if (["60", "120", "240"].includes(resolution)) {
      url = symbol + "?interval=1h";
      api = "yahoo";
    }

    if (first == true && api == "local") {
      console.log("adding first to url");
      url = url + "&latest=1";
    }

    const _dateToIsoDate = (date) => date.toISOString().split("T")[0];
    let qs = {};
    let requrl = "";

    if (api == "yahoo") {
      // proxying to allow CORS...
      requrl = "https://proxy.roundness.workers.dev/tickstream/" + url;
      qs = { symbol: symbol, period1: from, period2: to };

      //
      //
      //
    } else if (api == "local") {
      requrl = api_root + url;
      let start = new Date(from * 1000);
      let end = new Date(to * 1000);

      start = _dateToIsoDate(start);
      end = _dateToIsoDate(end);

      qs = {
        symbol: symbol,
        start: start,
        end: end,
        limit: limit ? limit : 10000
      };
    }

    function serialize(obj) {
      var str = [];
      for (var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      return str.join("&");
    }

    console.log(requrl + "&" + serialize(qs));
    requrl = requrl + "&" + serialize(qs);

    let errorCode = "";

    return axios(requrl, {
      method: "GET"
    })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          if (error.response.status == 422) {
            errorCode = 422;
          }

          return [];
        }
      })
      .then((data) => {
        // console.log("data response is:", data);
        data = data.data;
        console.log("in .then bars data is", data);

        if (errorCode == 422) {
          return [];
        }

        if (api == "local") {
          if (data.values.length) {
            var bars = data.values.map((val) => {
              const [time, open, high, low, close, volume] = val;
              return {
                open,
                high,
                low,
                close,
                volume,
                time: time / 10 ** 6
              };
            });
            console.log("bars is ", bars);
            if (first) {
              var lastBar = bars[bars.length - 1];
              history[symbolInfo.name] = { lastBar: lastBar };
            }
            return bars;
          } else {
            return [];
          }
          //
          //
          //
          //
        } else if (api == "yahoo") {
          if (!data.chart.error) {
            let res = data.chart.result[0];

            // time is expected in format: 1565082000000
            if (res.timestamp) {
              let bars = [];
              for (let i = 0; i <= res.timestamp.length; i++) {
                if (res.timestamp[i]) {
                  if (res.indicators.quote[0].volume[i]) {
                    if (res.indicators.quote[0].open[i]) {
                      bars.push({
                        open: res.indicators.quote[0].open[i],
                        high: res.indicators.quote[0].high[i],
                        low: res.indicators.quote[0].low[i],
                        close: res.indicators.quote[0].close[i],
                        volume: res.indicators.quote[0].volume[i],
                        time: res.timestamp[i] * 1000
                      });
                    }
                  }
                }
              }

              console.log("bars is ", bars);
              if (first) {
                var lastBar = bars[bars.length - 1];
                history[symbolInfo.name] = { lastBar: lastBar };
              }

              if (bars != undefined) {
                return bars;
              } else {
                return [];
              }
            } else {
              return [];
            }
          } else {
            return [];
          }
        }
      });
  }
};
