import { test } from "uvu";
import * as assert from "uvu/assert";
import JsonCompleter from "./JsonCompleter.js";

const completer = new JsonCompleter();

test("Closes object", () => {
  const input = '{"k":"s"';
  const output = completer.complete(input);
  assert.is(output, '{"k":"s"}');
});

test("Closes string + object", () => {
  const input = '{"k":"s';
  const output = completer.complete(input);
  assert.is(output, '{"k":"s"}');
});

test("Closes number + object", () => {
  const input = '{"k":2.5';
  const output = completer.complete(input);
  assert.is(output, '{"k":2.5}');
});

test("Closes bool + object", () => {
  const input = '{"k":true';
  const output = completer.complete(input);
  assert.is(output, '{"k":true}');
});

test("Closes string + array + object", () => {
  const input = '{"k":["s';
  const output = completer.complete(input);
  assert.is(output, '{"k":["s"]}');
});

test("Closes string with JSON tokens in it", () => {
  const input = '"[{';
  const output = completer.complete(input);
  assert.is(output, '"[{"');
});

test("Closes string with escaped string token in it", () => {
  const input = '"\\"';
  const output = completer.complete(input);
  assert.is(output, '"\\""');
});

test("Closes unfinished object key", () => {
  const input = '{"k';
  const output = completer.complete(input);
  assert.is(output, '{"k":0}');
});

test("Closes unfinished object key with escaped string token in it", () => {
  const input = '{"k\\"';
  const output = completer.complete(input);
  assert.is(output, '{"k\\"":0}');
});

test("Closes unfinished object value", () => {
  const input = '{"k":';
  const output = completer.complete(input);
  assert.is(output, '{"k":0}');
});

test.run();
