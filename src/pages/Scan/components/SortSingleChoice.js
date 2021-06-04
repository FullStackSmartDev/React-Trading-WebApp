import React, { useEffect, useState } from "react";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

export default (props) => {
  const [selected, setSelected] = useState(props.default);
  const [order, setOrder] = useState(props.order);

  // callback for when selection or order changes
  useEffect(() => {
    if (props.onSelectionChange) props.onSelectionChange(selected, order);
  }, [selected, order]);

  useEffect(() => {
    setSelected(props.default);
    setOrder(props.order);
  }, [props.default, props.order]);

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
            onClick={() => {
              if (option.store === selected) setOrder(!order);
              else setOrder(option.default_order);
              setSelected(option.store);
            }}
            style={{
              ...(selected === option.store
                ? {
                    padding: "5px",
                    border: "2px solid transparent",
                    borderBottom: "2px solid #ff7600",
                    marginTop: "8px",
                    color: "white"
                  }
                : {
                    padding: "5px",
                    border: "2px solid transparent",
                    borderBottom: "2px solid transparent",
                    marginTop: "8px",
                    color: "rgb(132, 136, 142)"
                  }),
              ...(option.special ? { color: "yellow", fontWeight: "bold" } : {})
            }}
          >
            {option.display}{" "}
            {selected === option.store ? (order ? "⌄" : "⌃") : null}
          </Button>
        ))}
      </ButtonGroup>
    </ButtonGroup>
  );
};
