import React, { useEffect, useRef, useState } from "react";

import ApiClient from "../ApiClient";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";

import SelectSearch from "react-select-search";
import "./MainSearch.css";
import { getExchangeCode } from "../TVChart/utils";

const MainSearch = (props) => {
  const { displayMode } = props;
  const [allStocks, setAllStocks] = useState([]);
  const [stockDirectory, setStockDirectory] = useState([]);

  const [size, setSize] = useState("s");
  const history = useHistory();

  const [matchingStocks, setMatchingStocks] = useState([]);
  const [redirect, setRedirect] = useState(null);

  const parseSearchOptions = function (data) {
    // console.log("unformatted data is ", data);

    let optionsDict = {};

    data.forEach(function (el) {
      if (optionsDict[el["strategy-slug"]] == undefined) {
        optionsDict[el["strategy-slug"]] = [];
      }

      // when option is clicked, module only sends value, so need to encode information as string there.
      let obj = {
        name: el["symbol"] + " - " + el["name"],
        value:
          el["symbol"] +
          " _ " +
          el["strategy-slug"] +
          " _ " +
          el["name"].toUpperCase(),
        symbol: el["symbol"]
      };

      if (el["strategy-slug"] == "all-stocks") {
        obj["exchange"] = el["exchange"];
      }

      optionsDict[el["strategy-slug"]].push(obj);
    });

    const sortByLength = function (stocksArray) {
      let result = stocksArray.sort(function (a, b) {
        return (
          a["symbol"].length - b["symbol"].length || // sort by length, if equal then
          a["symbol"].localeCompare(b["symbol"]) // sort by dictionary order
        );
      });

      return result;
    };

    let searchOptions = [];
    let allStocksStrat = {};
    for (const [strat, stocks] of Object.entries(optionsDict)) {
      if (strat != "all-stocks") {
        searchOptions.push({
          name: strat,
          type: "group",
          items: sortByLength(stocks)
        });
      } else {
        allStocksStrat = {
          name: strat,
          type: "group",
          items: sortByLength(stocks)
        };
      }
    }

    // all stocks shows last in search results, so needs to be pushed last.
    searchOptions.push(allStocksStrat);
    setStockDirectory(allStocksStrat["items"]);

    // console.log(stockDirectory);

    // console.log("formatted data is ", searchOptions);
    return searchOptions;
  };

  useEffect(() => {
    ApiClient.get("/search")
      .then((res) => setAllStocks(parseSearchOptions(res.data)))
      .catch(console.log);
  }, []);

  const matchStocks = function (searchTerm) {
    // console.log("searchTerm is ", searchTerm, typeof searchTerm);

    let searchLength = searchTerm.length;

    searchTerm = searchTerm.toUpperCase();

    let result = [];

    allStocks.forEach(function (strategy) {
      let symbol_results = strategy["items"].filter(function (obj) {
        return obj.symbol.substring(0, searchLength) == searchTerm;
      });

      let name_results = [];
      if (searchLength > 3) {
        name_results = strategy["items"].filter(function (obj) {
          if (obj.value.includes(searchTerm)) {
            return obj;
          }
        });
      }

      // let results = symbol_results.concat(name_results);
      let results = [...new Set([...symbol_results, ...name_results])];

      result.push({
        name: strategy["name"],
        type: "group",
        items: results
      });
    });

    return result;
  };

  const handleSelect = function (selectedStock, hitEnter = false) {
    // console.log("handling change", selectedStock);

    // unfortunately, search module just returns value, not obj, so we have to search again to find exchange

    let [symbol, strat] = selectedStock.split(" _ ");

    // console.log("symbol|" + symbol + "|strat" + strat);

    if (hitEnter == true) {
      symbol = selectedStock;
      strat = "all-stocks";
    }

    // console.log("stockDirectory", stockDirectory);
    var theStock = stockDirectory.filter(function (obj) {
      return obj.symbol == symbol;
    });

    // console.log("symbol", symbol, "theStock", theStock);

    if (theStock.length == 1) {
      let exchange = theStock[0]["exchange"];

      const exchangeCode = getExchangeCode(exchange);

      // console.log("exchange is", exchange);
      // console.log(exchangeCode);

      // console.log(history);
      let prevLocation = window.location.href;
      if (strat == "all-stocks") {
        history.push({
          pathname: `/stock/${exchangeCode}:${theStock[0]["symbol"] + "/D"}`
        });
        // find a better way of doing this.
        // window.location.reload();
      } else {
        history.push({
          pathname: `/pro-scans/${strat}/stock/${exchangeCode}:${
            theStock[0]["symbol"] + "/D"
          }`
        });
      }
    } else {
      // console.log("No stock found in dir...", theStock);
    }
  };

  const getOptions = function (query) {
    let results = matchStocks(query);
    setMatchingStocks(results);
  };

  const handleInputKeyDown = function (e) {
    if (e.keyCode == 13) {
      // enter
      handleSelect(e.target.value.toUpperCase(), true);
    }
  };

  let displayModeStyle = "";
  if (displayMode == "topBar") {
    displayModeStyle = {
      height: "30px",
      width: "100%"
    };
  } else if (displayMode == "integrated") {
    displayModeStyle = {
      height: "30px"
    };
  }

  return (
    <div className="mainSearchContainer" style={displayModeStyle}>
      <SelectSearch
        options={matchingStocks}
        onChange={handleSelect}
        getOptions={(query) => {
          return new Promise(() => {
            getOptions(query);
          });
        }}
        renderValue={(valueProps) => (
          <input
            className="select-search__input"
            {...valueProps}
            onKeyDown={(e) => handleInputKeyDown(e)}
          />
        )}
        search
        autoComplete="false"
        placeholder="Search..."
      />
    </div>
  );
};

export default MainSearch;
