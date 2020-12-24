export function formatJsonError(error, input) {
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
