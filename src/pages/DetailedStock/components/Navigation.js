import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const Menu = ({ to, title, classes }) => {
  return (
    <>
      <span className={classes.arrow}></span>
      {to ? (
        <Link to={to} className={classes.menu}>
          {title}
        </Link>
      ) : (
        <p className={classes.menu}>{title}</p>
      )}
    </>
  );
};

const Navigation = ({
  category,
  strategy,
  symbol,
  ticker,
  interval,
  colorScheme
}) => {
  const useStyles = makeStyles((theme) => ({
    arrow: {
      display: "inline-block",
      fontSize: "12px",
      width: "10px",
      height: "10px",
      borderTop: "1px solid #a9a9a9",
      borderLeft: "1px solid #a9a9a9",
      transform: "rotate(126deg) skew(-20deg)",
      margin: "0 30px",
      ["@media (max-width:700px)"]: {
        margin: "0 10px"
      }
    },
    menu: (props) => ({
      color: "white",
      fontSize: "18px",
      lineHeight: "22px",
      fontWeight: "bold",
      ["@media (max-width:700px)"]: {
        fontSize: "14px"
      },
      textDecoration: "none",
      "&:hover": {
        color: "white"
      }
    }),
    nav: {
      display: "flex",
      alignItems: "center"
    },
    svgAlign: {
      display: "inline-flex",
      alignItems: "center"
    }
  }));
  const classes = useStyles();

  return (
    <nav className={classes.nav}>
      <Link className={classes.svgAlign} to="/">
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.18231 6.81577V15C3.18231 16.1046 4.07774 17 5.18231 17H12.8214C13.926 17 14.8214 16.1046 14.8214 15V6.81577"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M1 9.01325L9.01703 0.996216L17.0341 9.01325"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
      {category.name != "General" && (
        <div>
          <Menu
            title={category.name}
            to={{ pathname: "/pro-scans" }}
            classes={classes}
          />
          <Menu
            title={strategy.name}
            to={{ pathname: `/pro-scans/${strategy.slug}` }}
            classes={classes}
          />
        </div>
      )}
      <Menu
        title={symbol}
        to={{
          pathname: `/pro-scans/${strategy.slug}/stock/${ticker}/${interval}`
        }}
        classes={classes}
      />
    </nav>
  );
};

export default Navigation;
