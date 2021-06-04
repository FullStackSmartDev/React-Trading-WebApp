import ApiClient from "./ApiClient";

const transformApiDataToApexData = (data) => {
  const open = data.open.map((num) =>
    num == null ? null : Number(num.toFixed(2))
  );
  const high = data.high.map((num) =>
    num == null ? null : Number(num.toFixed(2))
  );
  const low = data.low.map((num) =>
    num == null ? null : Number(num.toFixed(2))
  );
  const close = data.close.map((num) =>
    num == null ? null : Number(num.toFixed(2))
  );
  const timestamps = data.timestamps.map((a) => a * 1000);

  const dat = [];

  console.log("transforming");

  for (let i = 0; i < timestamps.length; i++) {
    dat.push({
      x: new Date(timestamps[i]),
      y: [open[i], high[i], low[i], close[i]]
    });
  }
  return dat;
};

const getStockQuotesSeries = (symbol, interval, callback) => {
  ApiClient.get("/quotes", {
    params: { symbol: symbol, interval: interval }
  })
    .then((res) => [{ data: transformApiDataToApexData(res.data) }])
    .then(callback)
    .catch(console.log);
};

export { getStockQuotesSeries };
