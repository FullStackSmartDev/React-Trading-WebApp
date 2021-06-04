const ScansReducer = (state, action) => {
  switch (action.type) {
    case "SET_SYMS":
      let scans = Object.assign({}, state.scans);

      if (scans[action.scan] == undefined) scans[action.scan] = {};
      if (scans[action.scan][action.key] == undefined)
        scans[action.scan][action.key] = {};

      scans[action.scan][action.key] = action.payload;

      return {
        scans
      };

    default:
      return state;
  }
};

export default ScansReducer;
