# parse-args 🖥️
Yet another command-line arguments parser that is minimalist and easy to use!

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
7. No confusing syntax, especially with the attachments of values to options (or not).
8. Intuitive and straightforward syntax.
9. Generates the help text automatically in a customizable way.
10. Able to attach user-specific arguments-checking to the options.
11. Option to either use imperative or object-oriented syntax style (depending on what fits your code base).

Arguments-parsing is a non-standardized world with many caveats and corner cases. This library tries to avoid all that and stick to the basic minimum syntax for a clean-working CLI.

## Simple example
Javascript: `print-args.js`
```js
const { parseArgs } = require("parse-args");
const args = parseArgs();
console.log("args = " + JSON.stringify(args));
```

Shell:
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
      "with -lt: sort by, and show, access time; with -l: show access time and sort by name; otherwise: sort by access time",
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

Shell:
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



## Options

## Summary

Thanks for reading this and hope it meets all your command-line parsing needs! 😸
