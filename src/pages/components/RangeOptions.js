const options = { "6m": "6m", "12m": "12m", "36m": "36m" };

export default {
  options: Object.keys(options).map((key) => ({
    store: options[key],
    display: key
  }))
};
