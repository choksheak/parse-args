// Documentation of all options.
// const { parseArgs } = require("@choksheak/parse-args");
const { parseArgs } = require("../index");

/**
 * If you are using Typescript, you can add type-checking by importing the
 * options type definition:
 *
 *   import { ParseArgsOptions } from "parse-args";
 */

/**
 * The options object has two parts:
 *   1. User options.
 *   2. API options.
 *
 * API options are specific to controlling the parser behavior and always
 * begin with an underscore ("_") character. User options are any string that
 * the user can specify to add new recognizable options to the parser.
 * 
 * Type: ParseArgsOptions
 */
const options = {
  /**
   * The object key is the long name of the option.
   * E.g. if the long name is "test", then the option is specified using
   * "--test" in the command line.
   * 
   * Type: string
   */
  longName: {
    /**
     * Data type. One of "string", "number", "integer", "boolean".
     * Defines the type of generic T.
     *
     * Type: "string" | "number" | "integer" | "boolean"
     */
    type: "string",

    /**
     * Alias for the long option name. E.g. if the alias is "a", then the
     * option can be specified using -a.
     *
     * Type: string
     */
    alias: "l",

    /**
     * If the option is not specified, then set this value for the option
     * Note that defaultValue and `required: true` cannot be both set at the
     * same time.
     *
     * Type: T
     */
    defaultValue: "Default value",

    /**
     * If true, then not having this option specified is an error. Note that
     * defaultValue and `required: true` cannot be both set at the same time.
     *
     * Type: boolean
     */
    required: false,

    /**
     * Human-readable text describing this option. Will be printed in the help
     * text, and also returned as part of getHelpText().
     *
     * Type: string
     */
    description: "This is a string option.",

    /**
     * Callback function to check whether the given value is valid or not.
     * This function returns true when the value is valid, or false otherwise.
     *
     * Type: (value: T) => boolean
     */
    isValid: (value) => value.length >= 2 && value.length <= 10,

    /**
     * Either a string or a callback function to return a string. This error
     * will be included in the list of error messages when `isValid` returns
     * false. If `isValid` is not set, then `validationError` will be unused.
     *
     * Type: string | ((value: T) => string)
     */
    validationError: "The string you gave is either too long or too short!",

    /**
     * Array of values that can be specified. Note that you can perform the
     * same check using isValid, but this config is just a convenience for a
     * potentially common use case of limiting the input to a list of possible
     * values, like an enum.
     *
     * Type: T[]
     */
    allowedValues: ["a", "b", "c"],
  },

  /**
   * If the parsing encountered any errors, then throw an Error right away
   * (and stop parsing).
   * 
   * Type: boolean
   */
  _throwOnErrors: false,

  /**
   * If the parsing encountered any errors, then return all the errors as a
   * string array in the errors field. This is defaulted to false meaning that
   * all errors will be ignored and not returned at all.
   * 
   * Type: boolean
   */
  _returnErrors: false,

  /**
   * If the parsing encountered any errors, then print the error right away.
   * 
   * Type: boolean
   */
  _verbose: false,

  /**
   * When running scripts in Node JS, the first two arguments will always be
   * the node executable path and the script path. Therefore the default
   * behavior when parsing process.argv is to always discard the first two
   * arguments. If you specify _keepAll: true, then parse-args will not
   * discard the first two arguments. This is useful when you want to pass in
   * the arguments manually instead of defaulting to read from `process.argv`.
   * 
   * Type: boolean
   */
  _keepAll: false,

  /**
   * If the parsing encountered any unknown options (any user options not
   * given in the options object), then it will be treated as an error.
   * 
   * Type: boolean
   */
  _flagUnknowns: true,

  /**
   * If the parsing encountered any unknown options (any user options not
   * given in the options object), then it will be discarded and not included
   * in the returned result.
   * 
   * Type: boolean
   */
  _ignoreUnknowns: true,

  /**
   * When true, the long option `help` with alias `?` will be automatically
   * added to the list of user options. So if the user specifies `--help` or
   * `-?` on the command line, parse-args will print the help text.
   * 
   * Type: boolean
   */
  _help: true,

  /**
   * Any string that will be included in the help text. If the string
   * `{OPTIONS}` is found within the template, then it will be replaced with
   * the value of getHelpText(options). If {OPTIONS} does not exist, then the
   * template string will be printed first (without a newline character), and
   * then the value of getHelpText(options) will be printed. (Actually the two
   * strings will be concatenated and then printed all at once.)
   * 
   * Type: string
   */
  _helpTemplate: "\nUsage: node my-super-command.js <options> ...\n\n",
};

console.log("args = " + JSON.stringify(parseArgs()));
