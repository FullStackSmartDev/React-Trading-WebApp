import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect, useSelector, useDispatch } from "react-redux";
import { WatchListAction } from "../../actions";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SwipeableViews from "react-swipeable-views";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import DeleteIcon from "@material-ui/icons/Delete";
import Strategies from "../Strategies";
import * as actionTypes from "../../actions/actionTypes";
import { getExchangeCode } from "../TVChart/utils";

const colors = {
  "Growth/Quality": "#00E56D",
  Custom: "#F97603",
  Value: "#F2F2F2"
};

const images = {
  "Growth/Quality":
    "https://kajabi-storefronts-production.global.ssl.fastly.net/kajabi-storefronts-production/themes/1185062/settings_images/Q2wugmLoRYSdqNKe600x_Scan1.png",
  Custom:
    "https://kajabi-storefronts-production.global.ssl.fastly.net/kajabi-storefronts-production/themes/1185062/settings_images/NImfTcYSSpmhYiG3Irpm_Scan2.png",
  Value:
    "https://kajabi-storefronts-production.global.ssl.fastly.net/kajabi-storefronts-production/themes/1185062/settings_images/j3GN6VnERkCDRen9KJD3_Scanimage2.png"
};

function TabPanel(props) {
  const { children, value, index, cat, ...other } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const watchList = useSelector((state) => state["watch-list"]);
  const [open, setOpen] = React.useState({});

  const handleClick = (strategy) => {
    let newOpen = { ...open };
    newOpen[strategy] = newOpen[strategy] === true ? false : true;

    setOpen(newOpen);
  };

  const onRemoveSymbol = (symbol, strategy) => {
    dispatch({
      type: actionTypes.REMOVE_SYMBOL,
      payload: { symbol: symbol, strategy: strategy }
    });
  };

  const onClickSymbol = (link) => {
    history.push(link);
  };

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <List component="nav" className={classes.list}>
          {Strategies.data[cat].map((strategy) => {
            if (
              watchList[strategy.name] === undefined ||
              Object.keys(watchList[strategy.name]).length === 0
            ) {
              return null;
            }
            return (
              <>
                <ListItem
                  button
                  onClick={() => {
                    handleClick(strategy.name);
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="h6"
                        style={{ color: colors[cat], fontWeight: "bolder" }}
                      >
                        {strategy.name}
                      </Typography>
                    }
                  />
                  {open[strategy.name] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open[strategy.name]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {Object.keys(watchList[strategy.name]).map((symbol) => {
                      const exchangeCode = getExchangeCode(
                        watchList[strategy.name][symbol].exchange_name
                      );

                      return (
                        <ListItem
                          button
                          className={classes.nested}
                          onClick={() => {
                            onClickSymbol(
                              `/pro-scans/${strategy.slug}/stock/${exchangeCode}:${symbol}/D`
                            );
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography color="textPrimary">
                                {symbol}
                              </Typography>
                            }
                            secondary={watchList[strategy.name][symbol].name}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => {
                                onRemoveSymbol(symbol, strategy.name);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              </>
            );
          })}
        </List>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: theme.palette.background.paper,
    maxWidth: "900px",
    margin: "0 auto",
    padding: "0 30px"
  },
  list: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing(4)
  }
}));

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      width: "100%",
      backgroundColor: "#EEE"
    }
  }
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  wrapper: {
    flexDirection: "row"
  }
}))((props) => <Tab {...props} />);

const WatchList = (props) => {
  const [value, setValue] = useState(0);
  const classes = useStyles();
  const theme = useTheme();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <p
        style={{
          fontSize: "2.5rem",
          fontWeight: "bolder",
          color: "#6bde3a",
          textAlign: "center"
        }}
      >
        {"Watch List"}
      </p>
      <AppBar position="static" color="default">
        <StyledTabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          {Strategies.categories.map((cat, index) => {
            return (
              <StyledTab
                label={
                  <>
                    <Typography
                      variant="subtitle1"
                      style={{
                        color: value === index ? colors[cat] : "gray",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {cat}
                    </Typography>
                    <img
                      alt={cat}
                      src={images[cat]}
                      style={{
                        height: "30px",
                        marginLeft: "5px"
                      }}
                      color="white"
                    />
                  </>
                }
                {...a11yProps(index)}
              />
            );
          })}
        </StyledTabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        {Strategies.categories.map((cat, index) => {
          return (
            <TabPanel
              value={value}
              index={index}
              dir={theme.direction}
              cat={cat}
            />
          );
        })}
      </SwipeableViews>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    watchList: state["watch-list"]
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(WatchListAction, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WatchList);
