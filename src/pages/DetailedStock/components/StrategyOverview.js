import InfoBox from "./InfoBox";
import React from "react";
import VideoLink from "./VideoLink";

const StrategyOverview = (props) => {
  return (
    <InfoBox
      header={props.strategy.name}
      anchor={{}}
      description={props.strategy.notes}
    >
      <VideoLink link="https://vimeo.com/397596302" />
    </InfoBox>
  );
};

export default StrategyOverview;
