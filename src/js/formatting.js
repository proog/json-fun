import XmlFormatter from "./XmlFormatter";

const xmlParser = new DOMParser();
const xmlFormatter = new XmlFormatter();

export function formatInput(input) {
  const trimmed = input.trim();

  if (trimmed === "") {
    return {
      hasError: false,
      formatted: "",
      language: "json",
    };
  }

  return trimmed.startsWith("<")
    ? { ...formatXml(input), language: "xml" }
    : { ...formatJson(input), language: "json" };
}

function formatJson(input) {
  try {
    const parsed = JSON.parse(input);

    return {
      hasError: false,
      formatted: JSON.stringify(parsed, null, "  "),
    };
  } catch (e) {
    return {
      hasError: true,
      formatted: formatJsonError(e.toString(), input),
    };
  }
}

function formatXml(input) {
  const parsed = xmlParser.parseFromString(input, "application/xml");

  if (parsed.getElementsByTagName("parsererror").length) {
    return {
      hasError: true,
      formatted: "Error parsing XML string :'(",
    };
  }

  return {
    hasError: false,
    formatted: xmlFormatter.format(parsed),
  };
}

function formatJsonError(error, input) {
  let match = /SyntaxError: [\s\S]* at position (\d+)/.exec(error); // \s\S = dot + newline

  if (!match || match.length !== 2) return error;

  let position = parseInt(match[1], 10),
    lastNewline = input.lastIndexOf("\n", position - 1),
    nextNewline = input.indexOf("\n", position),
    start = Math.max(lastNewline > -1 ? lastNewline + 1 : 0, position - 20),
    end = Math.min(
      nextNewline > -1 ? nextNewline : input.length,
      position + 20
    ),
    snippet = input.substring(start, end),
    line = (input.substring(0, position).match(/\n/g) || []).length + 1,
    col = position - (lastNewline > -1 ? lastNewline : 0),
    markerIndent = " ".repeat(position - start);

  return (
    `${error}\n\n` +
    `${snippet}\n` +
    `${markerIndent}^\n` +
    `${markerIndent}(line ${line}, col ${col})`
  );
}
