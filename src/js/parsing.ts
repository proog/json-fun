import Base64Decoder from "./Base64Decoder";
import JsonCompleter from "./JsonCompleter";

const xmlParser = new DOMParser();
const jsonCompleter = new JsonCompleter();
const base64Decoder = new Base64Decoder();

export type ParseResult = {
  hasError: boolean;
  parsed: undefined | unknown | Document | Error;
  language: "json" | "xml";
  completed: boolean;
  decoded: boolean;
};

export function parse(input: string): ParseResult {
  const trimmed = input.trim();
  let decoded = false;

  if (trimmed === "") {
    return {
      hasError: false,
      parsed: undefined,
      language: "json",
      completed: false,
      decoded,
    };
  }

  if (base64Decoder.isBase64(trimmed)) {
    input = base64Decoder.decode(trimmed).trim();
    decoded = true;
  }

  return trimmed.startsWith("<")
    ? { language: "xml", completed: false, decoded, ...parseXml(input) }
    : { language: "json", decoded, ...trimAndParseJson(input) };
}

function trimAndParseJson(input: string) {
  const parseResult = parseJson(input);

  if (parseResult.hasError) {
    const firstObjectOrArray = input.match(/^.*?([\{\[].*)$/);

    if (firstObjectOrArray) {
      return parseJson(firstObjectOrArray[1]);
    }
  }

  return parseResult;
}

function parseJson(input: string) {
  try {
    const parsed = JSON.parse(input);
    return { parsed, completed: false, hasError: false };
  } catch (originalParseError) {
    const completed = jsonCompleter.complete(input);

    try {
      const parsed = JSON.parse(completed);
      return { parsed, completed: true, hasError: false };
    } catch (completedParseError) {
      return { parsed: originalParseError, completed: false, hasError: true };
    }
  }
}

function parseXml(input: string) {
  const parsed = xmlParser.parseFromString(input, "application/xml");

  return {
    parsed,
    hasError: parsed.getElementsByTagName("parsererror").length > 0,
  };
}
