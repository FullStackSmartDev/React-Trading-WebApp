import React, { useEffect, useState } from "react";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { withStyles } from "@material-ui/core/styles";

const StyledButton = withStyles((theme) => ({
  root: {
    width: "60px",
    height: "60px",
    padding: "6px",
    marginTop: "10px",
    borderRadius: "30px"
  },
  outlined: {
    padding: "5px 15px",
    border: "2px solid #826B5D",
    "&$disabled": {
      border: "1px solid ".concat(theme.palette.action.disabled)
    }
  }
}))((props) => <Button {...props} />);

const StyledButtonGroup = withStyles((theme) => ({
  groupedHorizontal: {
    "&:not(:first-child)": {
      borderTopLeftRadius: "30px",
      borderBottomLeftRadius: "30px"
    },
    "&:not(:last-child)": {
      borderTopRightRadius: "30px",
      borderBottomRightRadius: "30px"
    }
  },
  groupedTextHorizontal: {}
}))((props) => <ButtonGroup {...props} />);

const RangeOptionSelect = (props) => {
  const [selected, setSelected] = useState(props.default);

  useEffect(() => {
    if (props.onSelectionChange) props.onSelectionChange(selected);
  }, [selected]);

  return (
    <StyledButtonGroup variant="text">
      {props.options.map((option) => (
        <StyledButton
          variant={selected === option.store ? "outlined" : "outlined"}
          onClick={() => setSelected(option.store)}
          style={
            selected === option.store
              ? {
                  border: "2px solid #826B5D",
                  borderRadius: "100px"
                }
              : {
                  border: "2px solid transparent",
                  borderRadius: "100px"
                }
          }
        >
          {option.display}
        </StyledButton>
      ))}
    </StyledButtonGroup>
  );
};

export default RangeOptionSelect;
