import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Table from "./Table";
import Chart from "./Chart";

const getData = (ticker) => {
  return {
    priceTimeSeries: [],
    col1: {},
    col2: {},
    col3: {},
    col4: {},
    col5: {}
  };
};

export default (props) => {
  const ticker = props.ticker;

  const [state, setState] = useState({
    priceTimeSeries: [],
    col1: {},
    col2: {},
    col3: {},
    col4: {},
    col5: {}
  });

  useEffect(() => {
    setState({ ...state, ...getData(ticker) });
  }, []);

  return (
    <Router>
      <Grid container>
        <Grid container xs={12}>
          <Grid item xs={3}>
            <Table size={15} />
          </Grid>
          <Grid item xs={6}>
            <Chart />
          </Grid>
          <Grid item xs={3}>
            <Table size={15} />
          </Grid>
        </Grid>

        <Grid container xs={12}>
          <Table width={1000} size={7} />
        </Grid>
      </Grid>

      <Switch>
        <Route path="/chart1"></Route>
        <Route path="/chart2"></Route>
      </Switch>
    </Router>
  );
};
