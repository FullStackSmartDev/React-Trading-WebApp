import React from "react";
import Table from "./Table";
import Grid from "@material-ui/core/Grid";
import { styled } from "@material-ui/core/styles";
import CategoryColors from "../../components/CategoryColors";

const FPCTable = (props) => {
  const { table, meta, colorScheme } = props;
  const { core, valuation, performance } = table;

  const Wrapper = styled("div")({
    height: "500px",
    overflowY: "scroll",
    "&::-webkit-scrollbar": {
      width: "5px"
    },
    "&::-webkit-scrollbar-thumb": {
      background: colorScheme.hex
    },
    "& .sectionName": {
      color: CategoryColors[meta.strategy.category.name] + " !important",
      width: "100%"
    },
    marginBottom: "10px",
    color: "white"
  });

  console.log("meta is", meta, CategoryColors, meta.strategy.category.name);

  return (
    <Wrapper>
      <Grid container>
        <div className="sectionName">
          <p>Core</p>
        </div>
        <Table table={core} meta={meta} />
        <div className="sectionName">
          <p>Performance</p>
        </div>
        <Table table={performance} meta={meta} />
        <div className="sectionName">
          <p>Valuation</p>
        </div>
        <Table table={valuation} meta={meta} />
      </Grid>
    </Wrapper>
  );
};

export default FPCTable;
