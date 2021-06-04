import InfoBox from "./InfoBox";
import React from "react";

const CategoryOverview = (props) => {
  return (
    <InfoBox
      header={props.category.name}
      anchor={{}}
      description={props.category.description}
    />
  );
};

export default CategoryOverview;
