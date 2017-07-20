const INDENT = 2;
const LF = "\n";

function submitForm() {
    let inputElement = document.getElementById("input") as HTMLInputElement,
        outputElement = document.getElementById("output"),
        input = inputElement.value;

    try {
        let data = JSON.parse(input),
            formatted = format(data, 0);
        outputElement.textContent = formatted;
    }
    catch (e) {
        outputElement.textContent = `Parse error: ${e}`;
    }
}

function format(data: any, indent: number): string {
    if (_.isNumber(data))
        return "" + data;
    else if (_.isBoolean(data))
        return "" + data;
    else if (_.isNull(data))
        return "null";
    else if (_.isString(data))
        return `"${data}"`;
    else if (_.isArray(data))
        return formatArray(data, indent);
    else if (_.isObject(data))
        return formatObject(data, indent);

    return "I DON'T KNOW MAN";
}

function formatObject(o: _.Dictionary<string>, indent: number) {
    let spaces = _.repeat(" ", indent + INDENT),
        contents = Object.keys(o).map(key =>
            spaces + `"${key}": ` + format(o[key], indent + INDENT)
        );

    if (contents.length > 0) {
        return "{" + LF
            + contents.join("," + LF) + LF
            + _.repeat(" ", indent) + "}";
    }

    return "{}";
}

function formatArray(array: any[], indent: number) {
    let spaces = _.repeat(" ", indent + INDENT);

    if (array.length <= 3 && array.every(isSimple)) {
        return "[" + array.map(x => format(x, 0)).join(", ") + "]";
    }

    return "[" + LF
        + array.map(x => spaces + format(x, indent + INDENT)).join("," + LF) + LF
        + _.repeat(" ", indent) + "]";
}

function isSimple(x: any) {
    return _.isBoolean(x)
        || _.isNumber(x)
        || _.isNull(x)
        || _.isString(x) && x.length <= 5
        || _.isObject(x) && Object.keys(x).length == 0;
}
