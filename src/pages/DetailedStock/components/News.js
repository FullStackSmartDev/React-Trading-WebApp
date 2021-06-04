import React, { useState, useEffect } from "react";
import CollapsibleText from "./CollapsibleText";
import Chip from "@material-ui/core/Chip";

const EmptyImage = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "lightgrey",
        color: "black",
        opacity: 0.6,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <span>No Image</span>
    </div>
  );
};

const News = (props) => {
  const { news, symbol, name } = props;
  const [onlyPressReleaseFilter, setOnlyPressReleaseFilter] = useState(false);
  const [filteredNews, setFilteredNews] = useState(news);

  const badgeColor = "#f19737";

  const PressRelease = ({
    onClick,
    label = "Press Release",
    activated = false
  }) => (
    <Chip
      label={label}
      variant="outlined"
      style={{
        ...(activated
          ? {
              color: "black",
              borderColor: "black",
              backgroundColor: badgeColor
            }
          : {
              color: badgeColor,
              borderColor: badgeColor,
              backgroundColor: "none"
            }),
        marginLeft: "1em"
      }}
      onClick={onClick}
    />
  );

  useEffect(() => {
    setFilteredNews(
      news.filter(({ isPressRelease }) => {
        return onlyPressReleaseFilter ? isPressRelease : true;
      })
    );
  }, [onlyPressReleaseFilter, news]);

  try {
    return (
      <div style={{ color: "white" }}>
        <h1>
          News
          <PressRelease
            label="Press Releases"
            activated={onlyPressReleaseFilter}
            onClick={() => setOnlyPressReleaseFilter((prev) => !prev)}
          />
        </h1>
        <div
          style={{
            maxHeight: "1200px",
            overflowY: "scroll"
          }}
        >
          {filteredNews.length > 0 ? (
            filteredNews.map(
              ({
                publishedDate,
                title,
                text,
                url,
                site,
                image,
                isPressRelease
              }) => {
                return (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "20% auto",
                      borderBottom: "1px solid #262D3E",
                      paddingBottom: "1em",
                      paddingTop: "1em"
                    }}
                  >
                    {image || true ? (
                      <img
                        src={
                          image ||
                          `https://static.fusionpointcapital.com/logos/companies/${symbol}.png`
                        }
                        style={{
                          width: "100%",
                          padding: "1em"
                        }}
                      />
                    ) : (
                      <EmptyImage />
                    )}
                    <div style={{ padding: "0 2em 0 2em" }}>
                      {url ? (
                        <a href={url} target="_blank">
                          <h2 style={{ color: "white" }}>{title}</h2>
                        </a>
                      ) : (
                        <h2 style={{ color: "white" }}>{title}</h2>
                      )}
                      <h4 style={{ color: "white" }}>
                        {new Date(publishedDate).toDateString()} —{" "}
                        {site || name} {isPressRelease && <PressRelease />}
                      </h4>
                      <CollapsibleText text={text} />
                    </div>
                  </div>
                );
              }
            )
          ) : (
            <h3 style={{ color: "white" }}>
              No {onlyPressReleaseFilter ? "Press Releases" : "News"} Found
            </h3>
          )}
        </div>
      </div>
    );
  } catch (e) {
    console.log("News module failing", e);
    return null;
  }
};

export default News;
