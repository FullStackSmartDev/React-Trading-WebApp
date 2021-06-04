// import InfoBox from "./InfoBox";
import React, { useState, useEffect } from "react";
import { styled } from "@material-ui/core/styles";
import CollapsibleText from "./CollapsibleText";

const Wrapper = styled("div")({
  color: "white",
  fontSize: "14px",
  lineHeight: "130%",
  "& .company-intro": {
    "& p": {
      margin: 0,
      fontSize: "18px"
    },
    "& .symbol": {
      textTransform: "uppercase",
      marginTop: "5px"
    }
  },
  "& .site-url": {
    color: "#428EFF",
    display: "block",
    lineHeight: "17px",
    margin: "3px 0"
  },
  "& .maininfo": {
    color: "white",
    fontSize: "14px"
  }
});

const CompanyOverview = (props) => {
  const [collapsed, setCollapsed] = useState(true);
  const metaData = props.meta;
  const [showLogo, setShowLogo] = useState(true);
  // const classes = useStyles();

  return (
    <Wrapper>
      {showLogo ? (
        <img
          src={`https://static.fusionpointcapital.com/logos/companies/${metaData.symbol}.png`}
          alt=""
          onError={() => showLogo(false)}
        />
      ) : null}

      <div className="company-intro">
        <p className="title">{metaData.meta.name}</p>
        <p className="symbol">{metaData.symbol}</p>
      </div>

      <a className="site-url" href={metaData.meta.url} target="_blank">
        Company Website
      </a>
      {metaData.meta.investor_relations_url && (
        <a
          className="site-url"
          href={metaData.meta.investor_relations_url}
          target="_blank"
        >
          Investor Relations
        </a>
      )}
      <div>
        <p className="maininfo">
          {metaData.meta.sector || "-"} | {metaData.meta.industry || "-"}
          <br />
          Next Earnings:{" "}
          {(metaData.meta.next_earnings_release?.$date &&
            new Date(
              metaData.meta.next_earnings_release?.$date
            ).toDateString()) ||
            "-"}
        </p>
      </div>
      <CollapsibleText text={metaData.meta.description} borderBottom={false} />
    </Wrapper>
  );
};

export default CompanyOverview;
