import React, { useEffect, useState } from "react";

import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import { Redirect } from "react-router-dom";
import Strategies from "../Strategies";

import ApiClient from "../ApiClient";
import { Link } from "react-router-dom";

export default () => {
  const [sorted, setSorted] = useState({ uniquedates: {}, alltimes: [] });
  useEffect(() => {
    let start, end, months;
    start = end = months = null;

    const _dateToIsoDate = (date) => date.toISOString().split("T")[0];

    end = new Date();
    start = new Date(end - months * 30 * 24 * 60 * 60 * 1000);
    end = new Date(end.getTime() - 1 * 24 * 60 * 60 * 1000);

    const intervals = ["1d", "1wk", "1mo"];

    // console.log("Kajabi test: ", window.Kajabi.currentSiteUser);

    intervals.forEach((intvl) => {
      ApiClient.get(
        `/debug-datecoverage?&interval=${intvl}&start=2019-01-01&end=2020-10-10`
      ).then((res) => {
        // console.log(data);

        res.data.values.map(([time, symbol, close]) => {
          if (!(symbol in sorted)) {
            sorted[symbol] = {
              name: symbol,
              data: { close: [], time: [] }
            };
          }
          sorted[symbol].data["close"].push(close);

          var timestamp = time / 1000000;
          var date = new Date(timestamp);
          date = _dateToIsoDate(date);
          sorted[symbol].data["time"].push(date);
          sorted.alltimes.push(date);
        });

        let uniquedates = {};
        sorted.alltimes.forEach((time) => {
          uniquedates[time] = 1;
        });

        sorted.uniquedates[intvl] = uniquedates;
        setSorted(Object.assign({}, sorted));

        console.log(sorted.uniquedates);
      });
    });
  }, []);

  return <div></div>;
};
