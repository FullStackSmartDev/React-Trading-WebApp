import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const ModButton = ({ children, ...rest }) => {
  const { colorScheme } = rest;
  const res = /hsl\(\s*(\d+)\s*,\s*(\d+)\s*%\s*,\s*(\d+)\s*%\s*\)/.exec(
    colorScheme.hsl
  );
  const h = parseInt(res[1]);
  const s = parseInt(res[2]);
  const l = parseInt(res[3]);
  const offset = 20;
  const lighter = `hsl(${h}, ${s}%, ${l + offset < 100 ? l + offset : l}%)`;
  const darker = `hsl(${h}, ${s}%, ${l - offset > 0 ? l - offset : l}%)`;

  const Wrapper = withStyles({
    root: {
      fontSize: 12,
      padding: "12px 21px 14px",
      lineHeight: 1.4,
      borderRadius: 8,
      transition: ".2s all ease-in-out",
      backgroundSize: "150% 100%",
      backgroundColor: colorScheme.hex,
      backgroundImage: `linear-gradient(90deg, ${lighter} -0.03%, ${colorScheme.hex} 100.03%)`,
      "&:hover": {
        backgroundPosition: "100% 0"
      }
    }
  })(Button);
  return <Wrapper {...rest}>{children}</Wrapper>;
};

export default ModButton;
