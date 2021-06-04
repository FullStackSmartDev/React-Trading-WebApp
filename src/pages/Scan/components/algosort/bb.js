import { sma, ema } from "./ma";

/**
 * Calculate bollinger band
 *
 * @param {Array} data Data Array
 * @param {Number} period Number of Periods
 * @param {Number} multiplier N-th Standard Deviation
 * @param {Boolean} simple Use SMA if true or else EMA
 *
 * @return {Object} bollinger band data - {upper: [], mid: [], lower: []}
 */
export function boll(data, period, multiplier, simple = true) {
  if (!Number.isInteger(period)) {
    throw new Error("Invalid Argument: period should be an Integer");
  }

  if (period <= 0) {
    throw new Error("Invalid Argument: period should be greater than 0");
  }

  if (typeof multiplier !== "number") {
    throw new Error("Invalid Argument: multiplier should be a Number");
  }

  let m = simple ? sma : ema;
  let mid = m(data, period);
  let upper = [];
  let lower = [];

  for (let i = 0; i < mid.length; i++) {
    let d = 0;
    for (let j = i; j < i + period; j++) {
      d += Math.pow(mid[i] - data[j], 2);
    }
    d = Math.sqrt(d / period) * multiplier;
    upper.push(mid[i] + d);
    lower.push(mid[i] - d);
  }

  return {
    upper,
    mid,
    lower
  };
}
