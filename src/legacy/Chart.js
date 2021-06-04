import ReactApexChart from "react-apexcharts";
import React from "react";

export default class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    const options = {
      chart: {
        type: this.props.type || "candlestick",
        height: "auto",
        toolbar: {
          tools: {
            download: false,
            zoomin: false,
            zoomout: false,
            pan: false
          }
        },
        background: "#262A33"
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: "#6EC85A",
            downward: "#E64141"
          }
        }
      },
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      },
      grid: {
        position: "back",
        borderColor: "rgba(144, 164, 174, 0.1)",
        xaxis: {
          lines: { show: true }
        },
        row: {
          opacity: 0.1
        }
      },
      theme: {
        mode: "dark"
      }
    };

    if (!this.props.tooltip)
      options.tooltip = { enabled: true, custom: () => "" };

    this.state = {
      series: [],
      options
    };
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.type !== prevProps.type) {
      this.setState({
        options: {
          chart: { type: this.props.type }
        }
      });
    }
    if (this.props.zoomedOut !== prevProps.zoomedOut && this.props.zoomedOut) {
      this.zoomOut();
    }
  };

  zoomOut = () => {
    const series = this.props.series || this.state.series;
    const data = series[0].data;
    const min = data[0].x.getTime();
    const max = data.slice(-1)[0].x.getTime();
    this.setState({ options: { xaxis: { min, max } } });
  };

  render() {
    return (
      <div
        class="chart"
        style={{
          maxHeight: this.props.height
        }}
      >
        <ReactApexChart
          options={{ ...this.state.options, ...this.props.options }}
          series={this.props.series || this.state.series}
          type={this.props.type || "candlestick"}
        />
      </div>
    );
  }
}
