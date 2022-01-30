const OBJECT = 1;
const ARRAY = 2;
const STRING = 3;
const KEY = 4;
const OBJECT_VALUE = 5;

export default class JsonCompleter {
  complete(input) {
    this.stack = [];

    let previousChar = undefined;

    for (const char of input) {
      this.#handleCharacter(char, previousChar);
      previousChar = char;
    }

    return input + this.#getCompletion();
  }

  #handleCharacter(char, previousChar) {
    const lastToken = this.stack.at(-1);

    // Bail out early if inside string or key
    if (char !== '"' && (lastToken === STRING || lastToken === KEY)) {
      return;
    }

    switch (char) {
      case "{":
        if (lastToken === OBJECT_VALUE) this.stack.pop();
        this.stack.push(OBJECT);
        break;
      case "[":
        if (lastToken === OBJECT_VALUE) this.stack.pop();
        this.stack.push(ARRAY);
        break;
      case "}":
        this.stack.pop();
        break;
      case "]":
        this.stack.pop();
        break;
      case ":":
        this.stack.push(OBJECT_VALUE);
        break;
      case '"':
        switch (lastToken) {
          case OBJECT:
            this.stack.push(KEY);
            break;
          case KEY:
          case STRING:
            if (previousChar !== "\\") {
              this.stack.pop();
            }
            break;
          default:
            if (lastToken === OBJECT_VALUE) this.stack.pop();
            this.stack.push(STRING);
            break;
        }
        break;
      default:
        // Assume any non-whitespace values will replace an unfinished object value
        if (lastToken === OBJECT_VALUE && /\S/.test(char)) {
          this.stack.pop();
        }
    }
  }

  #getCompletion() {
    let completion = "";

    for (let i = this.stack.length - 1; i >= 0; i--) {
      const token = this.stack[i];

      switch (token) {
        case OBJECT:
          completion += "}";
          break;
        case ARRAY:
          completion += "]";
          break;
        case STRING:
          completion += '"';
          break;
        case KEY:
          completion += '":0';
          break;
        case OBJECT_VALUE:
          completion += "0";
          break;
        default:
          throw new Error("Unhandled token " + token);
      }
    }

    return completion;
  }
}
