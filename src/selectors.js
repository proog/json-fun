import hljs from "highlight.js/lib/core";
import { createSelector } from "reselect";

export const getInput = (state) => state.input;
export const getFormatted = (state) => state.formatted;
export const getHasError = (state) => state.hasError;
export const getLanguage = (state) => state.language;

export const getHighlightedOutput = createSelector(
  getFormatted,
  getLanguage,
  getHasError,
  (formatted, language, hasError) =>
    hasError ? formatted : hljs.highlight(formatted, { language }).value
);
