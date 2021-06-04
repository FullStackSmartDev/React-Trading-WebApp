import * as actionTypes from "../actions/actionTypes";
const initialState = {};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.SAVE_SYMBOL:
      let newState = { ...state };
      const { name, exchange_name } = action.payload.symbol.data;
      if (newState[action.payload.strategy] === undefined)
        newState[action.payload.strategy] = {};
      newState[action.payload.strategy][action.payload.symbol.symbol] = {
        name,
        exchange_name
      };
      return newState;
    case actionTypes.REMOVE_SYMBOL:
      if (state[action.payload.strategy] === undefined) {
        return state;
      }
      let newState1 = { ...state };
      delete newState1[action.payload.strategy][action.payload.symbol];
      return newState1;
    case actionTypes.RESET:
      return initialState;
    default:
      return state;
  }
};
