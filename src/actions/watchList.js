import * as actionTypes from "./actionTypes";

const onSaveSymbol = (payload) => {
  return {
    type: actionTypes.SAVE_SYMBOL,
    payload
  };
};

const onRemoveSymbol = (payload) => {
  return {
    type: actionTypes.REMOVE_SYMBOL,
    payload
  };
};

const onReset = (payload) => {
  return {
    type: actionTypes.RESET_WATCH,
    payload
  };
};

export const saveSymbol = (symbol, strategy) => (dispatch) => {
  const payload = {
    symbol: symbol,
    strategy: strategy
  };
  dispatch(onSaveSymbol(payload));
};

export const removeSymbol = (symbol, strategy) => (dispatch) => {
  const payload = {
    symbol: symbol,
    strategy: strategy
  };
  dispatch(onRemoveSymbol(payload));
};

export const reset = () => (dispatch) => {
  dispatch(onReset());
};
