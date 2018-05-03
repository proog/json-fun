import _ from 'lodash'

export default class XmlFormatter {
  constructor(step = 2) {
    this.step = step
  }

  /**
   * @param {Document} document
   */
  format(document) {
    let declaration = ''

    if (document.xmlVersion) {
      declaration = `<?xml version="${document.xmlVersion}"`

      if (document.xmlEncoding)
        declaration += ` encoding="${document.xmlEncoding}"`

      if (document.xmlStandalone)
        declaration += ` standalone="yes"`

      declaration += '?>\n'
    }

    return declaration + this.formatNode(document.documentElement, 0)
  }

  /**
   * @param {Node} node
   * @param {number} indent
   */
  formatNode(node, indent) {
    const spaces = _.repeat(' ', indent)

    if (node instanceof Text)
      return spaces + this.escape(node.nodeValue).trim() + '\n'

    if (node instanceof Comment)
      return spaces + `<!-- ${this.escape(node.nodeValue).trim()} -->\n`

    return this.formatElementNode(node, indent)
  }

  /**
   * @param {Element} node
   * @param {number} indent
   */
  formatElementNode(node, indent) {
    const spaces = _.repeat(' ', indent)

    let str = spaces + '<' + node.nodeName

    for (let attr of node.attributes) {
      str += ` ${attr.name}="${this.escapeAttribute(attr.value)}"`
    }

    let childrenStr = ''

    for (let child of node.childNodes) {
      const childStr = this.formatNode(child, indent + this.step)

      if (childStr.trim().length)
        childrenStr += childStr
    }

    if (!childrenStr.length)
      return str + '/>\n'

    return str + '>\n' + childrenStr + spaces + `</${node.nodeName}>\n`
  }

  /**
   * @param {string} str
   */
  escapeAttribute(str) {
    return this.escape(str)
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  /**
   * @param {string} str
   */
  escape(str) {
    return str.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }
}