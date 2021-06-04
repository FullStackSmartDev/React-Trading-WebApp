const getExchangeCode = (exchange) => {
  let exchangeCode;
  switch (exchange) {
    case "Canadian National Stock Exchange":
      exchangeCode = "";
      break;
    case "NASDAQ":
      exchangeCode = "NASDAQ";
      break;
    case "NYSE American":
      exchangeCode = "";
      break;
    case "New York Stock Exchange":
      exchangeCode = "NYSE";
      break;
    case "OTC Markets":
      exchangeCode = "OTC";
      break;
    case "TSX Venture Exchange":
      exchangeCode = "TSXV";
      break;
    case "Toronto Stock Exchange":
      exchangeCode = "TSX";
      break;
    default:
      exchangeCode = null;
  }
  return exchangeCode;
};

export { getExchangeCode };
