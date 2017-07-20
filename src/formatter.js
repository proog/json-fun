class Formatter {
  constructor(step = 2, compact = true) {
    this.step = step;
    this.compact = compact;
  }

  format(data, indent = 0) {
    if (_.isNumber(data))
      return '' + data;
    else if (_.isBoolean(data))
      return '' + data;
    else if (_.isNull(data))
      return 'null';
    else if (_.isString(data))
      return `"${data}"`;
    else if (_.isArray(data))
      return this.formatArray(data, indent);
    else if (_.isObject(data))
      return this.formatObject(data, indent);

    return 'I DON\'T KNOW MAN';
  }

  formatObject(o, indent) {
    let spaces = _.repeat(' ', indent + this.step)
      , contents = Object.keys(o).map(key =>
        spaces + `"${key}": ` + this.format(o[key], indent + this.step)
      );

    if (this.compact && contents.length === 0)
      return '{}';

    return '{' + '\n'
      + contents.join(',' + '\n') + '\n'
      + _.repeat(' ', indent) + '}';
  }

  formatArray(array, indent) {
    let spaces = _.repeat(' ', indent + this.step);

    if (this.compact && array.length <= 5 && array.every(this.isSimple))
      return '[' + array.map(x => this.format(x)).join(', ') + ']';

    return '[' + '\n'
      + array.map(x => spaces + this.format(x, indent + this.step)).join(',' + '\n') + '\n'
      + _.repeat(' ', indent) + ']';
  }

  isSimple(x) {
    return _.isBoolean(x)
      || _.isNumber(x)
      || _.isNull(x)
      || _.isString(x) && x.length <= 5
      || _.isObject(x) && Object.keys(x).length == 0;
  }
}
