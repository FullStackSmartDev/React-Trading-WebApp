import ApiClient from "../../../ApiClient";
// import IntervalOptions from "../../../IntervalOptions";
import React, { useEffect, useState } from "react";

import ttmsqueeze from "./ttmsqueeze.js";
import relativestrength from "./relativestrength.js";

export default function prepareAlgoSort(algoSortData, scan, setAlgoSortData) {
  var asd = Object.assign({}, algoSortData);
  // console.log("result is ", result);
  // gather the appropriate ranges of data for each interval

  const intervalMap = {
    d: "1d",
    D: "1d",
    W: "1wk",
    M: "1mo"
  };

  const intervalRangeMap = {
    d: "4m",
    D: "4m",
    W: "30m",
    M: "100m"
  };

  console.log("Algosort begin", new Date());
  for (const [intervalname, intvl] of Object.entries(intervalMap)) {
    let start, end, months;
    start = end = months = null;
    months = parseInt(/(\d+)m/.exec(intervalRangeMap[intervalname])[1]);
    const _dateToIsoDate = (date) => date.toISOString().split("T")[0];

    months = months * 1.5;

    end = new Date();
    start = new Date(end - months * 30 * 24 * 60 * 60 * 1000);
    end = new Date(end.getTime() + 3 * 24 * 60 * 60 * 1000);

    var result = ApiClient.get(
      `/algosort?strategy=${scan}&start=${_dateToIsoDate(
        start
      )}&end=${_dateToIsoDate(end)}&interval=${intvl}`
    )
      .then((res) => res.data)
      .then((data) => {
        var asd = Object.assign({}, algoSortData);
        var algodata = sortAlgoData(data);
        asd[intvl] = calculateAlgoSorts(algodata, intvl);
        return asd;
      })
      .then((asd) => {
        // console.log("asd is", asd);
        setAlgoSortData(asd);
      });
  }
}
const sortAlgoData = (resdata) => {
  // sort data into buckets and convert array ohlcv format to dict ohlcv format, along with
  // some additional arrays for helping algosort methods i.e. ["close"]
  var sortResdata = (d) => {
    var datadict = {};
    try {
      d.values.map(
        ([time, open, high, low, close, volume, interval, symbol]) => {
          if (!(symbol in datadict)) {
            datadict[symbol] = {
              symbol: symbol,
              ohlcv: [],
              close: [],
              bytime: {}
            };
          }
          datadict[symbol].ohlcv.push({
            time: time,
            open: open,
            high: high,
            low: low,
            close: close,
            volume: volume
          });

          var nohms = new Date(time / 1000000).setHours(0, 0, 0, 0); // remove h:m:s so that times can be compared
          datadict[symbol].bytime[nohms] = {
            datetime: new Date(nohms),
            time: nohms,
            open: open,
            high: high,
            low: low,
            close: close,
            volume: volume
          };

          datadict[symbol].close.push(close);
        }
      );
    } catch (e) {
      console.log("failed in sortResdata");
    }
    return datadict;
  };
  // sort main response, which is all stocks in category mixed together (fastest for influx),
  // then, process and add SPY
  var sortedDict = {};
  sortedDict = sortResdata(resdata);
  var sortspy = sortResdata(resdata.spy);
  sortedDict.SPY = sortspy.SPY;
  return sortedDict;
};

const calculateAlgoSorts = (algodata, interval) => {
  for (let symbol in algodata) {
    // TTM Squeeze
    if (algodata[symbol].insqueeze == undefined) {
      algodata[symbol].insqueeze = {};
      algodata[symbol].squeezeframe = {};
    }
    try {
      var squeezeinfo = ttmsqueeze(algodata[symbol]);
      algodata[symbol].insqueeze = squeezeinfo[0];
      algodata[symbol].squeezeframe = squeezeinfo[1];
    } catch (e) {
      // console.log("calculateAlgoSorts error for ", symbol, e);
    }

    try {
      algodata[symbol].rts = relativestrength(
        algodata[symbol].bytime,
        algodata.SPY.bytime,
        symbol,
        interval
      );
    } catch (e) {
      // console.log("calculateAlgoSorts error for ", symbol, e);
    }
  }
  // console.log("algodata for", interval, algodata);
  return algodata;
};
