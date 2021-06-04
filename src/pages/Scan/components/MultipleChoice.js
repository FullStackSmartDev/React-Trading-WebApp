import React, { useEffect, useState } from "react";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

const MultipleChoice = (props) => {
  const [selected, setSelected] = useState(props.default || []);
  // console.log(
  //   selected.length,
  //   props.options.length,
  //   selected.length == props.options.length
  // );

  const [firstAllSelected, setFirstAllSelected] = useState(
    selected.length == props.options.length
  );
  const [wasClicked, setWasClicked] = useState(false);

  // console.log("firstAllSelected", firstAllSelected);

  useEffect(() => {
    if (props.onSelectionChange) props.onSelectionChange(selected);
  }, [selected]);

  useEffect(() => {
    if (selected.length === props.options.length && wasClicked)
      setFirstAllSelected(false);
  }, [selected, wasClicked]);

  return (
    <ButtonGroup
      orientation="vertical"
      style={{
        flex: "1",
        display: "flex",
        margin: props.name === "" ? "0px 0px 6px 0px" : "12px 0px"
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
          justifyContent: "space-around",
          flex: "1",
          marginTop: "8px",
          display: "flex"
        }}
      >
        {props.options.map((option) => (
          <Button
            onClick={() => {
              setWasClicked(true);

              firstAllSelected && !wasClicked
                ? setSelected((prev) => [option.store])
                : selected.indexOf(option.store) === -1
                ? setSelected([...selected, option.store])
                : setSelected((prev) => prev.filter((a) => a !== option.store));
            }}
            style={
              firstAllSelected && !wasClicked
                ? { border: "0px", padding: "5px" }
                : selected.indexOf(option.store) !== -1
                ? {
                    color: "#FFA500",
                    border: "0px",
                    padding: "5px"
                  }
                : { border: "0px", color: "#FFFFFF", padding: "5px" }
            }
          >
            {option.display}
          </Button>
        ))}
      </ButtonGroup>
      <div
        style={{
          background: "linear-gradient(90.17deg, #FFA500 0%, #00AD30 34.9%)",
          height: "2px",
          boxShadow: "0px 2px 3px #000"
        }}
      ></div>
    </ButtonGroup>
  );
};

export default MultipleChoice;
