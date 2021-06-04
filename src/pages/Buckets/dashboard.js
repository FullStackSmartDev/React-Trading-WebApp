import React, { useEffect, useState } from "react";

import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import { Redirect } from "react-router-dom";
import Strategies from "../Strategies";

import ApiClient from "../ApiClient";
import { Link } from "react-router-dom";

import BucketLightweightChart from "../components/BucketLightweightChart";
import BucketDashboard from "../components/BucketDashboard";

import CategoryColors from "../components/CategoryColors";

export default () => {
  let [redirect, setRedirect] = useState(null);
  return (
    <div>
      <BucketDashboard height={"400"} />

      {Strategies.categories.map((cat) => {
        return (
          <div>
            <p
              style={{
                fontSize: "2.5rem",
                fontWeight: "bolder",
                color: CategoryColors[cat],
                textAlign: "center"
              }}
            >
              {cat}
            </p>
            <GridList
              cols={2}
              cellHeight={250}
              spacing={5}
              style={{ maxWidth: "800px", margin: "0 auto" }}
            >
              {Strategies.data[cat].map((strategy) => {
                // console.log(cat, strategy);
                return (
                  <GridListTile
                    key={strategy.name}
                    cols={1}
                    style={{ width: "400px", color: "red" }}
                  >
                    <div className="dash-chart-container">
                      <Link to={`/pro-scans/${strategy.slug}`}>
                        <BucketLightweightChart
                          name={strategy.name}
                          interval={"d"}
                          range={"15m"}
                          width={"400"}
                          height={"400"}
                          source={"bucket"}
                          strategy={strategy.slug}
                        />
                      </Link>
                    </div>
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
