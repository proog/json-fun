import { autocomplete } from "./jsonparser";

describe("jsonparser", () => {
  it("should close {", () => {
    expect(autocomplete("{")).toBe("{}");
    expect(autocomplete("{[{")).toBe("{[{}]}");
  });

  it("should close [", () => {
    expect(autocomplete("[")).toBe("[]");
    expect(autocomplete("{[")).toBe("{[]}");
    expect(autocomplete("[[")).toBe("[[]]");
  });

  it('should close "', () => {
    expect(autocomplete('"')).toBe('""');
    expect(autocomplete('{["')).toBe('{[""]}');
  });

  it("should handle tokens in strings", () => {
    expect(autocomplete('["{')).toBe('["{"]');
    expect(autocomplete('"foo\\"')).toBe('"foo\\""');
    expect(autocomplete('{"":["foo\\"]')).toBe('{"":["foo\\"]"]}');
  });

  it("should close object key", () => {
    // expect(autocomplete('{"')).toBe('{"":0}');
    // expect(autocomplete('{"foo":"')).toBe('{"foo":""}');
    // expect(autocomplete('{"foo":')).toBe('{"foo":0}');
    // expect(autocomplete('{"foo":"bar","baz')).toBe('{"foo":"bar","baz":0}');
    // expect(autocomplete('{"foo":"bar","baz"')).toBe('{"foo":"bar","baz":0}');
    // expect(autocomplete('{"foo":"bar","baz":')).toBe('{"foo":"bar","baz":0}');
    // expect(autocomplete('{"foo":"bar","baz":"')).toBe('{"foo":"bar","baz":""}');
  });
});
