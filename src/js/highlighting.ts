import hljs from "highlight.js/lib/core";
import hljson from "highlight.js/lib/languages/json";
import hlxml from "highlight.js/lib/languages/xml";

hljs.registerLanguage("json", hljson);
hljs.registerLanguage("xml", hlxml);

export function highlight(formatted: string, language: "json" | "xml") {
  return hljs.highlight(formatted, { language }).value;
}
