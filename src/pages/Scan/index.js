import { Grid, Typography } from "@material-ui/core";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import {
  MultipleChoice,
  RangeSlider,
  SingleChoice,
  SortSingleChoice,
  getMarketCapFromSlider,
  SpecialSorts
} from "./components";
import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";
import { WatchListAction } from "../../actions";
import { bindActionCreators } from "redux";
import TradingViewWidget, { Themes } from "react-tradingview-widget";
import LightweightChart from "../components/LightweightChart";
import MainSearch from "../components/MainSearch";

import ApiClient from "../ApiClient";
import Fab from "@material-ui/core/Fab";
import Bookmark from "@material-ui/icons/Bookmark";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Pagination from "@material-ui/lab/Pagination";
import Strategies from "../Strategies";
import IntervalOptions from "../IntervalOptions";
import CategoryColors from "../components/CategoryColors";
import { withStyles } from "@material-ui/core/styles";

import prepareAlgoSort from "./components/algosort/algosort.js";
import { ScansContext } from "../../store/ScansContext.js";
import { getExchangeCode } from "../TVChart/utils";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const queryOrDefault = (query, attr, def) => {
  return query.get(attr) !== null ? query.get(attr) : def;
};

var sortedLength = 0;

const Scan = (props) => {
  const { scan } = useParams();

  const [scansState, scansDispatch] = useContext(ScansContext);
  // console.log("scans context", scansState);

  // get state of scan from scan context, and use it if it looks good.
  // later, if symbols is already populated with the saved state, we
  // don't need to pull info from server.

  const [symbols, setSymbols] = useState(
    scansState != null &&
      scansState["scans"] != undefined &&
      scansState["scans"][scan] != undefined &&
      scansState["scans"][scan]["name"] == scan &&
      scansState["scans"][scan]["symbols"] != undefined
      ? scansState["scans"][scan]["symbols"]
      : []
  );

  const query = useQuery();
  const history = useHistory();
  const location = useLocation();

  const [page, setPage] = useState(
    parseInt(queryOrDefault(query, "page", "1"))
  );
  const [sort, setSort] = useState(
    queryOrDefault(query, "sort_by", "market_cap")
  );

  const [commonSorts, setCommonSorts] = useState([
    { name: "Market Cap", slug: "market_cap", default_order: true },
    { name: "Value", slug: "value", default_order: false },
    { name: "Quality", slug: "quality", default_order: true },
    { name: "Growth", slug: "growth", default_order: true },
    { name: "Dividend", slug: "dividend_yield", default_order: true },
    { name: "Short Interest", slug: "float_short", default_order: true },
    {
      name: "Days to cover short",
      slug: "days_to_cover_short",
      default_order: true
    }
  ]);

  const [specialSorts, setSpecialSorts] = useState([]);

  const [algoSortData, setAlgoSortData] = useState({});
  const [algoSortDataList, setAlgoSortDataList] = useState({});

  const [squeezeToggle, setSqueezeToggle] = useState(
    parseInt(queryOrDefault(query, "squeezeToggle", 0))
  );
  const [showSorts, setShowSorts] = useState(0);
  const [interval, setInterval] = useState("D");
  // true - descending, false - ascending
  const [order, setOrder] = useState(
    queryOrDefault(
      query,
      "order",
      commonSorts.map((x) => x.slug).indexOf(sort) === -1
        ? "1"
        : commonSorts.filter(({ slug }) => slug === sort)[0].default_order
        ? "1"
        : "0"
    ) === "1"
  );
  const [chartDimensions, setChartDimensions] = useState({
    height: 300,
    width: 400
  });

  // Keys are used for sorting, values are used for display in sort
  const sectors = {
    "Real Estate": "Real Estate",
    Utilities: "Utilities",
    "Consumer Defensive": "Staples",
    "Consumer Cyclical": "Discretionary",
    "Communication Services": "Communication Services",
    Technology: "Technology",
    Healthcare: "Healthcare",
    Biotechnology: "Biotech",
    "Financial Services": "Financials",
    Industrials: "Industrials",
    "Basic Materials": "Basic Materials",
    Energy: "Energy"
  };

  const [sector, setSector] = useState(
    queryOrDefault(query, "sector", "").split(",")
  );

  const [slider, setSlider] = useState(
    queryOrDefault(query, "slider", "0,4")
      .split(",")
      .map((num) => parseFloat(num))
  );

  // // debugging
  // useEffect(() => {
  //   console.log("rendering");
  // });

  const marketCapSteps = {
    values: [0, 250, 2 * 1000, 10 * 1000, 1000 * 1000],
    labels: ["0M", "250M", "2B", "10B", "1T+"]
  };

  const [marketCap, setMarketCap] = useState([
    getMarketCapFromSlider(slider[0], marketCapSteps),
    getMarketCapFromSlider(slider[1], marketCapSteps)
  ]);

  let strats = [];
  let mcatetory = "";
  for (let category of Strategies.categories) {
    strats = strats.concat(Strategies.data[category]);
    for (let item of Strategies.data[category])
      if (item.slug === scan) mcatetory = category;
  }

  const StyledFab = withStyles((theme) => ({
    root: {
      position: "absolute",
      bottom: "40px",
      left: "20px",
      zIndex: 100,
      backgroundColor: "#00151B",
      border: "1px solid " + CategoryColors[mcatetory],
      "&:hover": {
        backgroundColor: CategoryColors[mcatetory] + 80
      },
      "& path": {
        fill: CategoryColors[mcatetory]
      }
    }
  }))((props) => <Fab {...props} />);

  // set market cap whenever slider changees
  useEffect(() => {
    // console.log("setting market cap");
    setMarketCap([
      getMarketCapFromSlider(slider[0], marketCapSteps),
      getMarketCapFromSlider(slider[1], marketCapSteps)
    ]);
  }, [slider]);

  // get data, set symbols, commonSorts, algoSort
  useEffect(() => {
    // if we have a saved state for the scan, use that instead of pulling from server.
    console.log(scansState, symbols);
    if (
      scansState != null &&
      symbols != false &&
      scansState["scans"][scan]["symbols"] != undefined &&
      scansState["scans"][scan]["name"] == scan
    ) {
      // console.log("Symbols were loaded from context");
      let scansContextSortable = scansState["scans"][scan]["sortable"];
      let scansContextCommonMeta = scansState["scans"][scan]["common_meta"];
      let scansContextMeta = scansState["scans"][scan]["meta"];

      if (scansContextSortable != null) {
        console.log("scanscontextsortable not null");
        setCommonSorts([
          ...commonSorts,
          ...scansContextSortable.map(({ slug, default_order }) => {
            return {
              name: scansContextCommonMeta.attrs_slug_to_name[slug]?.name,
              special: true,
              slug: slug,
              default_order: default_order || true
            };
          }),

          { name: "M30", slug: "momentum30", default_order: true },
          { name: "M60", slug: "momentum60", default_order: true },
          { name: "M90", slug: "momentum90", default_order: true }
        ]);

        setSpecialSorts([
          ...scansContextMeta.special_sorts.map((slug) => {
            return {
              slug,
              name: scansContextMeta.attrs_slug_to_name[slug].name,
              default_order: false
            };
          }),
          {
            slug: "symbol",
            name: "Ticker",
            default_order: false
          }
        ]);
      }
    } else {
      console.log("scanscontextsortable null");
      // console.log("========= Pulling data from server for scans");
      ApiClient.get(`/screener/${scan}`)
        .then((res) => res.data)
        .then((data) => {
          setCommonSorts([
            ...commonSorts,
            ...data.meta.sortable.map(({ slug, default_order }) => ({
              name:
                data.common_meta.attrs_slug_to_name[slug]?.name ||
                data.meta.attrs_slug_to_name[slug]?.name,
              special: true,
              slug: slug,
              default_order: default_order || true
            })),

            { name: "M30", slug: "momentum30", default_order: true },
            { name: "M60", slug: "momentum60", default_order: true },
            { name: "M90", slug: "momentum90", default_order: true }
          ]);

          setSpecialSorts([
            ...data.meta.special_sorts.map((slug) => {
              return {
                slug,
                name: data.meta.attrs_slug_to_name[slug].name,
                default_order: false
              };
            }),
            {
              slug: "symbol",
              name: "Ticker",
              default_order: false
            }
          ]);

          const fallbacked = (attr, fallback) => {
            attr = parseFloat(attr);
            fallback = parseFloat(fallback);
            if (Number.isNaN(attr)) {
              if (Number.isNaN(fallback)) return NaN;
              else return fallback;
            } else return attr;
          };

          const fallbackAverage = (x, y) => {
            x = fallbacked(x, y);
            y = fallbacked(y, x);
            return (x + y) / 2;
          };

          // injecting derived attrs
          data.stocks = data.stocks.map((stock) => {
            stock.data.price_to_cfo_per_share =
              parseFloat(stock.data.market_cap) /
              parseFloat(stock.data.cash_from_operations_ttm);

            data.meta.dividend_yield =
              Math.abs(parseFloat(stock.data.total_dividend_paid_ttm)) /
                stock.data.market_cap ||
              stock.data.dividend_yield ||
              0;

            stock.data.growth = fallbackAverage(
              stock.data.revenue_annual_yoy,
              stock.data.revenue_quarterly_yoy
            );

            stock.data.quality = fallbackAverage(
              stock.data.operating_margin,
              stock.data.return_on_equity
            );

            stock.data.value = fallbackAverage(
              stock.data.ev_to_ebitda,
              stock.data.price_to_cfo_per_share
            );

            return stock;
          });

          scansDispatch({
            type: "SET_SYMS",
            scan: scan,
            key: "sortable",
            payload: data.meta.sortable
          });

          scansDispatch({
            type: "SET_SYMS",
            scan: scan,
            key: "common_meta",
            payload: data.common_meta
          });

          scansDispatch({
            type: "SET_SYMS",
            scan: scan,
            key: "meta",
            payload: data.meta
          });

          return data;
        })
        .then((data) => setSymbols(data.stocks))
        .then(() => {
          // console.log("Preparing Algo sort...");
          prepareAlgoSort(algoSortData, scan, setAlgoSortData);
        });
    }
  }, []);

  useEffect(() => {
    scansDispatch({
      type: "SET_SYMS",
      scan: scan,
      key: "name",
      payload: scan
    });

    scansDispatch({
      type: "SET_SYMS",
      scan: scan,
      key: "symbols",
      payload: symbols
    });
  }, [symbols]);

  useEffect(() => {
    if (Object.keys(algoSortData).length != 0) {
      let intv = Object.keys(algoSortData)[0];

      algoSortDataList[intv] = true;

      // console.log("algoSortDataList", algoSortDataList);

      addAlgoSortToSymbols(intv);
      // Since algoSortData is added asynchronously, wait until the sort data for the current interval is
      // sent, and then set sort based on that.
      if (
        IntervalOptions.intervalMap[interval] == Object.keys(algoSortData)[0]
      ) {
        setMomentumSort(IntervalOptions.intervalMap[interval]);
      }

      // once all the alsosort data has been added to the symbols list, the symbols list is complete. So, save it to context
      // for use next load.
      if (
        algoSortDataList["1d"] &&
        algoSortDataList["1wk"] &&
        algoSortDataList["1mo"]
      ) {
        console.log("Saving symbols to context");

        console.log("Algosort end", new Date());
        scansDispatch({
          type: "SET_SYMS",
          scan: scan,
          key: "symbols",
          payload: symbols
        });
      }
    }
  }, [algoSortData]);

  useEffect(() => {
    let intv = IntervalOptions.intervalMap[interval];
    setMomentumSort(intv);
  }, [interval]);

  const addAlgoSortToSymbols = (intv) => {
    try {
      var syms = Object.assign([], symbols);

      // console.log("algoSortdata is", algoSortData);
      syms.forEach(function (sym) {
        try {
          if (sym["data"]["algo"] == undefined) {
            sym["data"]["algo"] = {};
          }

          let algoVals = { rts: { momentums: {} } };
          algoVals["insqueeze"] = algoSortData[intv][sym.symbol]["insqueeze"];

          algoVals["rts"]["momentums"] =
            algoSortData[intv][sym.symbol]["rts"]["momentums"];
          algoVals["symbol"] = algoSortData[intv][sym.symbol]["symbol"];

          sym["data"]["algo"][intv] = algoVals;
        } catch (e) {}
      });

      setSymbols(syms);
      // console.log("syms is", syms);
    } catch (e) {}
  };

  const setMomentumSort = (intv) => {
    try {
      var syms = Object.assign([], symbols);

      syms.forEach(function (sym) {
        try {
          if (sym["data"]["algo"] == undefined) {
            sym["data"]["algo"] = {};
          }

          sym["data"].momentum30 = sym.data.algo[intv].rts.momentums["30"];
          sym["data"].momentum60 = sym.data.algo[intv].rts.momentums["60"];
          sym["data"].momentum90 = sym.data.algo[intv].rts.momentums["90"];
        } catch (e) {}
      });

      setSymbols(syms);
    } catch (e) {
      // console.log(e);
    }
  };

  // set chart heights whenever list of chart changes
  useEffect(() => {
    // console.log("symbols in symbols hook", symbols);
    if (symbols.length == 0) return;

    if (document.getElementsByClassName("multi-chart-block").length === 0) {
      console.log("multi-chart-block length is 0, returning");
      return;
    }

    const width = document.getElementsByClassName("multi-chart-block")[0]
      .clientWidth;
    const height = width / 1.618;

    setChartDimensions({ height, width });

    Array.from(document.getElementsByClassName("chart-container")).map(
      (container) => (container.style.height = `${height}px`)
    );
  }, [symbols, page, sort, order, sector, marketCap]);

  const perPage = 12;

  const sortSymbols = (stocks, by, order) => {
    let canBeSorted = stocks.filter(
      (x) =>
        x.data[by] !== undefined &&
        x.data[by] !== null &&
        !Number.isNaN(x.data[by])
    );
    const canBeSortedSymbolSet = new Set(canBeSorted.map((x) => x.symbol));
    const cannotBeSorted = stocks.filter(
      (x) => !canBeSortedSymbolSet.has(x.symbol)
    );

    const alphabeticalSort = (order) => {
      // descending
      if (order)
        return (first, second) => (first.symbol > second.symbol ? -1 : 1);
      // ascending
      else return (first, second) => (first.symbol > second.symbol ? 1 : -1);
    };

    // sort symbols with no values alphabetically
    cannotBeSorted.sort(alphabeticalSort(false));
    // sort symbols alphabetically, then by value
    canBeSorted.sort(alphabeticalSort(false));

    const positiveSort = (arr, by, order) => {
      return arr.sort((first, second) => {
        return order
          ? parseFloat(second.data[by]) - parseFloat(first.data[by])
          : parseFloat(first.data[by]) - parseFloat(second.data[by]);
      });
    };

    if (by === "symbol") {
      return stocks.sort(alphabeticalSort(order));
    } else if (by != "value") {
      canBeSorted = positiveSort(canBeSorted, by, order);
    } else {
      let positives = canBeSorted.filter((x) => x.data[by] > 0);
      let negatives = canBeSorted.filter((x) => x.data[by] < 0);

      positives = positiveSort(positives, by, order);
      negatives = positiveSort(
        negatives.map((x) => ({
          ...x,
          data: { ...x.data, [by]: -x.data[by] }
        })),
        by,
        order
      ).map((x) => ({
        ...x,
        data: {
          ...x.data,
          [by]: -x.data[by]
        }
      }));

      canBeSorted = [...positives, ...negatives];
    }

    // console.log("can be sorted", order, by, [
    //   ...canBeSorted.map((x) => x.data[by]),
    //   ...cannotBeSorted.map((x) => x.data[by])
    // ]);
    return [...canBeSorted, ...cannotBeSorted];
  };

  // update query parameters to reflect the state
  useEffect(() => {
    console.log(
      "updating query params",
      sort,
      sector,
      interval,
      slider,
      squeezeToggle
    );

    const params = {
      sort_by: sort,
      sector: sector,
      period: interval,
      slider: slider,
      order: order ? 1 : 0,
      page: page,
      squeezeToggle: squeezeToggle
    };
    const urlParams = new URLSearchParams();
    for (let key in params) {
      urlParams.append(key, params[key]);
    }

    history.replace({
      pathname: location.pathname,
      search: urlParams.toString()
    });
  }, [sort, sector, interval, slider, order, page, squeezeToggle]);

  const onClickFab = (stock) => {
    const strategy = strats.filter((strat) => strat.slug === scan)[0].name;

    if (isInWatchList(stock.symbol, strategy)) {
      props.actions.removeSymbol(stock.symbol, strategy);
    } else {
      props.actions.saveSymbol(stock, strategy);
    }
  };

  const isInWatchList = (symbol, strategy) => {
    if (props.watchList[strategy] === undefined) {
      return false;
    }
    return props.watchList[strategy][symbol] !== undefined;
  };

  const getCharts = (symbols, sector, sort, order, page) => {
    const sorted = sortSymbols(
      symbols
        .filter((symbol) => {
          // console.log("sector is", sector, "sector length", sector.length);

          // If there is nothing selected, show everything (include all sectors)
          const filterOnSectors =
            sector.length < 2 ? Object.keys(sectors) : sector;

          // allsectors.push(symbol.data.sector);
          return (
            filterOnSectors.indexOf(symbol.data.industry) !== -1 ||
            filterOnSectors.indexOf(symbol.data.sector) !== -1
          );
        })
        .filter(
          (symbol) =>
            parseFloat(symbol.data.market_cap) >= marketCap[0] &&
            parseFloat(symbol.data.market_cap) <= marketCap[1]
        )
        .filter((symbol) => {
          let intv = IntervalOptions.intervalMap[interval];
          if (
            symbol.data.algo != undefined &&
            symbol.data.algo[intv] != undefined &&
            symbol.data.algo[intv].insqueeze != undefined
          ) {
            return squeezeToggle
              ? symbol.data.algo[intv].insqueeze == true
              : true;
          } else {
            return true;
          }
        })
        .filter((symbol) => {
          let intv = IntervalOptions.intervalMap[interval];
          if (
            sort == "momentum30" ||
            sort == "momentum60" ||
            sort == "momentum90"
          ) {
            if (symbol.data[sort] != undefined) {
              {
                if (symbol.data[sort] == "Insufficient Data") {
                  return false;
                } else {
                  return true;
                }
              }
            } else {
              return true;
            }
          } else {
            return true;
          }
        }),
      sort,
      order
    );

    // console.log(allsectors);

    sortedLength = sorted.length;

    return sorted.length > 0
      ? sorted.slice((page - 1) * perPage, page * perPage).map((stock) => {
          const symbol = stock.symbol;
          const exchange = stock.data.exchange_name;
          const name = stock.data.name;
          const exchangeCode = getExchangeCode(exchange);

          return (
            <Grid
              item
              key={symbol}
              xs={12}
              md={4}
              style={{ padding: "5px", position: "relative" }}
              className="multi-chart-block"
            >
              <Link
                to={`/pro-scans/${scan}/stock/${exchangeCode}:${symbol}/${interval}`}
                style={{
                  zIndex: 100,
                  marginLeft: "10px",
                  color: "white"
                }}
              >
                {symbol}
                <p
                  style={{
                    color: "#ffffff",
                    fontSize: "14px"
                  }}
                >
                  {showSorts
                    ? String(
                        symbols.filter((s) => s.symbol == symbol)[0].data[sort]
                      ).slice(0, 6)
                    : ""}
                  {/*symbols.filter((s) => s.symbol == symbol)[0].data.momentum60*/}
                  {/*symbols.filter((s) => s.symbol == symbol)[0].data.momentum90*/}
                </p>
              </Link>
              <div className="chart-container">
                <Link
                  to={`/pro-scans/${scan}/stock/${exchangeCode}:${symbol}/${interval}`}
                >
                  <LightweightChart
                    symbol={`${symbol}`}
                    name={name}
                    interval={interval}
                    range={IntervalOptions.intervalRangeMap[interval]}
                    width={chartDimensions.width}
                    height={chartDimensions.height}
                  />
                </Link>
              </div>
              <StyledFab
                color="primary"
                aria-label="like"
                size="small"
                onClick={() => {
                  onClickFab(stock);
                }}
              >
                {isInWatchList(
                  symbol,
                  strats.filter((strat) => strat.slug === scan)[0].name
                ) ? (
                  <Bookmark />
                ) : (
                  <BookmarkBorderIcon />
                )}
              </StyledFab>
            </Grid>
          );
        })
      : null;
  };

  const toggleOptions = [
    {
      store: 0,
      display: "Off"
    },
    {
      store: 1,
      display: "On"
    }
  ];

  return (
    <div>
      <MainSearch displayMode="topBar" />
      <Link
        to="/"
        style={{
          position: "absolute",
          zIndex: 100,
          margin: "14px",
          textDecoration: "none",
          color: "white"
        }}
      >
        <a
          style={{
            fontSize: "24px",
            display: "flex",
            textDecoration: "none",
            alignItems: "center",
            color: "#969696"
          }}
        >
          HOME &nbsp; <ArrowForwardIosIcon />
        </a>
      </Link>
      <Link
        to="/"
        style={{
          position: "absolute",
          zIndex: 100,
          margin: "14px",
          textDecoration: "none",
          color: "white"
        }}
      >
        <a
          style={{
            fontSize: "24px",
            display: "flex",
            textDecoration: "none",
            marginLeft: "120px",
            textTransform: "uppercase",
            alignItems: "center",
            color: CategoryColors[mcatetory]
          }}
        >
          {mcatetory} : {strats.filter((strat) => strat.slug === scan)[0].name}
        </a>
      </Link>

      <Typography
        onClick={() => {
          setShowSorts(showSorts == 1 ? 0 : 1);
        }}
        variant="h4"
        align="right"
        style={{
          color: CategoryColors[mcatetory],
          textTransform: "uppercase",
          marginRight: "24px",
          margin: "14px"
        }}
      >
        {strats.filter((strat) => strat.slug === scan)[0].name}
      </Typography>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          // flexWrap: "wrap",
          backgroundColor: "rgb(31, 34, 41)"
        }}
      >
        <RangeSlider
          steps={marketCapSteps}
          defaultValue={slider}
          onChange={(...args) => setSlider((prev) => args[0])}
        />

        <SingleChoice
          name="Period"
          default={queryOrDefault(query, "period", "D")}
          options={IntervalOptions.options}
          onSelectionChange={(newInterval) => setInterval(newInterval)}
        />

        <SortSingleChoice
          name="Sort"
          default={sort}
          order={order}
          options={commonSorts.map((a) => ({
            store: a.slug,
            display: a.name,
            special: a.special,
            default_order: a.default_order
          }))}
          onSelectionChange={(new_sort, new_order) => {
            setSort((prev) => new_sort);
            setOrder((prev) => new_order);
          }}
        />

        <SingleChoice
          name="Squeeze"
          default={toggleOptions[squeezeToggle].store}
          disabled={1}
          options={toggleOptions}
          onSelectionChange={(newSqueeze) => {
            setSqueezeToggle(toggleOptions[newSqueeze].store);
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p
          style={{
            color: "white",
            backgroundColor: "#1f2229",
            width: "135px",
            borderRadius: "0px 10px 10px 0px",
            padding: "7px",
            paddingLeft: "10px",
            marginBottom: "-40px",
            height: "100%"
          }}
        >
          Total: {sortedLength}, Page: {page}
        </p>

        {/** hacky way to align sectors with special sorts and page numbers */}
        {specialSorts.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              color: "white",
              textTransform: "uppercase",
              alignItems: "center",
              margin: "8px 0 0 0",
              fontWeight: "500"
            }}
          >
            Sector
          </div>
        )}

        <SpecialSorts
          default={sort}
          order={order}
          options={specialSorts.map((a) => ({
            store: a.slug,
            display: a.name,
            default_order: a.default_order,
            special: false
          }))}
          onSelectionChange={(new_sort, new_order) => {
            setSort((prev) => new_sort);
            setOrder((prev) => new_order);
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "row",
          justifyContent: "center",
          flexWrap: "wrap"
        }}
      >
        <MultipleChoice
          name={specialSorts.length > 0 ? "" : "Sector"}
          options={Object.keys(sectors).map((a) => ({
            store: a,
            display: sectors[a]
          }))}
          onSelectionChange={(new_sector) => setSector(new_sector)}
          // change sector to csv
          default={sector}
        />
      </div>

      <Grid container style={{ backgroundColor: "#262A33" }}>
        {getCharts(symbols, sector, sort, order, page)}
      </Grid>

      <Pagination
        count={Math.ceil(symbols.length / perPage)}
        variant="outlined"
        shape="rounded"
        page={page}
        onChange={(event, newPage) => setPage(newPage)}
        style={{ marginBottom: "30px" }}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    watchList: state["watch-list"]
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(WatchListAction, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Scan);
