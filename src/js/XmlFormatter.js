export default class XmlFormatter {
  constructor(step = 2) {
    this.step = step;
  }

  /**
   * @param {Document} document
   */
  format(document) {
    const declaration = this.formatDeclaration(document);
    const doctype = this.formatDoctype(document);
    const nodes = this.formatNode(document.documentElement, 0);

    return declaration + doctype + nodes;
  }

  /**
   * @param {Node} node
   * @param {number} indent
   */
  formatNode(node, indent) {
    const spaces = " ".repeat(indent);

    if (node instanceof Text)
      return spaces + this.escape(node.nodeValue).trim() + "\n";

    if (node instanceof Comment)
      return spaces + `<!-- ${this.escape(node.nodeValue).trim()} -->\n`;

    return this.formatElementNode(node, indent);
  }

  /**
   * @param {Element} node
   * @param {number} indent
   */
  formatElementNode(node, indent) {
    const spaces = " ".repeat(indent);

    let str = spaces + "<" + node.nodeName;

    for (let attr of node.attributes) {
      str += ` ${attr.name}="${this.escapeAttribute(attr.value)}"`;
    }

    let childrenStr = "";
    let compactText = false;

    // if the children consist of just one text node, we want to print it compactly on the same line
    if (
      node.childNodes.length === 1 &&
      node.childNodes.item(0) instanceof Text
    ) {
      childrenStr = this.escape(node.childNodes.item(0).nodeValue).trim();
      compactText = true;
    } else {
      for (let child of node.childNodes) {
        const childStr = this.formatNode(child, indent + this.step);

        // ignore whitespace text nodes (it's probably existing formatting, which conflicts with our own)
        if (childStr.trim().length) childrenStr += childStr;
      }
    }

    // make self-closing tag if empty
    if (!childrenStr.length) return str + "/>\n";

    if (compactText) return str + ">" + childrenStr + `</${node.nodeName}>\n`;

    return str + ">\n" + childrenStr + spaces + `</${node.nodeName}>\n`;
  }

  /**
   * @param {Document} doc
   */
  formatDeclaration(doc) {
    // don't print a declaration if it's not important
    const version = doc.xmlVersion || "1.0";
    const encoding = doc.xmlEncoding || doc.inputEncoding || "utf-8";
    const standalone = doc.xmlStandalone;

    if (version === "1.0" && encoding.toLowerCase() === "utf-8" && !standalone)
      return "";

    let declaration = `<?xml version="${version}"`;

    if (encoding) declaration += ` encoding="${encoding}"`;

    if (standalone) declaration += ` standalone="yes"`;

    declaration += "?>\n";

    return declaration;
  }

  /**
   * @param {Document} document
   */
  formatDoctype(document) {
    if (!document.doctype) return "";

    const doctype = document.doctype;

    let str = `<!DOCTYPE ${doctype.name}`;

    if (doctype.systemId)
      str += ` SYSTEM "${this.escapeAttribute(doctype.systemId)}"`;

    str += ">\n";

    return str;
  }

  /**
   * @param {string} str
   */
  escapeAttribute(str) {
    return this.escape(str).replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  }

  /**
   * @param {string} str
   */
  escape(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}
