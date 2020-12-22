# parse-args 🖥️
Yet another command-line arguments parser that is minimalist and easy to use!

## Installation

**Install Prod:** `npm i @choksheak/parse-args`

**Install Dev :** `npm i -D @choksheak/parse-args`

## Why use this library?

There are many argument parsing libraries out there, and many are quite similar, but none of them is quite like this one. I wanted something that lets me deal with the absolute minimum amount of hassle in the setup and use of the library, and also works in a simple-to-understand way. Therefore I decided to write one on my own for some of the following reasons:

1. Works out-of-the-box with no configuration.
2. No package dependencies since this is mainly string manipulation only.
3. Tiny and fast.
4. Typescript typings included.
5. Easy to understand user interface (hopefully!).
6. No super advanced features that I will never need.
7. No confusing syntax, especially with the attachments of values to options (or not) (see below for more details).
8. Intuitive and straightforward syntax.
9. Generates the help text automatically in a customizable way.
10. Able to attach user-specific arguments-checking to the options.
11. Option to either use imperative or object-oriented syntax style (depending on which style better fits the look-and-feel of your code base).
12. Fun to use! (IMHO)

Arguments-parsing is a non-standardized world with many caveats and corner cases. This library tries to avoid all that and stick to the basic minimum syntax for a clean-working CLI (command-line interface).

In summary, this library aims to be perfect for use in your CLI if you want something that is easy-to-use and can generate the help text automatically for you, thus saving you a lot of time!

## Design philosophy

parse-args is designed to offer full command line parsing control to the developer. This means that it returns all the parsed arguments, but does not handle much before or after that. Most CLIs have their own custom logic with dealing with the arguments, and parse-args fully supports that paradigm. parse-args does not box you into any particular paradigm, but frees you up to add whatever logic you need for your application without creating a burden to you.

For example, in the most basic use case, you will just call `parseArgs()` without any arguments (using the default behavior) and get the parsed results. Then you will interpret the parsed results in whatever way you need for your application.The custom logic needed here is hard if not impossible to standardize, and parse-args does not attempt in any way to standardize it.

## Simple example

Javascript: `print-args.js`
```js
const { parseArgs } = require("parse-args");

const args = parseArgs();
console.log("args = " + JSON.stringify(args));
```

Shell usage and output:
```sh
> node print-args.js --long -a -bcd --format=%s file1 file2
{"long":true,"a":true,"b":true,"c":true,"d":true,"format":"%s","nonOptions":["file1","file2"]}
```

## Advanced example

Javascript: `ls.js`
```js
const { parseArgs } = require("parse-args");

const args = parseArgs({
  long: { alias: "l", description: "use a long listing format" },
  accesstime: {
    alias: "u",
    type: "boolean",
    description:
      "with -lt: sort by, and show, access time; " +
      "with -l: show access time and sort by name; " +
      "otherwise: sort by access time",
  },
  _help: true,
  _ignoreUnknowns: true,
  _helpTemplate:
    "\nUsage: node ls.js <options>\n\n" +
    "  List all your files!\n\n" +
    "Options:\n\n{OPTIONS}\n\n" +
    "Have fun seeing all your files!\n",
});

console.log("args = " + JSON.stringify(args));
```

Shell usage and output:
```sh
> node ls.js --help

Usage: node ls.js <options>

  List all your files!

Options:

  -l, --long        use a long listing format
  -u, --accesstime  with -lt: sort by, and show, access time; with -l: show
                    access time and sort by name; otherwise: sort by access time
  -?, --help        Show the help text.

Have fun seeing all your files!

args = {"help":true}
```

## Command line syntax

The syntax should feel somewhat familiar to most bash/linux command-line users. The following rules describe the syntax:

1. Options beginning with `--` is followed by the long name, optionally followed by the argument value. E.g. `--clean`, `--name=John`.
2. Options beginning with `-` is followed by one or more short names, or option aliases. E.g. `-a` gives you `{a:true}`, `-abc` gives you `{a:true, b:true, c:true}`.
3. Untyped arguments default to boolean type (true/false), but any string value may be attached to it. E.g. `-a` gives you `{a:true}`, and `-a=123` gives you `{a:"123"}.
4. Option values may only be specified using the `=` sign. E.g. `-a=1` works but `-a 1` does not attach the value `1` to `-a`.
4. All arguments after a `--` argument are treated as non-options. E.g. `-a -b -- -c --` gives you `{a:true, b:true, nonOptions:["-c", "--"]}`.
5. Non-option arguments may appear in any order, and will be returned as a single list. E.g. `a -b c -d e` gives you `{b:true, d:true, nonOptions:["a","c","e"]}`.
6. Option names may not begin with `-` (dash) or `_` (underscore). Underscore is reserved for API options.
7. The option names "nonOptions" and "errors" are reserved for use in the returned result.

## API

The available API methods are:

**CommonJS**
```js
const { parseArgs, printHelp, getHelpText, setOutputPrinter, ArgsParser } = require("parse-args");
```

**ES6 / Typescript**
```js
import { parseArgs, printHelp, getHelpText, setOutputPrinter, ArgsParser } from "parse-args";
```

| API Method | Description |
| :--------- | :---------- |
| parseArgs  | Parse the node process arguments, or the given arguments.<br>parseArgs(options: ParseArgsOptions)<br>parseArgs(argv: string[], options: ParseArgsOptions)<br>Returns the parsed result object of type ParseArgsResult. |
| printHelp  | Print the help text using `console.log()`, or the output printer set using `setOutputPrinter()`.<br>printHelp(options: ParseArgsOptions) |
| getHelpText | Get the help text string.<br>getHelpText(options: ParseArgsOptions) |
| setOutputPrinter | Set the output printer for printing the help text and the error messages. Note that you can also use this function to save the printed text as a string or save into a file etc. This could be useful for unit testing etc.<br>setOutputPrinter(log: ((s: string) => void)) |
| ArgsParser | Class-based implementation of the arguments parser.<br>`const argsParser = new ArgsParser(options /* : ParseArgsOptions */);` |

### ArgsParser class

The class-based arguments-parser does the exact same thing as the imperative-based functions. The class definition is as follows:

```ts
class ArgsParser {
  constructor(options?: ParseArgsOptions);

  parse(argv?: string[]): ParseArgsResult;

  getHelpText(): string;

  printHelp(): void;
}
```

Using the class-based implementation should be quite straightforward as well:
```ts
import { ArgsParser } from "parse-args";

const options: ParseArgsOptions = {...};
const argsParser = new ArgsParser(options);

const result: ParseArgsResult = argsParser.parse();
console.log("result = " + JSON.stringify(result));

argsParser.printHelp();
console.log("Help text = " + argsParser.getHelpText());
```

The main differences between the class-based implementation and the imperative-based approaches are:

1. The function name to parse arguments is `[instance].parse()` instead of `parseArgs()`.
2. The `options` object is passed in only once at the constructor, and not passed in at each function.
3. `setOutputPrinter()` only exists at the global level and not in the ArgsParser class.

## Options

The options configuration is likely the most complex part of understanding and using this library. Note that everything in the options is optional, including the options itself! Therefore you don't need to understand the options config to get the code working right away, but if you use them, it could help you to save writing more code later, thus ultimately saving you time!

In Typescript, just import the `ParseArgsOptions` type to get static type-checking for your options object.
```
import { ParseArgsOptions } from "parse-args";
```

Any option that begins with an underscore `_` is an "API option". Any other string is a "user option".

| Option | Data type | Description |
| :--------- | :---------- | :---------- |
| `_throwOnErrors` | boolean (default to false). | If the parsing encountered any errors, then throw an Error right away (and stop parsing). |
| `_returnErrors` | boolean (default to false) | If the parsing encountered any errors, then return all the errors as a string array in the `errors` field. This is defaulted to false meaning that all errors will be ignored and not returned at all. |
| `_verbose` | boolean (default to false) | If the parsing encountered any errors, then print the error right away. |
| `_keepAll` | boolean (default to false) | When running scripts in Node JS, the first two arguments will always be the node executable path and the script path. Therefore the default behavior when parsing `process.argv` is to always discard the first two arguments. If you specify `_keepAll: true`, then parse-args will not discard the first two arguments. This is useful when you want to pass in the arguments manually instead of defaulting to read from the `process.argv`. |
| `_flagUnknowns` | boolean (default to false) | If the parsing encountered any unknown options (any user options not given in the `options` object), then it will be treated as an error. |
| `_ignoreUnknowns` | boolean (default to false) | If the parsing encountered any unknown options (any user options not given in the `options` object), then it will be discarded and not included in the returned result. |
| `_help` | boolean (default to false) | When true, the long option `help` with alias `?` will be automatically added to the list of user options. So if the user specifies `--help` or `-?` on the command line, parse-args will print the help text. |
| `_helpTemplate` | string (default to empty) | Any string that will be included in the help text. If the string `{OPTIONS}` is found within the template, then it will be replaced with the value of `getHelpText(options)`. If `{OPTIONS}` does not exist, then the template string will be printed first (without a newline character), and then the value of `getHelpText(options)` will be printed. (Actually the two strings will be concatenated and then printed all at once.) |
| Any other string | object of type `ParseArgsOptionConfig` | This string key will become the long name of the option. This string cannot begin with a dash or underscore character. The value is an object specifying the properties of this option. |

### ParseArgsOptionConfig type
For each user option (option that the user has added), the option can be configured using the ParseArgsOptionConfig object.

In Typescript, just import the `ParseArgsOptionConfig` type to get static type-checking for your option config object.
```
import { ParseArgsOptionConfig } from "parse-args";
```

| Config | Data type | Description |
| :------| :-------- | :---------- |
| type | string (OptionTypes) | Data type. One of "string", "number", "integer", "boolean". |
| alias | string (one character) | Alias for the long option name. E.g. if the alias is "a", then the option can be specified using `-a`. |
| defaultValue | T (as specified in `type`) | If the option is not specified, then set this value for the option. Note that `defaultValue` and `required: true` cannot be both set at the same time. |
| required | boolean | If true, then not having this option specified is an error. Note that `defaultValue` and `required: true` cannot be both set at the same time. |
| description | string | Human-readable text describing this option. Will be printed in the help text. |
| isValid | (value: T) => boolean | Callback function to check whether the given value is valid or not. This function returns true when the value is valid, or false otherwise. |
| validationError | string | ((value: T) => string) | Either a string or a callback function to return a string. This error will be included in the list of error messages when `isValid` returns false. If `isValid` is not set, then `validationError` will be unused. |
| allowedValues | `T[]` | Array of values that can be specified. Note that you can perform the same check using `isValid`, but this config is just a convenience for a potentially common use case of limiting the input to a list of possible values, like an enum. |

## Confusion with option values attachment

In some CLIs, you can specify option values either using an equal sign, or separating the option and the value with a space. E.g.
```sh
node cli.js -f=file.txt  # using equal sign
node cli.js -f file.txt  # separate with space
```

The problem is that it might not be clear if the option does take a value or not. E.g. for `node cli.js -f file.txt`, should it produce 1 or 2?

1. `{ f: "file.txt" }`
2. `{ f: true, nonOptions: ["file.txt"] }`

By looking at the command without any background knowledge, there is no way to tell. Therefore, it is much less confusing (IMHO) for the end-user if we always use the equal sign to attach the option value, and treat a space as separating between unrelated arguments.

In parse-args, we always use the equal sign to attach the option value. Thus there is no confusion. 😉

## Summary

Thanks for reading this and I hope this small utility meets all your command-line parsing needs! If not, please feel free to drop me an email at choksheak@gmail.com. 😸
