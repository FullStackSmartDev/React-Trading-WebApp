const converter = {
  percent: (num) => (parseFloat(num) * 100).toFixed(2),
  amount: (num) => parseFloat(num).toFixed(2),
  count: (num) => parseFloat(num).toFixed(2),
  string: (a) => a,
  url: (a) => a,
  number: (num) => parseFloat(num).toFixed(2),
  date: (a) => new Date(a),
  days: (a) => parseFloat(a).toFixed(2),
  undefined: () => "-"
};

export const format = (key, value, type) => {
  let prefix = type.prefix || "";
  let suffix = type.suffix || "";

  if (type.type === "amount" || type.type === "count")
    if (suffix === "M" && parseFloat(value) > 1000) {
      suffix = "B";
      value = parseFloat(value) / 1000;
    }

  value = converter[type.type](value);
  if (value !== NaN && value !== "NaN") return `${prefix}${value}${suffix}`;
  else return "-";
};

// https://stackoverflow.com/questions/46432335/hex-to-hsl-convert-javascript
const hexToHsl = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);

  (r /= 255), (g /= 255), (b /= 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  s = s * 100;
  s = Math.round(s);
  l = l * 100;
  l = Math.round(l);
  h = Math.round(360 * h);

  return "hsl(" + h + ", " + s + "%, " + l + "%)";
};

export const getColorScheme = (scan) => {
  const growth = {
    hex: "#37ab29"
  };
  const custom = {
    hex: "#808080"
  };
  const value = {
    hex: "#ff7600"
  };
  const general = {
    hex: "#808080"
  };

  for (let x of [growth, custom, value, general]) {
    x.hsl = hexToHsl(x.hex);
  }

  console.log(growth, custom, value);

  switch (scan) {
    case "four-stars":
    case "rocket-stocks":
    case "revenue-growth":
    case "cash-kings":
      return growth;
    case "balance-sheet-strength":
    case "earnings-yield":
    case "insider-ownership":
    case "real-buybacks":
      return custom;
    case "rnd":
    case "short-squeeze-leaders":
    case "short-squeeze-reversals":
    case "movers-and-shakers":
    case "recently-listed":
      return value;
    case "all-stocks":
      return general;
  }
};
