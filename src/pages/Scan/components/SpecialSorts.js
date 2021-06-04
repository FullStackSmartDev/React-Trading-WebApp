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
      <ButtonGroup
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
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
              padding: "5px",
              marginTop: "8px",
              ...(selected === option.store
                ? { color: "white" }
                : {
                    color: "rgb(132, 136, 142)"
                  })
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
