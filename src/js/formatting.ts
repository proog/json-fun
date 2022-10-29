import JsonCompleter from "./JsonCompleter";
import XmlFormatter from "./XmlFormatter";

const xmlParser = new DOMParser();
const xmlFormatter = new XmlFormatter();
const jsonCompleter = new JsonCompleter();

type FormatResult = {
  hasError: boolean;
  formatted: string;
  language: "json" | "xml";
  completed: boolean;
};

export function formatInput(input: string): FormatResult {
  const trimmed = input.trim();

  if (trimmed === "") {
    return {
      hasError: false,
      formatted: "",
      language: "json",
      completed: false,
    };
  }

  return trimmed.startsWith("<")
    ? { language: "xml", completed: false, ...formatXml(input) }
    : { language: "json", completed: false, ...formatJson(input) };
}

function formatJson(input: string) {
  try {
    const { parsed, completed } = parseJson(input);

    return {
      hasError: false,
      formatted: JSON.stringify(parsed, null, "  "),
      completed,
    };
  } catch (e) {
    return {
      hasError: true,
      formatted: formatJsonError((e as Error).toString(), input),
    };
  }
}

function parseJson(input: string) {
  try {
    const parsed = JSON.parse(input);
    return { parsed, completed: false };
  } catch (originalParseError) {
    const completed = jsonCompleter.complete(input);

    try {
      const parsed = JSON.parse(completed);
      return { parsed, completed: true };
    } catch (completedParseError) {
      throw originalParseError;
    }
  }
}

function formatXml(input: string) {
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

function formatJsonError(error: string, input: string) {
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
