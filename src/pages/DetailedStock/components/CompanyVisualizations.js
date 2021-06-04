import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import GaugeChart from "react-gauge-chart";
import { format } from "../utils";

const Wrapper = withStyles({
  root: {
    padding: "16px",
    "& > div": {
      marginBottom: "38px",
      "&:last-of-type": {
        marginBottom: "0"
      }
    },
    ["@media (min-width:960px)"]: {
      "& > div": {
        marginBottom: "0",
        "& .datalabels": {
          margin: "14px 10px 0 8px"
        },
        "&:last-of-type": {
          "& .datalabels": {
            marginRight: "0"
          }
        }
      }
    }
  }
})(Grid);

const ChartWrapper = withStyles({
  root: {
    alignItems: "center",
    "& .datalabels": {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      "& p": {
        margin: 0,
        wordBreak: "break-word"
      },
      "& .value": {
        color: "white",
        fontSize: "23px",
        lineHeight: "34px",
        ["@media (max-width:1300px)"]: {
          fontSize: "18px"
        }
      },
      "& .label": {
        color: "#bcc1ce",
        fontSize: "12px",
        lineHeight: "14px"
      }
    }
  }
})(Grid);

const CompanyVisualizations = (props) => {
  const { colorScheme, data, scan } = props;

  return (
    <Wrapper container>
      {data.strategy.dials.map((attr, idx) => {
        try {
          const attrType = data.attrs_slug_to_name[attr].type;
          console.log(attr, attrType);

          const val = ((value, type) => {
            if (type === "days") return (parseFloat(value) / 50) * 100;
            else if (type === "amount" || type === "count") {
              if (attrType.suffix === "M")
                return (parseFloat(value) / (1000 * 50)) * 100;
            } else if (type === "percent") return parseFloat(value) * 100;
            else if (type === "number") return parseFloat(value);

            return 0;
          })(parseFloat(data.meta[attr]), attrType.type);

          function formatting(val) {
            return parseFloat(val) !== NaN
              ? `${format(null, data.meta[attr], attrType)}`
              : "-";
          }

          let noOfLevels = 101;

          let percentVal = val / 100;
          if (scan == "general") {
            percentVal = val / 10;
          }

          if (percentVal > 1) percentVal = 1;
          else if (percentVal < 0) percentVal = 0;

          const colors = [];
          for (let i = 0; i < noOfLevels; i++) {
            if ((i + 1) / noOfLevels < percentVal) colors.push(colorScheme.hex);
            else colors.push("#343c50");
          }

          return (
            <Grid item xs={12} md={4}>
              <ChartWrapper container>
                <Grid item xs={7} md={7}>
                  <GaugeChart
                    id={`gauge-chart${idx}`}
                    className="gauge-chart"
                    nrOfLevels={noOfLevels}
                    percent={percentVal}
                    hideText
                    // colors={["#cdcdcd", "#e0e0e0", colorScheme.hex]}
                    colors={colors}
                    //colors={[colorScheme.hex, '#343c50']}
                    //arcsLength={[percentVal, 1 - percentVal]}
                    marginInPercent={0.02}
                    arcPadding={0.01}
                  />
                </Grid>
                <Grid item xs={5} md={5} style={{ textAlign: "center" }}>
                  <div className="datalabels">
                    <p className="value">{[formatting(val)]}</p>
                    <p className="label">
                      {[data.attrs_slug_to_name[attr].name]}
                    </p>
                  </div>
                </Grid>
              </ChartWrapper>
            </Grid>
          );
        } catch (e) {
          console.log(e);
        }
      })}
    </Wrapper>
  );
};

export default CompanyVisualizations;
