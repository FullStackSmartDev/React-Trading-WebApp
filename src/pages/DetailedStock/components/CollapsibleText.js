import React, { useState } from "react";
import { styled } from "@material-ui/core/styles";

const Wrapper = styled("div")({
  color: "white",
  fontSize: "14px",
  lineHeight: "130%",
  "& .inactive": {
    color: "#565D70"
  },
  "& .set-description": {
    color: "white",
    cursor: "pointer",
    display: "block",
    textAlign: "center",
    fontSize: "12px",
    padding: "10px 0 20px",
    borderBottom: (props) => (props.borderBottom ? "" : "1px solid #262D3E")
  }
});

const CollapsibleText = ({ text, borderBottom = true }) => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <Wrapper borderBottom={borderBottom}>
      {text.length > 300 ? (
        collapsed ? (
          <div className="inactive">
            <p>{text.substr(0, 250)}...</p>
            <span
              className="set-description"
              onClick={() => setCollapsed(false)}
            >
              Read More
            </span>
          </div>
        ) : (
          <div>
            <p>{text}</p>
            <span
              className="set-description"
              onClick={() => setCollapsed(true)}
            >
              Collapse
            </span>
          </div>
        )
      ) : (
        <p>{text}</p>
      )}
    </Wrapper>
  );
};

export default CollapsibleText;
