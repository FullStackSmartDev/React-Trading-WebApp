import React, { useState } from "react";

import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import { Redirect } from "react-router-dom";
import Strategies from "../Strategies";

export default () => {
  let [redirect, setRedirect] = useState(null);

  return (
    <div style={{ maxWidth: "780px", margin: "0 auto", padding: "0 30px" }}>
      {Strategies.categories.map((cat) => {
        return (
          <div>
            <p
              style={{
                fontSize: "2.5rem",
                fontWeight: "bolder",
                color: "#6bde3a",
                textAlign: "center"
              }}
            >
              {cat}
            </p>

            <GridList
              cols={2}
              cellHeight={250}
              spacing={30}
              style={{ maxWidth: "450px", margin: "0 auto" }}
            >
              {Strategies.data[cat].map((strategy) => {
                console.log(cat, strategy);
                return (
                  <GridListTile
                    key={strategy.name}
                    cols={1}
                    style={{ width: "220px" }}
                  >
                    {/*
                      really bad hack to get image working as a button, because
                      cant make image a child of anchor since GridListTile
                      expects an image to be the child, it doesnt render
                      correctly
                      */}
                    <img
                      alt={strategy.name}
                      src={`https://charts-dev.fusionpointcapital.com/${strategy.imgName}`}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setRedirect(
                          <Redirect push to={`/pro-scans/${strategy.slug}`} />
                        )
                      }
                    />
                    {redirect}
                  </GridListTile>
                );
              })}
            </GridList>
          </div>
        );
      })}
    </div>
  );
};
