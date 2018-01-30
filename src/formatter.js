import _ from 'lodash'

class Formatter {
  constructor(step = 2, compact = true) {
    this.step = step
    this.compact = compact
  }

  format(value, indent = 0) {
    if (_.isNull(value))
      return 'null'
    else if (_.isString(value))
      return `"${value}"`
    else if (_.isArray(value))
      return this.formatArray(value, indent)
    else if (_.isObject(value))
      return this.formatObject(value, indent)
    return _.toString(value)
  }

  formatObject(object, indent) {
    if (_.isEmpty(object))
      return '{}'

    if (this.compact && _.keys(object).length === 1 && _.every(object, this.isSimple)) {
      let formatted = _.map(object, (value, key) =>
        `"${key}": ` + this.format(value, indent + this.step)
      )
      return '{ ' + _.head(formatted) + ' }'
    }

    let spaces = _.repeat(' ', indent + this.step)
      , formatted = _.map(object, (value, key) =>
        `${spaces}"${key}": ` + this.format(value, indent + this.step)
      )

    return '{\n'
      + _.join(formatted, ',\n') + '\n'
      + _.repeat(' ', indent) + '}'
  }

  formatArray(array, indent) {
    if (_.isEmpty(array))
      return '[]'

    if (this.compact && array.length <= 5 && _.every(array, this.isSimple))
      return '[ ' + _.join(_.map(array, x => this.format(x)), ', ') + ' ]'

    let spaces = _.repeat(' ', indent + this.step)

    return '[\n'
      + _.join(_.map(array, x => spaces + this.format(x, indent + this.step)), ',\n') + '\n'
      + _.repeat(' ', indent) + ']'
  }

  isSimple(x) {
    return _.isBoolean(x)
      || _.isNumber(x)
      || _.isNull(x)
      || _.isString(x) && x.length <= 5
      || _.isArray(x) && _.isEmpty(x)
      || _.isObject(x) && _.isEmpty(x)
  }
}
