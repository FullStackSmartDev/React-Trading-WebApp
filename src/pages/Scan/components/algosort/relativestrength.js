export default function relativestrength(data, spydata, symbol, interval) {
  // looks like period of spy and stock is not always the same (missing data etc.)
  // so we need to match stock and spy times and then make the diff from there.

  var diff = [];

  // if (symbol == "FB") {
  //   console.log(
  //     "datalength:",
  //     Object.keys(data).length,
  //     data,
  //     "spydata length:",
  //     Object.keys(spydata).length,
  //     spydata
  //   );
  // }

  for (var timeval of Object.keys(data).reverse()) {
    if (data[timeval] != undefined && spydata[timeval] != undefined) {
      diff.push(data[timeval].close / spydata[timeval].close);
    }

    if (diff.length > 100) {
      // console.log("breaking at 100");
      break;
    }
  }

  // if (diff.length < 90) {
  //   console.log(
  //     interval,
  //     symbol,
  //     "diff length < 90, dataln, spydataln, diffln",
  //     Object.keys(data).length,
  //     Object.keys(spydata).length,
  //     diff.length,
  //     data,
  //     spydata
  //   );
  // }
  var momentums = {
    30: "Insufficient Data",
    60: "Insufficient Data",
    90: "Insufficient Data"
  };

  for (var period in momentums) {
    var p = parseInt(period);
    if (Object.keys(data).length < p) {
      continue;
    }

    var current = diff[0];
    var beginning = diff[p];

    var change = current - beginning;

    momentums[period] = (change / current) * 100;
  }

  for (var period in momentums) {
    if (isNaN(momentums[period])) {
      // console.log(momentums[period], current, beginning, change, diff);
      momentums[period] = "Insufficient Data";
    }
  }

  return {
    diff: diff,
    momentums: momentums
  };
}
