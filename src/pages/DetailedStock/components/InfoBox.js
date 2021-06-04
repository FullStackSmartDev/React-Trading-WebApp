import React, { useState } from "react";

const InfoBox = (props) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div
      style={{
        color: "white",
        border: "2px solid",
        padding: "5px",
        marginTop: "5px",
        boxSizing: "border-box",
        height: "100%"
      }}
    >
      <h1 style={{ color: "white" }}>{props.header}</h1>
      <div>{props.subtext}</div>
      <a href={props.anchor.link}>{props.anchor.text}</a>
      {props.description.length > 250 ? (
        collapsed ? (
          <div>
            <p>{props.description.substr(0, 250)}...</p>
            <span className="link" onClick={() => setCollapsed(false)}>
              Read More
            </span>
          </div>
        ) : (
          <div>
            <p>{props.description}</p>
            <span className="link" onClick={() => setCollapsed(true)}>
              Collapse
            </span>
          </div>
        )
      ) : (
        <p>{props.description}</p>
      )}
      {props.children}
    </div>
  );
};

export default InfoBox;
