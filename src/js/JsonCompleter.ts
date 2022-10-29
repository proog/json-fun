enum Token {
  Object,
  Array,
  String,
  Key,
  ObjectValue,
}

export default class JsonCompleter {
  private stack: Token[] = [];

  complete(input: string) {
    this.stack = [];

    let previousChar: string | undefined = undefined;

    for (const char of input) {
      this.handleCharacter(char, previousChar);
      previousChar = char;
    }

    return input + this.getCompletion();
  }

  private handleCharacter(char: string, previousChar?: string) {
    const lastToken = this.stack.at(-1);

    // Bail out early if inside string or key
    if (
      char !== '"' &&
      (lastToken === Token.String || lastToken === Token.Key)
    ) {
      return;
    }

    switch (char) {
      case "{":
        if (lastToken === Token.ObjectValue) this.stack.pop();
        this.stack.push(Token.Object);
        break;
      case "[":
        if (lastToken === Token.ObjectValue) this.stack.pop();
        this.stack.push(Token.Array);
        break;
      case "}":
        this.stack.pop();
        break;
      case "]":
        this.stack.pop();
        break;
      case ":":
        this.stack.push(Token.ObjectValue);
        break;
      case '"':
        switch (lastToken) {
          case Token.Object:
            this.stack.push(Token.Key);
            break;
          case Token.Key:
          case Token.String:
            if (previousChar !== "\\") {
              this.stack.pop();
            }
            break;
          default:
            if (lastToken === Token.ObjectValue) this.stack.pop();
            this.stack.push(Token.String);
            break;
        }
        break;
      default:
        // Assume any non-whitespace values will replace an unfinished object value
        if (lastToken === Token.ObjectValue && /\S/.test(char)) {
          this.stack.pop();
        }
    }
  }

  private getCompletion() {
    let completion = "";

    for (let i = this.stack.length - 1; i >= 0; i--) {
      const token = this.stack[i];

      switch (token) {
        case Token.Object:
          completion += "}";
          break;
        case Token.Array:
          completion += "]";
          break;
        case Token.String:
          completion += '"';
          break;
        case Token.Key:
          completion += '":0';
          break;
        case Token.ObjectValue:
          completion += "0";
          break;
        default:
          throw new Error("Unhandled token " + token);
      }
    }

    return completion;
  }
}
