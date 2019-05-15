import _ from "lodash";

export function parseJson(input) {
  try {
    return JSON.parse(input);
  } catch (e) {
    const completed = autocomplete(input);
    return JSON.parse(completed);
  }
}

export function autocomplete(input) {
  const context = [];

  for (const current of input) {
    const previous = _.last(context);

    if (isEscape(previous)) {
      context.pop();
      continue;
    }

    if (isEscape(current)) {
      context.push(current);
      continue;
    }

    if (isQuote(previous) && !isQuote(current)) {
      continue;
    }

    if (isTerminating(current, previous)) {
      context.pop();
    } else if (isOpening(current)) {
      context.push(current);
    }
  }

  const toTerminator = {
    "{": "}",
    "[": "]",
    '"': '"'
  };

  for (const opener of context.reverse()) {
    input += toTerminator[opener];
  }

  return input;
}

function isEscape(char) {
  return char === "\\";
}

function isQuote(char) {
  return char === '"';
}

function isOpening(char) {
  return _.includes(["{", "[", '"'], char);
}

function isTerminating(terminator, opener) {
  return (
    (terminator === "}" && opener === "{") ||
    (terminator === "]" && opener === "[") ||
    (terminator === '"' && opener === '"')
  );
}
