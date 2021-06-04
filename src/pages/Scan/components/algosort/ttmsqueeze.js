import { sma, ema } from "./ma";
import { kc } from "./kc";
import { boll } from "./bb";

export default function ttmsqueeze(data) {
  if (data.ohlcv.length > 40) {
    var period = 20;

    var high = data["high"];
    var low = data["low"];
    var close = data["close"];
    var ohlcv = data["ohlcv"];

    var bollinger = boll(close, 20, 2);
    var keltner = kc(ohlcv, 20, 1);

    var diff = bollinger.upper.map(function (num, idx) {
      return num - keltner.upper[idx];
    });

    // if diff < 0, it's in squeeze condition

    var frame = diff.slice(1).slice(-4);

    var squeezeinframe = false;
    frame.forEach((el) => {
      if (el < 0) {
        squeezeinframe = true;
      }
    });
  } else {
    return ["Not enough data", {}];
  }

  return [
    squeezeinframe,
    { diff: diff, bollinger: bollinger, keltner: keltner }
  ];
}
