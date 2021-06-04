import { makeStyles, withStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import React from "react";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";

export const getMarketCapFromSlider = (x, steps) => {
  const val = Math.floor(x);

  const start = steps.values[val];
  const end = steps.values[val >= steps.values.length - 1 ? val : val + 1];

  const diff = end - start;

  const points = x - val;
  let mktcap = parseFloat((start + diff * points).toFixed(2));

  if (mktcap == 1000000) {
    // include all stocks if range is 1T
    mktcap = 100000000;
  }
  return mktcap;
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300 + theme.spacing(3) * 2
  },
  margin: {
    height: theme.spacing(3)
  }
}));

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const AirbnbSlider = withStyles({
  root: {
    color: "#E0E0E0",
    height: 3,
    padding: "13px 0"
  },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: "#fff",
    border: "1px solid white",
    marginTop: -9,
    marginLeft: -10,
    "&:focus,&:hover,&$active": {
      boxShadow: "#ccc 0px 2px 3px 1px"
    },
    "& .bar": {
      // display: inline-block !important;
      height: 9,
      width: 1,
      backgroundColor: "transparent",
      marginLeft: 1,
      marginRight: 1
    }
  },
  active: {
    opacity: 1,
    backgroundColor: "white"
  },
  mark: {
    width: "4px",
    height: "24px",
    position: "absolute",
    borderRadius: "2px",
    backgroundColor: "white",
    marginTop: "-11px"
  },
  valueLabel: {
    left: "calc(-50% + 4px)"
  },
  track: {
    height: 3,
    backgroundColor: "#ff7600"
  },
  rail: {
    color: "#d8d8d8",
    opacity: 1,
    height: 3
  }
})(Slider);

function AirbnbThumbComponent(props) {
  return (
    <span {...props}>
      <span className="bar" />
      <span className="bar" />
      <span className="bar" />
    </span>
  );
}

function CustomizedSlider(props) {
  const classes = useStyles();

  return (
    <ButtonGroup
      orientation="vertical"
      style={{
        margin: "2px 8px"
      }}
    >
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
        Market Cap
      </div>
      <div className={classes.root} style={{ padding: "10px" }}>
        <AirbnbSlider
          ThumbComponent={AirbnbThumbComponent}
          ValueLabelComponent={ValueLabelComponent}
          getAriaLabel={(index) =>
            index === 0 ? "Minimum price" : "Maximum price"
          }
          {...props}
        />
      </div>
    </ButtonGroup>
  );
}

export default (props) => {
  const { steps, defaultValue } = props;

  const noOfSteps = steps.values.length;

  const marks = [];
  for (let i = 0; i < noOfSteps; i++) {
    marks.push({
      value: i,
      label: steps.labels[i]
    });
  }

  return (
    <CustomizedSlider
      defaultValue={defaultValue}
      min={0}
      max={noOfSteps - 1}
      valueLabelFormat={(x) => {
        const actualValue = getMarketCapFromSlider(x, steps);
        if (actualValue === 1000 * 1000) return "1T";
        else if (actualValue > 1000) return `${actualValue / 1000}B`;
        else return `${actualValue}M`;
      }}
      onChangeCommitted={(event, value) => {
        const [start, end] = value;
        props.onChange(
          [start, end],
          [
            getMarketCapFromSlider(start, steps),
            getMarketCapFromSlider(end, steps)
          ]
        );
      }}
      marks={marks}
      step={0.01}
    />
  );
};
