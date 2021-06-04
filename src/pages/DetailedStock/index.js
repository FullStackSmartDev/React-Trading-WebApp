import {
  CategoryOverview,
  CompanyOverview,
  CompanyVisualizations,
  FPCTable,
  Navigation,
  StrategyOverview,
  VideoLink,
  Presentation,
  Button,
  News
} from "./components";
import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TradingViewWidget, { Themes } from "react-tradingview-widget";

import ApiClient from "../ApiClient";
import Grid from "@material-ui/core/Grid";
//import { getQuotesFor } from "yahoo-live-quotes";
import { useParams } from "react-router-dom";
import IntervalOptions from "../IntervalOptions";
import { getColorScheme } from "./utils";
import MainSearch from "../components/MainSearch";
import TVChart from "../TVChart/index.js";

const useStyles = makeStyles({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "80px"
  }
});

console.log("-------------------------- TVChart", TVChart);

export default (props) => {
  let { scan, ticker, interval } = useParams();

  // If scan is undefined, the page is being used from the /stock/${ticker}/${interval} route as a general view
  if (scan == undefined) {
    scan = "all-stocks";
  }

  // console.error(scan, ticker, interval);

  const [exchangeCode, symbol] = ticker.split(":");
  const [meta, setMeta] = useState({
    symbol: null,
    attrs_slug_to_name: {},
    meta: { description: "general" },
    strategy: {
      category: { description: "general" },
      name: "general",
      notes: "",
      dials: []
    },
    presentation_urls: []
  });
  const [showPresentation, setShowPresentation] = useState(false);
  const [news, setNews] = useState([]);

  useEffect(() => {
    try {
      const latestPresentation = meta.presentation_urls.slice(-1)?.pop();
      if (
        latestPresentation &&
        new Date().getTime() - latestPresentation.ts_created * 1000 <
          60 * 24 * 60 * 60 * 1000 // 60 days
      )
        setShowPresentation(true);
      else setShowPresentation(false);
    } catch (e) {
      console.log(e);
    }
  }, [meta.presentation_urls]);

  useEffect(() => {
    ApiClient.get(`/news/${symbol}`).then(({ data }) => setNews(data));
  }, [symbol]);

  const [currentPrice, setCurrentPrice] = useState();
  const [activePane, setActivePane] = useState("chart");
  const tvRef = useRef();

  // useEffect(() => {
  //   let interval;
  //   if (tvRef.current) {
  //     setTimeout(() => {
  //       interval = setInterval(() => {
  //         Array.from(document.querySelectorAll(".js-button-text"))
  //           .filter((a) => a.innerHTML.trim() === "log")[0]
  //           .click();
  //       }, 1000);
  //     }, 5000);
  //   }
  //   return () => clearInterval(interval);
  // }, [tvRef]);

  useEffect(() => {
    ApiClient.get(`/meta/${symbol}/${scan}`)
      .then((res) => res.data)
      .then((data) => {
        const marketCap = parseFloat(data.meta.market_cap);

        data.meta.ps_ratio = marketCap / parseFloat(data.meta.revenue);
        data.meta.price_to_tangible_book_value =
          marketCap / parseFloat(data.meta.book_value_quarterly);
        data.meta.pe_ratio = marketCap / parseFloat(data.meta.net_income);
        data.meta.price_to_cfo_per_share =
          marketCap / parseFloat(data.meta.cash_from_operations_ttm);

        data.meta.dividend_yield =
          Math.abs(parseFloat(data.meta.total_dividend_paid_ttm)) / marketCap ||
          data.meta.dividend_yield ||
          0;

        // add ps_ratio to attrs_slug_to_name
        data.attrs_slug_to_name.ps_ratio = {
          name: "PS Ratio",
          type: {
            prefix: "",
            suffix: "",
            type: "number"
          }
        };

        console.log("data is", data);
        console.log("---------- ticker changed");
        return data;
      })
      .then((data) => setMeta(data));
  }, [ticker, scan]);

  //useEffect(() => {
  //const socket = getQuotesFor([symbol], (data) => {
  //console.log("new price", data);
  //setCurrentPrice(data.price);
  //});

  //return () => socket.close();
  //}, []);

  //useEffect(() => {
  //const newMarketCap =
  //currentPrice * parseFloat(meta.meta.shares_outstanding);
  //const newPsRatio = newMarketCap / parseFloat(meta.meta.revenue);
  //todo
  //const newPbRatio = meta.meta.price_to_tangible_book_value;
  //const newPeRatio = meta.meta.pe_ratio;
  //const newPcfo = meta.meta.price_to_cfo_per_share;

  //setMeta({
  //...meta,
  //...{
  //meta: {
  //...meta.meta,
  //market_cap: newMarketCap,
  //ps_ratio: newPsRatio,
  //price_to_tangible_book_value: newPbRatio,
  //pe_ratio: newPeRatio,
  //price_to_cfo_per_share: newPcfo
  //}
  //}
  //});
  //}, [currentPrice]);

  const table = {
    core: {
      "Market Cap": "market_cap",
      Revenue: "revenue",
      "Book Value": "book_value_quarterly",
      "Cash Per Share": "cash_and_equivalents",
      "Shares Outstanding": "shares_outstanding",
      "Float Short": "float_short",
      DTC: "days_to_cover_short",
      Insiders: "insider_ownership"
    },
    performance: {
      "Revenue Growth(Annual YoY)": "revenue_annual_yoy",
      "Revenue Growth(Quarterly YoY)": "revenue_quarterly_yoy",
      "Gross Margin": "gross_profit_margin",
      "Operating Margin": "operating_margin",
      "Cash Margin": "cash_from_operations",
      ROE: "return_on_equity",
      "Current Ratio": "current_ratio",
      "Debt to Equity": "debt_to_equity_ratio"
    },
    valuation: {
      "P/S": "ps_ratio",
      "P/B": "price_to_tangible_book_value",
      PE: "pe_ratio",
      "EV/EBITDA": "ev_to_ebitda",
      "P/CFO": "price_to_cfo_per_share",
      "Dividend Yield": "dividend_yield",
      Score: "fundamental_score"
    }
  };

  const columnStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    height: "inherit"
  };

  useEffect(() => {
    while (document.getElementById("detchart") === null) continue;
    const width = document.getElementById("detchart").clientWidth;
    const height = width / 1.618;
    document.getElementById("detchartcont").style.height = `${height}px`;
    try {
      document.getElementsByClassName(
        "TVChartContainer"
      )[0].style.height = `${height}px`;
    } catch (e) {
      console.log("failed in setting chart height", e);
    }
  }, []);

  const colorScheme = getColorScheme(scan);
  const classes = useStyles();

  return (
    <div>
      <Grid container style={{ padding: 25 }}>
        <Grid item md={12}>
          <Grid container>
            {/* <Grid item md={6}>
            <CategoryOverview category={meta.strategy.category} />
          </Grid>
          <Grid item md={6}>
            <StrategyOverview strategy={meta.strategy} />
          </Grid> */}

            <header className={classes.header}>
              <Navigation
                category={meta.strategy.category}
                strategy={meta.strategy}
                symbol={symbol}
                ticker={ticker}
                interval={interval}
                colorScheme={colorScheme}
              />
              <MainSearch displayMode="integrated" />
              {/*            <VideoLink
              link="https://vimeo.com/397596302"
              colorScheme={colorScheme}
            />*/}
            </header>
            <Grid item xs={12} md={9} style={columnStyle} id="detchart">
              <div id="detchartcont" style={{ margin: "10px" }}>
                {/*FALLBACK, CHANGE TO <TradingViewWidget> TODO: add fallback for when we don't have symbol in DB */}
                <TVChart
                  // symbol={`${exchangeCode}:${symbol}`}
                  symbol={symbol}
                  theme={Themes.DARK}
                  withdateranges={true}
                  hide_side_toolbar={false}
                  interval={interval}
                  range={IntervalOptions.intervalRangeMap[interval]}
                  autosize
                  ref={tvRef}
                  style={activePane !== "chart" ? { display: "none" } : {}}
                  scan={scan}
                  meta={meta}
                />
                {showPresentation && (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      ...(activePane !== "presentation"
                        ? { display: "none" }
                        : {})
                    }}
                  >
                    <Presentation presentations={meta.presentation_urls} />
                  </div>
                )}
              </div>
              <CompanyVisualizations
                data={meta}
                colorScheme={colorScheme}
                scan={scan}
              />
              <News news={news} symbol={symbol} name={meta?.meta?.name} />
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              style={{ ...columnStyle, paddingLeft: 25 }}
            >
              <Grid container>
                <Grid item xs={6} md={12}>
                  <CompanyOverview meta={meta} />
                </Grid>
                {showPresentation && (
                  <Grid item xs={6} md={12}>
                    <Button
                      colorScheme={colorScheme}
                      style={{ width: "100%" }}
                      onClick={() => {
                        setActivePane((prevPane) =>
                          prevPane === "chart" ? "presentation" : "chart"
                        );
                      }}
                    >
                      {activePane === "chart"
                        ? "Check Presentation"
                        : "Check Chart"}
                    </Button>
                  </Grid>
                )}
                <Grid item xs={6} md={12}>
                  <FPCTable
                    table={table}
                    meta={meta}
                    colorScheme={colorScheme}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
