import XmlFormatter from "./XmlFormatter";
import { ParseResult } from "./parsing";

const xmlFormatter = new XmlFormatter();

export type FormatResult = ParseResult & { formatted: string };

export function format(parseResult: ParseResult): FormatResult {
  const { language, parsed } = parseResult;

  if (parsed === undefined) {
    return { ...parseResult, formatted: "" };
  }

  const formatted =
    language === "xml" ? formatXml(parsed as Document) : formatJson(parsed);

  return { ...parseResult, formatted };
}

function formatJson(parsed: any | Error) {
  return parsed instanceof Error
    ? parsed.toString()
    : JSON.stringify(parsed, null, "  ");
}

function formatXml(parsed: Document) {
  return parsed.getElementsByTagName("parsererror").length
    ? "Error parsing XML string :'("
    : xmlFormatter.format(parsed);
}
