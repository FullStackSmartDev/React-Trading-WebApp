import React, { useState } from "react";
import "./App.css";
//import LiveChart from "./LiveChart";
//import SearchSelect from "./SearchSelect";
import Router from "./pages/Router";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import ScansStore from "./store/ScansContext.js";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    mainColor: {
      green: "rgb(54, 170, 41)",
      orange: "#ff7600",
      grey: "rgb(150, 150, 150)"
    }
  },
  typography: {
    fontFamily: ["Lato", "sans-serif"].join(",")
  }
});

function App() {
  const [symbol, setSymbol] = useState("AAPL");

  return (
    <ThemeProvider theme={darkTheme}>
      <ScansStore>
        <Router />
      </ScansStore>
    </ThemeProvider>
    /*
    <div>
      <SearchSelect
        onChange={(event, value, reason) => {
          if (reason === "reset")
            setSymbol(value);
        }}
      />
      <LiveChart symbol={symbol} />
    </div>
    */
  );
}

export default App;
