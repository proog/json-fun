import { createAction } from "@reduxjs/toolkit";
import { debounce } from "debounce";
import { saveInputToStorage } from "./storage";

export const setInput = createAction("setInput");
export const formatInput = createAction("formatInput");

const debouncedFormatInput = debounce((dispatch) => {
  dispatch(formatInput());
}, 200);

export function setAndFormatInput(input) {
  return (dispatch) => {
    dispatch(setInput(input));
    saveInputToStorage(input);
    debouncedFormatInput(dispatch);
  };
}
