import React, { useEffect, useState } from "react";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

const SingleChoice = (props) => {
  const [selected, setSelected] = useState(props.default);

  useEffect(() => {
    if (props.onSelectionChange) props.onSelectionChange(selected);
  }, [selected]);

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
        {props.name}
      </div>
      <ButtonGroup
        style={{
          flexDirection: "row",
          // flexWrap: "wrap",
          justifyContent: "center"
        }}
      >
        {props.options.map((option) => (
          <Button
            onClick={() => setSelected(option.store)}
            style={
              selected === option.store
                ? {
                    border: "2px solid transparent",
                    borderBottom: "2px solid #ff7600",
                    marginTop: "8px",
                    color: "white",
                    padding: "5px",
                    fontSize: "13px"
                  }
                : {
                    border: "2px solid transparent",
                    borderBottom: "2px solid transparent",
                    marginTop: "8px",
                    color: "rgb(132, 136, 142)",
                    padding: "5px",
                    fontSize: "13px"
                  }
            }
          >
            {option.display}
          </Button>
        ))}
      </ButtonGroup>
    </ButtonGroup>
  );
};

export default SingleChoice;
