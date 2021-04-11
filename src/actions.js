import { createAction } from "@reduxjs/toolkit";
import { debounce } from "debounce";

export const setInput = createAction("setInput");
export const formatInput = createAction("formatInput");

const debouncedFormatInput = debounce((dispatch) => {
  dispatch(formatInput());
}, 200);

export function setAndFormatInput(input) {
  return (dispatch) => {
    dispatch(setInput(input));
    debouncedFormatInput(dispatch);
  };
}
