import { HashRouter, Route, Switch } from "react-router-dom";

import DetailedStockView from "./DetailedStock";
import ProScans from "./ProScans";
import Buckets from "./Buckets/index.js";
import Dashboard from "./Buckets/dashboard.js";
import React from "react";
import ScansView from "./Scan";
import MainSearch from "./components/MainSearch";
import WatchList from "./WatchList";
import TVChart from "./TVChart";
import Debug from "./Debug";

const Router = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/pro-scans/:scan/stock/:ticker/:interval">
          <DetailedStockView />
        </Route>
        <Route path="/stock/:ticker/:interval">
          <DetailedStockView />
        </Route>
        <Route path="/pro-scans/:scan">
          <ScansView />
        </Route>
        <Route path="/secrettestingroutefordashboard">
          <Dashboard />
        </Route>
        <Route path="/search">
          <MainSearch displayMode="topBar" />
        </Route>
        <Route path="/watch-list">
          <WatchList />
        </Route>
        <Route path="/librarytest">
          <TVChart
            fullscreen
            symbol={"MSFT"}
            interval={"1"}
            autosize={"True"}
          />
        </Route>
        <Route path="/debug">
          <Debug />
        </Route>
        <Route path="/">
          <Dashboard />
        </Route>
      </Switch>
    </HashRouter>
  );
};

export default Router;
