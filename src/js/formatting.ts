import XmlFormatter from "./XmlFormatter";
import { ParseResult } from "./parsing";

const xmlFormatter = new XmlFormatter();

export type FormatResult = {
  hasError: boolean;
  formatted: string;
  language: "json" | "xml";
  completed: boolean;
  decoded: boolean;
};

export function format(parseResult: ParseResult): FormatResult {
  const { hasError, parsed, completed, decoded, language, input } = parseResult;

  const formatted =
    language === "xml"
      ? formatXml(parsed as Document)
      : formatJson(parsed, input);

  return { hasError, language, completed, decoded, formatted };
}

function formatJson(parsed: any | Error, input: string) {
  return parsed instanceof Error
    ? formatJsonError(parsed.toString(), input)
    : JSON.stringify(parsed, null, "  ");
}

function formatXml(parsed: Document) {
  return parsed.getElementsByTagName("parsererror").length
    ? "Error parsing XML string :'("
    : xmlFormatter.format(parsed);
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
