import { debounce } from "debounce";

export const SET_INPUT = "setInput";
export const FORMAT_INPUT = "formatInput";

export function setInput(input) {
  return { type: SET_INPUT, input };
}

export function formatInput() {
  return { type: FORMAT_INPUT };
}

const debouncedFormatInput = debounce((dispatch) => {
  dispatch(formatInput());
}, 200);

export function setAndFormatInput(input) {
  return (dispatch) => {
    dispatch(setInput(input));
    debouncedFormatInput(dispatch);
  };
}
