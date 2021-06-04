//const options = [
//  "1m",
//  "2m",
//  "5m",
//  "15m",
//  "30m",
//  "60m",
//  "90m",
//  "1d",
//  "5d",
//  "1wk",
//  "1mo"
//  "3mo"
// ].map(val => ({ store: val, display: val }));
const options = {
  "6mo": "d",
  daily: "D",
  weekly: "W",
  monthly: "M"
};

const intervalRangeMap = {
  d: "6m",
  D: "12m",
  W: "60m",
  M: "120m"
};

export { options, intervalRangeMap };

/*
-------------------------------------
| category: strategy | sort1 | sort2 |
| sector filters | period selector   |
| market cap slider | general sorts  |
--------------------------------------
*/
