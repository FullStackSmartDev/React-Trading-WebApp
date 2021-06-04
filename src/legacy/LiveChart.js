import { getQuotesFor } from "yahoo-live-quotes";
import Chart from "./Chart";
import React from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

export default class LiveChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          data: []
        }
      ],
      type: "candlestick",
      interval: 60000
    };

    this.socket = null;
  }

  replaceLastDataItem = (replacement) => {
    this.setState({
      series: [
        {
          name: "price",
          data: [...this.state.series[0].data.slice(0, -1), replacement]
        }
      ]
    });
  };

  appendNewDataItem = (newData) => {
    this.setState({
      series: [
        {
          name: "price",
          data: [...this.state.series[0].data, newData]
        }
      ]
    });
  };

  clearData = async () => {
    await this.setState({ series: [{ name: "price", data: [] }] });
  };

  listenToNewStock = async () => {
    this.socket.close();
    await this.setState({ series: [{ name: "price", data: [] }], data: [] });
    this.socket = getQuotesFor([this.props.symbol], this.newQuote);
  };

  newQuote = async (data) => {
    // if candle, sample and grow the last candle or create a new candle
    if (this.state.type === "candlestick") {
      const last = this.state.series[0].data.slice(-1)[0];
      const thisTs = new Date(data.time);
      const currPrice = data.price;
      if (last === undefined) {
        // first candle
        const newCandle = {
          x: thisTs,
          y: [currPrice, currPrice, currPrice, currPrice]
        };
        return this.appendNewDataItem(newCandle);
      }

      const lastTs = last.x;

      const lastCandle = this.state.series[0].data.slice(-1)[0];

      // grow the last candle
      if (thisTs - lastTs <= this.state.interval) {
        let [open, high, low, close] = lastCandle.y;
        if (currPrice > high) high = currPrice;
        if (currPrice < low) low = currPrice;
        close = currPrice;

        const newCandle = { x: lastCandle.x };
        newCandle.y = [open, high, low, close];

        return this.replaceLastDataItem(newCandle);
      } else {
        const newCandle = {
          x: thisTs,
          y: [currPrice, currPrice, currPrice, currPrice]
        };
        return this.appendNewDataItem(newCandle);
      }
    } else {
      return this.appendNewDataItem({ x: new Date(data.time), y: data.price });
    }
  };

  componentDidMount() {
    this.socket = getQuotesFor([this.props.symbol], this.newQuote);
  }

  componentDidUpdate = async (prevProps) => {
    if (this.props.symbol !== prevProps.symbol) {
      await this.clearData();
      await this.listenToNewStock();
    }
  };

  handleTypeChange = async (event) => {
    await this.clearData();
    await this.setState({ type: event.target.value });
  };

  handleIntervalChange = async (event) => {
    await this.clearData();
    await this.setState({ interval: event.target.value });
  };

  render() {
    return (
      <div style={{ height: "60%", maxWidth: "1000px" }}>
        <Select
          value={this.state.type}
          onChange={this.handleTypeChange}
          inputProps={{
            name: "type",
            id: "type"
          }}
        >
          <MenuItem value="line">Line</MenuItem>
          <MenuItem value="candlestick">Candle</MenuItem>
        </Select>
        <Select
          value={this.state.interval}
          onChange={this.handleIntervalChange}
          inputProps={{
            name: "interval",
            id: "interval"
          }}
        >
          <MenuItem value={60000}>1 Minute</MenuItem>
          <MenuItem value={2 * 60000}>2 Minute</MenuItem>
          <MenuItem value={5 * 60000}>5 Minute</MenuItem>
          <MenuItem value={15 * 60000}>15 Minute</MenuItem>
          <MenuItem value={30 * 60000}>30 Minute</MenuItem>
          <MenuItem value={60 * 60000}>1 Hour</MenuItem>
          <MenuItem value={90 * 60000}>90 Minute</MenuItem>
          <MenuItem value={24 * 60 * 60000}>1 Day</MenuItem>
          <MenuItem value={5 * 24 * 60 * 60000}>5 Day</MenuItem>
          <MenuItem value={7 * 24 * 60 * 60000}>1 Week</MenuItem>
          <MenuItem value={30 * 24 * 60 * 60000}>1 Month</MenuItem>
          <MenuItem value={90 * 24 * 60 * 60000}>3 Month</MenuItem>
        </Select>

        <Chart
          series={this.state.series}
          symbol={this.props.symbol}
          type={this.state.type}
        />
      </div>
    );
  }
}
