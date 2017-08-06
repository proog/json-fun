let cell = {
  template: '<td class="monospace">{{ formatted }}</td>',
  props: {
    item: null,
    valueKey: String
  },
  computed: {
    formatted: function () {
      let valid = (_.isArray(this.item) || _.isPlainObject(this.item))
        && _.has(this.item, this.valueKey);

      if (!valid)
        return '';

      let value = this.item[this.valueKey];

      if (value === null)
        return 'null';

      if (_.isArray(value) || _.isPlainObject(value))
        return JSON.stringify(value);

      return _.toString(value);
    }
  }
};

let row = {
  template: '#table-output-row',
  props: {
    item: null,
    index: Number,
    keys: Array
  },
  computed: {
    typeName: function () {
      if (_.isNull(this.item))
        return 'null';
      else if (_.isArray(this.item))
        return 'array';
      return typeof this.item;
    },
    isPrimitive: function () {
      return _.isString(this.item)
        || _.isNumber(this.item)
        || _.isBoolean(this.item);
    }
  },
  components: {
    'value-cell': cell
  }
};

Vue.component('table-output', {
  template: '#table-output',
  props: {
    value: Object
  },
  computed: {
    items: function () {
      if (!this.value)
        return [];

      return _.isArray(this.value) ? this.value : [this.value];
    },
    allKeys: function () {
      if (!this.items)
        return [];

      let objectKeys = _(this.items)
        .filter(_.isPlainObject)
        .flatMap(_.keys)
        .value();
      let maxArrayLength = _(this.items)
        .filter(_.isArray)
        .map(_.size)
        .max() || 0;
      let arrayIndices = maxArrayLength > 0
        ? _.map(_.range(maxArrayLength), _.toString)
        : [];

      return _.sortBy(_.union(objectKeys, arrayIndices));
    }
  },
  components: {
    'table-row': row
  }
});
