// Display of all options.
const { parseArgs } = require("parse-args");

// Add type-checking in Typescript:
// import { ParseArgsOptions } from "parse-args";

const options /* : ParseArgsOptions */ = {
  str: {
    type: "string",
    alias: "s",
    defaultValue: undefined, // cannot specify when "required" is true
    required: true,
    description: "This is a string option.",
    isValid: (value) => value.length >= 2 && value.length <= 10,
    validationError: "The string you gave is either too long or too short!",
    allowedValues: ["a", "b", "c"],
  },
  num: {
    type: "number",
    alias: "n",
    defaultValue: 12,
    required: false, // cannot specify true when "defaultValue" is not empty
    description:
      "This is a number option. Number values can be either integers or floating point numbers.",
    // Check to make sure that the given value is a floating point number and not an integer.
    isValid: (value) => Math.floor(value).toString() !== value.toString(),
    validationError: (value) =>
      'The given number "' + value + '" is not a float!',
    allowedValues: [1.5, 2.5, 3.5],
  },
  int: {
    type: "integer",
    alias: "i",
    required: false,
    description:
      "This is an integer option. Integer options check that the specified value is not a floating point number.",
    isValid: (value) => value <= 1000,
    validationError: (value) =>
      "The specified value (" + value + ") cannot be more than 1000.",
    allowedValues: [1, 2, 3],
  },
  boo: {
    type: "boolean",
    alias: "b",
    defaultValue: false,
    description:
      'This is a boolean option. Valid values are "true", "false", "1" (true) and "0" (false). These values given with or without quotes (either as a boolean literal or a string literal in Javascript) are fine, but you might as well specify them as boolean literals (without quotes).',
  },
  _throwOnErrors: false,
  _returnErrors: false,
  _verbose: false,
  _keepAll: false,
  _flagUnknowns: true,
  _ignoreUnknowns: true,
  _help: true,
  _helpTemplate: "123",
};

console.log("args = " + JSON.stringify(parseArgs()));